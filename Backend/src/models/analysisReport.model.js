const mongoose = require("mongoose");

const analysisReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    targetRole: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
    resumeSelectionChance: { type: Number, default: 0 },
    skillCoverage: { type: Number, default: 0 },
    
    strengths: {
        items: [{ type: String }],
        count: { type: Number },
        percentage: { type: Number }
    },
    weaknesses: {
        items: [{ type: String }],
        count: { type: Number },
        percentage: { type: Number }
    },
    moderates: {
        items: [{ type: String }],
        count: { type: Number },
        percentage: { type: Number }
    },
    
    radarData: [{
        skill: { type: String },
        you: { type: Number },
        required: { type: Number }
    }],
    
    skillGap: [{
        skill: { type: String },
        required: { type: String },
        current: { type: String },
        gap: { type: Number }
    }],
    
    resumeReport: {
        rating: { type: Number },
        missing: [{ type: String }],
        exclude: [{ type: String }],
        perfect: [{ type: String }],
        generatedResumePreview: { type: String }
    },
    
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("AnalysisReport", analysisReportSchema);
