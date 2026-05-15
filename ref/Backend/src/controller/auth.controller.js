const userModel = require("../models/user.model");
const profileModel = require("../models/profile.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendResetEmail } = require("../services/email.service");

const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
};

async function registerUser(req, res) {
    try {
        console.log("Registration Request Body:", req.body);
        const { fullname, email, password, age, gender, company, role = "user" } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ 
                message: "Password does not meet complexity requirements: min. 8 chars, including A-Z, a-z, 0-9, and @$!%." 
            });
        }

        const username = fullname;

        const userAlreadyExist = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (userAlreadyExist) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            username,
            fullname,
            email,
            password: hashedPassword,
            age,
            gender,
            company,
            role
        });

        await user.save();

        // Auto-create Profile with registration data
        await profileModel.create({
            userId: user._id,
            userName: user.fullname,
            userEmail: user.email,
            age: user.age,
            gender: user.gender,
            organizationName: user.company || "SkillBridge",
            avatar: "/profileplaceHolder.jfif",
            profileStatus: "Incomplete",
            completionPercentage: 30 
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "default_secret"
        );

        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            message: "User register successful",
            user: {
                userid: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                gender: user.gender,
                company: user.company,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        console.log("Login Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "default_secret"
        );

        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                gender: user.gender,
                company: user.company,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(200).json({ message: "If an account exists with this email, a password reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}`;

        const emailSent = await sendResetEmail(user.email, resetLink);

        if (!emailSent) {
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }

        return res.status(200).json({ message: "If an account exists with this email, a password reset link has been sent." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ 
                message: "Password does not meet complexity requirements: min. 8 chars, including A-Z, a-z, 0-9, and @$!%." 
            });
        }

        const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

        const user = await userModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ message: "Password has been successfully reset. You can now login." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
