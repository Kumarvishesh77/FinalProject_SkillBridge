const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const collection = db.collection('profiles');

        console.log("Starting migration of existing profiles...");
        const profiles = await collection.find().toArray();

        for (let profile of profiles) {
            console.log(`Checking profile for: ${profile.userName || profile._id}`);
            
            // Set defaults if new fields are missing
            const update = {
                $set: {
                    currentStatus: profile.currentStatus || "Beginner",
                    roleOrStudy: profile.roleOrStudy || profile.jobTitle || "Not Set",
                    totalExperience: profile.totalExperience !== undefined ? profile.totalExperience : 0,
                    lastProfileUpdated: new Date()
                }
            };

            await collection.updateOne({ _id: profile._id }, update);
            console.log(`Updated profile: ${profile._id}`);
        }

        console.log("\nMigration complete! All profiles now use the new SkillBridge schema.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
