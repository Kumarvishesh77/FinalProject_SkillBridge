require("dotenv").config();
const mongoose = require("mongoose");
const Profile = require("./src/models/profile.model");

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const profiles = await Profile.find({ "assessments.0": { $exists: true } });

        if (profiles.length === 0) {
            console.log("No assessments found in any profile.");
        } else {
            console.log(`Found ${profiles.length} profile(s) with assessments.\n`);
            profiles.forEach(p => {
                console.log(`--- Profile for User ID: ${p.userId} ---`);
                p.assessments.forEach((a, index) => {
                    console.log(`Assessment ${index + 1}:`);
                    console.log(`  User: ${a.userName} (${a.userEmail})`);
                    console.log(`  Skill: ${a.skill}`);
                    console.log(`  Level: ${a.level}`);
                    console.log(`  Score: ${a.score}%`);
                    console.log(`  Passed: ${a.passed}`);
                    console.log(`  Date: ${a.date}`);
                    console.log('---------------------------');
                });
            });
        }
    } catch (err) {
        console.error("Error checking data:", err);
    } finally {
        await mongoose.connection.close();
    }
}

checkData();
