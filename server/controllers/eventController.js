const Event = require("../models/Event");
const { handleControllerError, sendServerError } = require("../utils/errorResponses");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
    try {
        const { search, category, dateFrom, dateTo, free } = req.query;
        let filter = {};

        // Search by title, category, or location (case-insensitive regex)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by date range
        if (dateFrom || dateTo) {
            filter.date = {};
            if (dateFrom) {
                filter.date.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.date.$lte = new Date(dateTo);
            }
        }

        // Filter for free events
        if (free === "true") {
            filter.price = 0;
        }

        const events = await Event.find(filter).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        sendServerError(res);
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("organiser", "name email");
        if (!event) {
            return res.status(404).json({
                message: "Event not found. It may have been removed or the link is incorrect.",
            });
        }
        res.status(200).json(event);
    } catch (error) {
        handleControllerError(res, error);
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organiser: req.user.id,
        };

        if (req.file) {
            // Store clean URL path instead of local file system path
            eventData.bannerImage = `/uploads/${req.file.filename}`;
        }

        const event = await Event.create(eventData);
        res.status(201).json(event);
    } catch (error) {
        handleControllerError(res, error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found. It may have been removed or the link is incorrect.",
            });
        }

        // Check if user is event organiser
        if (event.organiser.toString() !== req.user.id) {
            return res.status(403).json({ message: "User not authorized to update this event" });
        }

        if (req.file) {
            // Store clean URL path
            req.body.bannerImage = `/uploads/${req.file.filename}`;
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(event);
    } catch (error) {
        handleControllerError(res, error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found. It may have been removed or the link is incorrect.",
            });
        }

        // Check if user is event organiser
        if (event.organiser.toString() !== req.user.id) {
            return res.status(403).json({ message: "User not authorized to delete this event" });
        }

        await event.deleteOne();

        res.status(200).json({ message: "Event removed" });
    } catch (error) {
        handleControllerError(res, error);
    }
};
