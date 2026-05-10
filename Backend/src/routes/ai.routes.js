const express = require("express");
const aiController = require("../controller/ai.controller.js")

const router = express.Router();

router.post('/generate-assessment', aiController.generateAssessment);
router.post('/generate-gap-analysis', aiController.generateGapAnalysis);

module.exports = router;