require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user.model");

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`ID: ${u._id}, Fullname: ${u.fullname}, Email: ${u.email}, Username: ${u.username}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
    }
}
checkUsers();
