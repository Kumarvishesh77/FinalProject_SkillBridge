const express = require("express");
const aiController = require("../controller/ai.controller.js");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Public assessments (if needed, otherwise protect them)
router.post('/generate-assessment', aiController.generateAssessment);

// Protected Analysis Routes
router.post('/generate-gap-analysis', authMiddleware, aiController.generateGapAnalysis);
router.get('/latest-gap-analysis', authMiddleware, aiController.getLatestGapAnalysis);
router.delete('/gap-analysis', authMiddleware, aiController.deleteGapAnalysis);

module.exports = router;
