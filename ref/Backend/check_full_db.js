require("dotenv").config();
const mongoose = require("mongoose");
const Profile = require("./src/models/profile.model");
const Assessment = require("./src/models/assessment.model");

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const userId = "69e5b45771e7b8f046bc18e8";
        console.log("Checking data for User ID: " + userId);

        const profile = await Profile.findOne({ userId });
        if (profile) {
            console.log("Profile found.");
            console.log("Assessments in profile: " + profile.assessments.length);
            console.log(JSON.stringify(profile.assessments, null, 2));
        } else {
            console.log("Profile NOT found.");
        }

        // Search by userId or email
        const assessments = await Assessment.find({ 
            userId: userId
        });
        
        console.log("\nAssessments in dedicated collection: " + assessments.length);
        console.log(JSON.stringify(assessments, null, 2));

    } catch (err) {
        console.error("Error checking data:", err);
    } finally {
        await mongoose.connection.close();
    }
}

checkData();
