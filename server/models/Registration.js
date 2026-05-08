const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event is required"],
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Attendee is required"],
    },
    ticketId: {
        type: String,
        unique: true,
        required: [true, "Ticket ID is required"],
    },
    qrCodeData: {
        type: String, // Stores base64 PNG string
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed",
    },
    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound unique index to prevent duplicate registrations for the same event by the same user
registrationSchema.index({ event: 1, attendee: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
