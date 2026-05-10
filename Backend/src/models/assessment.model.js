const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ["Overall Proficiency", "Particular Skill Assessment"],
        required: true
    },
    skillName: {
        type: String,
        required: true
    },
    selectedLevel: {
        type: String,
        enum: ["Basic", "Intermediate", "Advanced", "Unsure"],
        required: true
    },
    verifiedLevel: {
        type: String,
        default: "Pending"
    },
    score: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Started", "In Progress", "Completed"],
        default: "Started"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Assessment", assessmentSchema);
