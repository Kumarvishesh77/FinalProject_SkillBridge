const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    userName: { type: String },
    userEmail: { type: String },
    avatar: {
        type: String,
        default: "/profileplaceHolder.jfif"
    },
    
    // Enterprise Fields from Week3Phase2
    jobTitle: { type: String, default: "" },
    department: { type: String, default: "" },
    organizationName: { type: String, default: "SkillBridge" },
    dob: { type: Date },
    nationality: { type: String, default: "" },
    secondaryEmail: { type: String, default: "" },
    reportingManager: { type: String, default: "" },
    employmentType: {
        type: String,
        enum: ["Permanent", "Contract", "Intern", "Part-time"],
        default: "Permanent"
    },
    joiningDate: { type: Date },
    workLocation: { type: String, default: "" },
    residentialAddress: { type: String, default: "" },
    officeEmail: { type: String, default: "" },
    personalEmail: { type: String, default: "" },
    officePhone: { type: String, default: "" },
    emergencyContactName: { type: String, default: "" },
    emergencyContactNumber: { type: String, default: "" },
    officeAddress: { type: String, default: "" },
    govtIdType: { type: String, default: "" },
    idNumber: { type: String, default: "" },
    nationalId: { type: String, default: "" },
    workAuthorization: { type: String, default: "" },
    backgroundVerificationStatus: {
        type: String,
        enum: ["Not Started", "In Progress", "Verified", "Rejected"],
        default: "Not Started"
    },

    // Basic Details (Additional)
    age: { type: Number },
    gender: { type: String },

    // Career Status
    currentStatus: {
        type: String,
        enum: ["Student", "Working Professional", "Career Switcher", "Beginner"],
        default: "Beginner"
    },
    roleOrStudy: { type: String, default: "" },
    totalExperience: { type: Number, default: 0 },
    
    // Skills & Goals
    skills: [{
        name: { type: String },
        proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] }
    }],
    targetRole: { type: String, default: "" },
    
    // Other Details
    mobileNumber: { type: String, default: "" },
    
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
