const mongoose = require('mongoose');
require('dotenv').config();

async function checkSync() {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database:", mongoose.connection.name);
        
        const emailToSearch = "vc712244@gmail.com"; // User's requested email
        
        // Find User
        const User = mongoose.connection.db.collection('users');
        const user = await User.findOne({ email: emailToSearch });
        
        if (!user) {
            console.log(`\nERROR: No user found with email ${emailToSearch}`);
            process.exit(0);
        }

        console.log(`\nFound User: ${user.fullname} (${user._id})`);

        // Find Profile
        const Profile = mongoose.connection.db.collection('profiles');
        const profile = await Profile.findOne({ userId: user._id });

        if (!profile) {
            console.log("ERROR: No profile found for this user.");
        } else {
            console.log("\n--- CURRENT DATA IN MONGODB ---");
            console.log("Full Name:", profile.userName);
            console.log("Current Status:", profile.currentStatus);
            console.log("Role/Study:", profile.roleOrStudy);
            console.log("Total Experience:", profile.totalExperience);
            console.log("Experience Level (Derived):", profile.totalExperience < 1 ? "Entry" : (profile.totalExperience < 5 ? "Mid" : "Senior"));
            console.log("-------------------------------\n");
            
            console.log("Full Object for Debugging:");
            console.log(JSON.stringify(profile, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error("Check failed:", err);
        process.exit(1);
    }
}

checkSync();
