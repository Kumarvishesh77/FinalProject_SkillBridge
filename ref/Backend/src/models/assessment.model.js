const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Started", "Completed"],
        default: "Started"
    },
    score: {
        type: Number,
        default: 0
    },
    passed: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Assessment", assessmentSchema);
