require("dotenv").config();
const mongoose = require("mongoose");

async function list() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    } finally {
        await mongoose.connection.close();
    }
}
list();
