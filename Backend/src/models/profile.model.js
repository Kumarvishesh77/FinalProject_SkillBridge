const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    // Personal Info (Mapped from Frontend)
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    userName: { type: String }, // Keep for legacy/compat
    userEmail: { type: String },
    phone: { type: String, default: "" }, // Mapped from phone
    mobileNumber: { type: String, default: "" }, // Keep for legacy/compat
    about: { type: String, default: "" },
    avatar: {
        type: String,
        default: "/profileplaceHolder.jfif"
    },
    
    // Basic Details
    age: { type: Number },
    gender: { type: String },
    
    // Enterprise & Detailed Info
    organizationName: { type: String, default: "" },
    dob: { type: Date },
    nationality: { type: String, default: "" },
    secondaryEmail: { type: String, default: "" },
    residentialAddress: { type: String, default: "" },
    department: { type: String, default: "" },
    reportingManager: { type: String, default: "" },
    employmentType: {
        type: String,
        enum: ["Permanent", "Contract", "Intern", "Part-time"],
        default: "Permanent"
    },
    joiningDate: { type: Date },
    workLocation: { type: String, default: "" },
    govtIdType: { type: String, default: "" },
    idNumber: { type: String, default: "" },
    nationalId: { type: String, default: "" },
    workAuthorization: { type: String, default: "" },
    backgroundVerificationStatus: {
        type: String,
        enum: ["Not Started", "In Progress", "Verified", "Rejected"],
        default: "Not Started"
    },

    // Career Information (Mapped from Frontend)
    currentStatus: {
        type: String,
        enum: ["Student", "Working Professional", "Career Switcher", "Beginner"],
        default: "Beginner"
    },
    roleOrStudy: { type: String, default: "" }, // Current Job Role
    totalExperience: { type: Number, default: 0 },
    workDomain: { type: String, default: "" },
    targetDomain: { type: String, default: "" },
    targetRole: { type: String, default: "" }, // Target Job Role
    
    // Skills details
    skills: [{
        name: { type: String },
        proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced", "Expert"] },
        experience: { type: String, default: "" },
        confidence: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }
    }],
    
    // Completion Logic
    profileStatus: {
        type: String,
        enum: ["Complete", "Incomplete"],
        default: "Incomplete"
    },
    completionPercentage: { type: Number, default: 0 },
assessments: [{
    skill: { type: String },
    level: { type: String },
    score: { type: Number },
    passed: { type: Boolean },
    date: { type: Date, default: Date.now }
}],

gapAnalysis: {
    type: Object,
    default: null
},

lastProfileUpdated: { type: Date, default: Date.now }

}, { timestamps: true, strict: false });

module.exports = mongoose.model("Profile", profileSchema);
