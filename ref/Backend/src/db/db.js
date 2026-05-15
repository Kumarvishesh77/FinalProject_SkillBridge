const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected to:', mongoose.connection.name);
    }
    catch (err) {
        console.log('Database connect error:', err);
    }
}

module.exports = connectDB;