const express = require("express");
const aiController = require("../controller/ai.controller.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post('/generate-assessment', aiController.generateAssessment);
router.post('/generate-gap-analysis', authMiddleware, aiController.generateGapAnalysis);

module.exports = router;