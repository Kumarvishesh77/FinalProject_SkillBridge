const express = require("express");
const profileController = require("../controller/profile.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, profileController.getProfile);
router.put("/update", authMiddleware, profileController.updateProfile);
router.post("/avatar", authMiddleware, profileController.uploadAvatar);
router.post("/assessment/start", authMiddleware, profileController.startAssessment);
router.post("/assessment/save", authMiddleware, profileController.saveAssessment);

module.exports = router;
