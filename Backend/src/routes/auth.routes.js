const express = require("express");
const authController = require("../controller/auth.controller.js")
const authMiddleware = require("../middleware/auth.middleware.js")

const router = express.Router();

router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/get-me', authMiddleware, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;