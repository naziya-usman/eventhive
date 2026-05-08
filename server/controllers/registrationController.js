const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

// @desc    Register for an event
// @route   POST /api/registrations/:id
// @access  Private
exports.registerForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const attendeeId = req.user.id;

        // 1) Find event by req.params.id — return 404 if not found
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // 2) Check event.date > new Date() — return 400 "Event has already passed" if not
        if (new Date(event.date) <= new Date()) {
            return res.status(400).json({ message: "Event has already passed" });
        }

        // 3) Check event.registeredCount < event.capacity — return 400 "Event is full" if not
        if (event.registeredCount >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }

        // 4) Check no existing Registration with this event and attendee combo — return 409 "Already registered" if found
        const existingRegistration = await Registration.findOne({
            event: eventId,
            attendee: attendeeId,
        });
        if (existingRegistration) {
            return res.status(409).json({ message: "Already registered" });
        }

        // 5) Generate ticketId using the uuid v4 function
        const ticketId = uuidv4();

        // 6) Generate qrCodeData using qrcode.toDataURL(ticketId)
        const qrCodeData = await QRCode.toDataURL(ticketId);

        // 7) Create and save the Registration
        const registration = await Registration.create({
            event: eventId,
            attendee: attendeeId,
            ticketId,
            qrCodeData,
        });

        // 8) Increment event.registeredCount by 1 and save the event
        event.registeredCount += 1;
        await event.save();

        // 9) Return the saved registration as JSON
        res.status(201).json(registration);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get user's tickets
// @route   GET /api/registrations/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
    try {
        const registrations = await Registration.find({ attendee: req.user.id }).populate("event");
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private
exports.cancelRegistration = async (req, res) => {
    try {
        const registration = await Registration.findOne({
            event: req.params.id,
            attendee: req.user.id,
            status: "confirmed"
        });

        if (!registration) {
            return res.status(404).json({ message: "Registration not found or already cancelled" });
        }

        // Set status to cancelled
        registration.status = "cancelled";
        await registration.save();

        // Decrement event.registeredCount
        await Event.findByIdAndUpdate(req.params.id, { $inc: { registeredCount: -1 } });

        res.status(200).json({ message: "Registration cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
