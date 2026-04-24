const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    category: {
        type: String,
        required: [true, "Please select a category"],
        enum: ["music", "sports", "tech", "food", "arts", "other"],
    },
    date: {
        type: Date,
        required: [true, "Please add a date"],
    },
    location: {
        type: String,
        required: [true, "Please add a location"],
    },
    capacity: {
        type: Number,
        required: [true, "Please add a capacity"],
        min: [1, "Capacity must be at least 1"],
    },
    price: {
        type: Number,
        default: 0,
    },
    bannerImage: {
        type: String,
    },
    organiser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    registeredCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Event", eventSchema);
