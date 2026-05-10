const express = require("express");
const router = express.Router();
const assessmentController = require("../controller/assessment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/start", authMiddleware, assessmentController.startAssessment);
router.post("/submit-batch", authMiddleware, assessmentController.submitBatch);
router.post("/finish", authMiddleware, assessmentController.finishAssessment);
router.get("/result/:id", authMiddleware, assessmentController.getResult);
router.get("/history/:userId", authMiddleware, assessmentController.getHistory);

module.exports = router;
