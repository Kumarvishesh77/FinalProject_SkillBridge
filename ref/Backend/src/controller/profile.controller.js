const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const Assessment = require("../models/assessment.model");
const mongoose = require("mongoose");
const { generateAndSaveGapAnalysis } = require("../services/ai.service");

const deriveExperienceLevel = (years) => {
    const yrs = parseFloat(years) || 0;
    if (yrs < 1) return "Entry Level";
    if (yrs < 5) return "Mid Level";
    return "Senior Level";
};

const calculateCompletion = (profile, user) => {
    let percentage = 0;
    const name = profile.userName || (user && user.fullname);
    if (name && name.trim() !== "") percentage += 30;
    if (profile.currentStatus && profile.roleOrStudy && profile.roleOrStudy.trim() !== "") percentage += 30;
    if (profile.skills && profile.skills.length > 0) percentage += 40;
    return percentage;
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        let profile = await Profile.findOne({ userId }).populate("userId", "username fullname email age gender role createdAt");
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!profile) {
            profile = await Profile.create({ 
                userId,
                userName: user.fullname,
                userEmail: user.email,
                age: user.age,
                gender: user.gender === "Others" ? "Other" : user.gender,
                mobileNumber: user.mobileNumber || "" 
            });
            profile = await Profile.findById(profile._id).populate("userId", "username fullname email age gender role createdAt");
        }

        const responseData = profile.toObject();
        responseData.experienceLevel = deriveExperienceLevel(profile.totalExperience);
        responseData.completionPercentage = calculateCompletion(profile, user);
        responseData.profileStatus = responseData.completionPercentage === 100 ? "Complete" : "Incomplete";
        
        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const incomingData = req.body;
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // 1. STRICT ALLOW-LIST: Only these fields will ever be saved to the Profile
        const allowedFields = [
            "userName", "userEmail", "avatar", "age", "gender", 
            "currentStatus", "roleOrStudy", "totalExperience", 
            "skills", "targetRole", "mobileNumber",
            "jobTitle", "department", "organizationName", "nationality", "dob",
            "secondaryEmail", "reportingManager", "employmentType", "workLocation", "joiningDate",
            "certifications", "resumeUrl", "officeEmail", "personalEmail",
            "officePhone", "emergencyContactName", "emergencyContactNumber",
            "residentialAddress", "officeAddress", "govtIdType", "idNumber",
            "nationalId", "workAuthorization", "backgroundVerificationStatus",
            "education"
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (incomingData[field] !== undefined) updates[field] = incomingData[field];
        });

        // Specific mappings from UI
        if (incomingData.fullname) {
            updates.userName = incomingData.fullname;
            user.fullname = incomingData.fullname;
        }
        if (incomingData.email) updates.userEmail = incomingData.email;
        if (incomingData.targetGoal) updates.targetRole = incomingData.targetGoal;
        if (incomingData.age) user.age = incomingData.age;
        if (incomingData.gender) user.gender = incomingData.gender;

        if (user.isModified()) await user.save();

        if (updates.totalExperience !== undefined) {
            updates.totalExperience = parseFloat(updates.totalExperience) || 0;
        }

        updates.lastProfileUpdated = new Date();

        const nativeCollection = mongoose.connection.db.collection('profiles');
        await nativeCollection.updateOne(
            { userId: new mongoose.Types.ObjectId(userId) },
            { 
                $set: updates
            },
            { upsert: true }
        );

        const updatedProfile = await Profile.findOne({ userId });
        updatedProfile.completionPercentage = calculateCompletion(updatedProfile, user);
        updatedProfile.profileStatus = updatedProfile.completionPercentage === 100 ? "Complete" : "Incomplete";
        await updatedProfile.save();

        const responseData = updatedProfile.toObject();
        responseData.experienceLevel = deriveExperienceLevel(updatedProfile.totalExperience);

        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error("STRICT UPDATE FAILED:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const { avatarUrl } = req.body;
        const profile = await Profile.findOneAndUpdate({ userId }, { avatar: avatarUrl, lastProfileUpdated: Date.now() }, { new: true });
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.startAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skill, level } = req.body;
        console.log(`[Assessment Start] User=${userId}, Skill=${skill}, Level=${level}`);
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        const newAssessment = new Assessment({ 
            userId,
            userName: user.fullname || user.username, 
            userEmail: user.email, 
            skill, 
            level, 
            status: "Started" 
        });
        await newAssessment.save();
        console.log(`[Assessment Start] Created ID: ${newAssessment._id}`);
        
        res.status(200).json({ success: true, message: "Assessment start recorded", assessmentId: newAssessment._id });
    } catch (error) {
        console.error("[Assessment Start Error]:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.saveAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skill, level, score, passed, assessmentId } = req.body;
        console.log(`[Assessment Save] User=${userId}, Skill=${skill}, Score=${score}, Passed=${passed}, ID=${assessmentId}`);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let finalAssessment;
        if (assessmentId) {
            console.log(`[Assessment Save] Updating existing assessment: ${assessmentId}`);
            finalAssessment = await Assessment.findByIdAndUpdate(
                assessmentId, 
                { score, passed, status: "Completed", date: Date.now() }, 
                { new: true }
            );
        }

        if (!finalAssessment) {
            console.log(`[Assessment Save] Creating new assessment record`);
            finalAssessment = new Assessment({ 
                userId,
                userName: user.fullname || user.username, 
                userEmail: user.email, 
                skill, 
                level, 
                score, 
                passed, 
                status: "Completed" 
            });
            await finalAssessment.save();
        }

        const profile = await Profile.findOne({ userId });
        if (profile) {
            console.log(`[Assessment Save] Updating profile for user: ${userId}`);
            profile.assessments.push({ skill, level, score, passed, date: Date.now() });
            profile.lastProfileUpdated = Date.now();
            await profile.save();
            console.log(`[Assessment Save] Profile updated successfully`);

            // TRIGGER BACKGROUND GAP ANALYSIS
            // We don't await this as we want to respond to the user immediately
            generateAndSaveGapAnalysis(userId).catch(err => {
                console.error(`[Background Gap Analysis Error] for user ${userId}:`, err.message);
            });
        } else {
            console.warn(`[Assessment Save] Profile not found for user: ${userId}`);
        }

        res.status(200).json({ success: true, message: "Assessment completion recorded successfully", data: finalAssessment });
    } catch (error) {
        console.error("[Assessment Save Error]:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
