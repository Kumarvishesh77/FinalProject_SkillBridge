const Assessment = require("../models/assessment.model");
const Result = require("../models/result.model");
const aiService = require("../services/ai.service");

exports.startAssessment = async (req, res) => {
    try {
        const { type, skillName, selectedLevel } = req.body;
        const userId = req.user.id;

        const assessment = await Assessment.create({
            userId,
            type,
            skillName,
            selectedLevel,
            status: "Started"
        });

        // Generate first batch of questions
        const questions = await aiService.generateQuestions(skillName, selectedLevel);

        res.status(201).json({
            success: true,
            assessmentId: assessment._id,
            questions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitBatch = async (req, res) => {
    try {
        const { assessmentId, answers } = req.body;
        
        const assessment = await Assessment.findOne({ _id: assessmentId, userId: req.user.id });
        if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found or unauthorized" });

        const evaluation = await aiService.evaluateAnswers(answers);
        
        // Logic for adaptive flow if "Unsure"
        let shouldContinue = true;
        let nextQuestions = [];
        
        if (assessment.selectedLevel === "Unsure") {
            // Logic to decide if continue based on score
            if (evaluation.score < 30) shouldContinue = false;
        } else {
            // Fixed level logic - usually one or two batches
            shouldContinue = false; 
        }

        if (shouldContinue) {
            nextQuestions = await aiService.generateQuestions(assessment.skillName, assessment.selectedLevel);
        }

        res.status(200).json({
            success: true,
            score: evaluation.score,
            shouldContinue,
            nextQuestions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.finishAssessment = async (req, res) => {
    try {
        const { assessmentId, finalScore } = req.body;

        const assessment = await Assessment.findOne({ _id: assessmentId, userId: req.user.id });
        if (!assessment) return res.status(404).json({ success: false, message: "Assessment not found or unauthorized" });

        const verifiedLevel = await aiService.detectSkillLevel(finalScore, assessment.selectedLevel);
        const feedback = await aiService.generateFeedback(assessmentId, finalScore);
        const skillGap = await aiService.generateSkillGap(assessment.skillName, verifiedLevel);

        assessment.verifiedLevel = verifiedLevel;
        assessment.score = finalScore;
        assessment.status = "Completed";
        await assessment.save();

        const result = await Result.create({
            assessmentId,
            strengths: feedback.strengths,
            weaknesses: feedback.weaknesses,
            confidenceAlignment: "High", // Mock
            skillGap,
            finalScore,
            summary: feedback.summary
        });

        res.status(200).json({
            success: true,
            assessment,
            result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getResult = async (req, res) => {
    try {
        const result = await Result.findOne({ assessmentId: req.params.id }).populate('assessmentId');
        if (!result) return res.status(404).json({ success: false, message: "Result not found" });
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Assessment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
