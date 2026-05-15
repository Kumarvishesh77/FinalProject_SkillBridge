const mongoose = require('mongoose');
require('dotenv').config();

async function hardCleanup() {
    try {
        console.log("Connecting to database for hard cleanup...");
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('profiles');

        console.log("Identifying extra fields to remove...");
        
        // Comprehensive list of fields to REMOVE
        const extraFields = {
            jobTitle: "",
            department: "",
            organizationName: "",
            nationality: "",
            secondaryEmail: "",
            reportingManager: "",
            employmentType: "",
            workLocation: "",
            certifications: "",
            resumeUrl: "",
            officeEmail: "",
            personalEmail: "",
            officePhone: "",
            emergencyContactName: "",
            emergencyContactNumber: "",
            residentialAddress: "",
            officeAddress: "",
            govtIdType: "",
            idNumber: "",
            nationalId: "",
            workAuthorization: "",
            backgroundVerificationStatus: "",
            language: "",
            timeZone: "",
            notificationPreferences: "",
            theme: "",
            communicationPreferences: "",
            education: "",
            careerGoal: "",
            __v: ""
        };

        const result = await collection.updateMany(
            {}, 
            { $unset: extraFields }
        );

        console.log(`\nCleanup complete!`);
        console.log(`Matched documents: ${result.matchedCount}`);
        console.log(`Modified documents: ${result.modifiedCount}`);
        console.log("\nThe database is now strictly limited to SkillBridge profile data.");
        
        process.exit(0);
    } catch (err) {
        console.error("Cleanup failed:", err);
        process.exit(1);
    }
}

hardCleanup();
