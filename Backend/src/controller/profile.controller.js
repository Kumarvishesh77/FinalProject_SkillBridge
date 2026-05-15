const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const Assessment = require("../models/assessment.model");
const mongoose = require("mongoose");

const deriveExperienceLevel = (years) => {
    const yrs = parseFloat(years) || 0;
    if (yrs < 1) return "Entry Level";
    if (yrs < 5) return "Mid Level";
    return "Senior Level";
};

const calculateCompletion = (profile, user) => {
    let percentage = 0;
    // Personal info (Max 30)
    if (profile.firstName && profile.lastName) percentage += 10;
    if (profile.mobileNumber) percentage += 5;
    if (profile.gender) percentage += 5;
    if (profile.dob) percentage += 5;
    if (profile.about) percentage += 5;
    
    // Career info (Max 40)
    if (profile.currentStatus) percentage += 10;
    if (profile.roleOrStudy) percentage += 10;
    if (profile.targetRole) percentage += 10;
    if (profile.totalExperience !== undefined) percentage += 10;
    
    // Skills & Education (Max 30)
    if (profile.skills && profile.skills.length > 0) percentage += 30;
    
    return Math.min(percentage, 100);
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        let profile = await Profile.findOne({ userId }).populate("userId", "username fullname email age gender orgId role createdAt");
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!profile) {
            const names = (user.fullname || "").split(" ");
            profile = await Profile.create({ 
                userId,
                firstName: names[0] || "",
                lastName: names.slice(1).join(" ") || "",
                userName: user.fullname,
                userEmail: user.email,
                age: user.age,
                gender: user.gender,
                mobileNumber: user.mobileNumber || "",
                phone: user.mobileNumber || ""
            });
            profile = await Profile.findById(profile._id).populate("userId", "username fullname email age gender orgId role createdAt");
        }

        const responseData = profile.toObject();
        responseData.experienceLevel = deriveExperienceLevel(profile.totalExperience);
        responseData.completionPercentage = calculateCompletion(profile, user);
        responseData.profileStatus = responseData.completionPercentage >= 80 ? "Complete" : "Incomplete";
        
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

        // Allowed fields for Profile update
        const allowedFields = [
            "firstName", "lastName", "userName", "userEmail", "avatar", 
            "age", "gender", "phone", "mobileNumber", "about", "organizationName",
            "currentStatus", "roleOrStudy", "totalExperience", 
            "workDomain", "targetDomain", "targetRole", "skills",
            "dob", "nationality", "secondaryEmail", "residentialAddress",
            "department", "reportingManager", "employmentType", "joiningDate",
            "workLocation", "govtIdType", "idNumber", "nationalId", "workAuthorization"
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (incomingData[field] !== undefined) updates[field] = incomingData[field];
        });

        // Specific mappings from Frontend UI
        if (incomingData.fullname) {
            updates.userName = incomingData.fullname;
            user.fullname = incomingData.fullname;
            const names = incomingData.fullname.split(" ");
            updates.firstName = names[0] || "";
            updates.lastName = names.slice(1).join(" ") || "";
        }
        
        // Handle names directly if provided
        if (incomingData.firstName || incomingData.lastName) {
            const fName = incomingData.firstName || updates.firstName || "";
            const lName = incomingData.lastName || updates.lastName || "";
            user.fullname = `${fName} ${lName}`.trim();
        }

        if (incomingData.phone) updates.mobileNumber = incomingData.phone;
        if (incomingData.targetGoal) updates.targetRole = incomingData.targetGoal;
        
        if (user.isModified()) await user.save();

        if (updates.totalExperience !== undefined) {
            updates.totalExperience = parseFloat(updates.totalExperience) || 0;
        }

        updates.lastProfileUpdated = new Date();

        const updatedProfile = await Profile.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, upsert: true }
        );

        updatedProfile.completionPercentage = calculateCompletion(updatedProfile, user);
        updatedProfile.profileStatus = updatedProfile.completionPercentage >= 80 ? "Complete" : "Incomplete";
        await updatedProfile.save();

        const responseData = updatedProfile.toObject();
        responseData.experienceLevel = deriveExperienceLevel(updatedProfile.totalExperience);

        res.status(200).json({ success: true, data: responseData });
    } catch (error) {
        console.error("UPDATE FAILED:", error);
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
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        const newAssessment = new Assessment({ 
            userName: user.fullname || user.username, 
            userEmail: user.email, 
            skill, 
            level, 
            status: "Started" 
        });
        await newAssessment.save();
        res.status(200).json({ success: true, assessmentId: newAssessment._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.saveAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { skill, level, score, passed, assessmentId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let finalAssessment;
        if (assessmentId) {
            finalAssessment = await Assessment.findByIdAndUpdate(
                assessmentId, 
                { score, passed, status: "Completed", date: Date.now() }, 
                { new: true }
            );
        }

        if (!finalAssessment) {
            finalAssessment = new Assessment({ 
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
            profile.assessments.push({ skill, level, score, passed, date: Date.now() });
            profile.lastProfileUpdated = Date.now();
            await profile.save();
        }

        res.status(200).json({ success: true, data: finalAssessment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
