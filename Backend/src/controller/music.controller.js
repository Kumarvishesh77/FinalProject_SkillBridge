const jwt = require("jsonwebtoken");
const musicModel = require("../models/music.model");
const userModel = require("../models/user.model");

async function createMusic(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "unauthorized" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECERT);
        if (decoded.role == !artist) {
            return res.status(403).json({ message: "you don't have privillage to create music" });
        }
    } catch (err) {

        return res.status(401).json({ message: "unauthorized" })
    }


    const { uri, title, artist } = req.body;
    const user = await userModel.findByID(artist);
    

    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }

    const music = new musicModel({
        uri,
        title,
        artist,
    })

}