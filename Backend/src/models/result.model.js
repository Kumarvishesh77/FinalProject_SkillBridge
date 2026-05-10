const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment',
        required: true
    },
    strengths: [String],
    weaknesses: [String],
    confidenceAlignment: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: true
    },
    skillGap: [{
        skill: String,
        requiredLevel: String,
        currentLevel: String,
        gap: String
    }],
    finalScore: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Result", resultSchema);
