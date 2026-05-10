/**
 * AI Question Generator Controller
 * Generates high-quality questions using Google Gemini AI with local fallback.
 */
/**
 * AI Question Generator Controller
 * Generates high-quality questions using Google Gemini AI with local fallback.
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const AnalysisReport = require("../models/analysisReport.model");
const Profile = require("../models/profile.model");

function handleFallback(skill, level, res, originalError) {
    console.error(`[AI CRITICAL ERROR] Failed to generate dynamic assessment for ${skill}. Reason: ${originalError}`);
    
    // Serve a set of generic technical questions instead of just one "Retry" message
    const questions = [
        { id: 1, type: "mcq", question: `In the context of ${skill}, what is a primary best practice for development?`, options: ["Code Review", "Manual Testing Only", "Hardcoding Secrets", "Ignoring Documentation"], answer: "Code Review" },
        { id: 2, type: "written", question: `Explain the importance of version control when working with ${skill}.`, answer: "Version control allows for tracking changes, collaboration, and reverting to previous states." },
        { id: 3, type: "mcq", question: `Which tool is commonly used for managing dependencies in ${skill}?`, options: ["Package Manager", "Text Editor", "Operating System", "Browser"], answer: "Package Manager" },
        { id: 4, type: "mcq", question: `What does the term 'Production' refer to in a ${skill} workflow?`, options: ["User Environment", "Development Machine", "Staging Server", "Local Database"], answer: "User Environment" },
        { id: 5, type: "written", question: `Describe a common troubleshooting step for ${skill} issues.`, answer: "Checking logs, verifying configuration, and checking network connectivity." },
        { id: 6, type: "mcq", question: `What is the purpose of unit testing in ${skill}?`, options: ["Verify small units", "Test the whole system", "Check performance", "Monitor traffic"], answer: "Verify small units" },
        { id: 7, type: "mcq", question: `Which of these is a key security consideration for ${skill}?`, options: ["Encryption", "Low Contrast", "Slow Speed", "Local Storage Only"], answer: "Encryption" },
        { id: 8, type: "written", question: `How can performance be optimized for ${skill}?`, answer: "Caching, efficient algorithms, and reducing network overhead." },
        { id: 9, type: "mcq", question: `What is the role of an API in ${skill}?`, options: ["Communication interface", "Data storage", "UI component", "Compiler"], answer: "Communication interface" },
        { id: 10, type: "mcq", question: `Which environment is used for final testing before release?`, options: ["Staging", "Production", "Local", "IDE"], answer: "Staging" }
    ];

    return res.status(200).json({
        skill,
        level,
        generatedAt: new Date().toISOString(),
        questions: questions,
        isFallback: true,
        errorNote: "AI Quota/Key Error. Showing generic technical assessment."
    });
}

async function generateAssessment(req, res) {
    const { skill, level } = req.body;
    try {
        console.log(`[AI] Request: Skill=${skill}, Level=${level}`);

        if (!skill || !level) {
            return res.status(400).json({ message: "Skill and Level are required" });
        }

        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey || apiKey === "dummy_key") {
            return handleFallback(skill, level, res, "Missing API Key");
        }

        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const questionCount = 10; // Standardized to 10 questions for all levels

        const isBeginner = level.toLowerCase() === 'beginner';
        const prompt = `
            Task: Generate assessment questions STRICTLY based on the selected skill: "${skill}" and level: "${level}".
            
            Strict Requirements:
            1. Questions must ONLY relate to "${skill}" and its technical domain.
            2. Difficulty: ${level} level. 
            3. Count: Exactly ${questionCount} unique questions.
            4. Mix of types: 
               - Include "mcq" (single choice).
               - Include "checkbox" (multiple correct choices).
               ${isBeginner ? '- Do NOT include "written" questions.' : '- Include "written" (short description) questions.'}
            
            Technical Diversity:
            - Practical scenarios, Troubleshooting, and Deep-dive specific to "${skill}".

            Format: Valid JSON ONLY.
            Structure: 
            {
                "questions": [
                    {
                        "id": 1, 
                        "type": "mcq", 
                        "question": "...", 
                        "options": ["A", "B", "C", "D"], 
                        "answer": "A"
                    },
                    {
                        "id": 2, 
                        "type": "checkbox", 
                        "question": "Select all that apply...", 
                        "options": ["Opt 1", "Opt 2", "Opt 3", "Opt 4"], 
                        "answer": ["Opt 1", "Opt 3"]
                    },
                    ${isBeginner ? '' : '{"id": 3, "type": "written", "question": "...", "answer": "Model answer..."}'}
                ]
            }
        `;

        const modelNames = ["gemini-2.5-flash", "gemini-1.5-pro"];
        let result;
        let lastError;

        for (const modelName of modelNames) {
            try {
                console.log(`[AI] Attempting ${skill} assessment with model: ${modelName}`);
                const model = genAIInstance.getGenerativeModel({ 
                    model: modelName,
                    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 }
                });

                const resultWrapper = await model.generateContent(prompt);
                result = resultWrapper;
                if (result) break;
            } catch (err) {
                console.warn(`[AI] Model ${modelName} failed for ${skill}: ${err.message}`);
                lastError = err;
            }
        }

        if (!result) throw lastError || new Error("All models failed");

        const response = await result.response;
        const responseText = response.text().trim();
        const cleanText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
        const assessmentData = JSON.parse(cleanText);

        return res.status(200).json({
            skill,
            level,
            generatedAt: new Date().toISOString(),
            questions: assessmentData.questions
        });
    } catch (error) {
        console.error("[AI Error]:", error.message);
        return handleFallback(skill, level, res, error.message);
    }
}

async function generateGapAnalysis(req, res) {
    const { currentRole, targetRole, jobDescription, skills } = req.body;
    const userId = req.user.id;

    if (!targetRole) {
        return res.status(400).json({ success: false, message: "Target role is required." });
    }

    try {
        console.log(`[AI Gap Analysis] Request for User ${userId}, TargetRole=${targetRole}`);
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey || apiKey === "dummy_key") throw new Error("Missing API Key");

        const genAIInstance = new GoogleGenerativeAI(apiKey);
        
        const prompt = `
            You are a Senior Career Strategy AI. Generate a comprehensive Skill Gap Analysis.
            
            Input Data:
            - Current Role: ${currentRole || 'Not specified'}
            - Target Role: ${targetRole}
            - Target Job Description: ${jobDescription || 'Not specified'}
            - User's Current Skills: ${JSON.stringify(skills || [])}

            Task:
            1. Calculate overall "matchScore", "resumeSelectionChance", and "skillCoverage" (0-100).
            2. Categorize skills into "strengths", "weaknesses", and "moderates".
            3. Provide detailed "radarData" comparing user's current level (0-100) vs required (0-100) for 6 key skills.
            4. Create a "skillGap" list with required level, current level, and a percentage gap.
            5. Provide a "resumeReport" with rating (0-100), items to add (missing), items to remove (exclude), and items to keep (perfect).
            6. Generate a "generatedResumePreview" snippet (text only).

            Format: STRICT VALID JSON ONLY.
            Structure:
            {
                "matchScore": number,
                "resumeSelectionChance": number,
                "skillCoverage": number,
                "strengths": { "items": string[], "count": number, "percentage": number },
                "weaknesses": { "items": string[], "count": number, "percentage": number },
                "moderates": { "items": string[], "count": number, "percentage": number },
                "radarData": [{ "skill": string, "you": number, "required": number }],
                "skillGap": [{ "skill": string, "required": string, "current": string, "gap": number }],
                "resumeReport": {
                    "rating": number,
                    "missing": string[],
                    "exclude": string[],
                    "perfect": string[],
                    "generatedResumePreview": string
                }
            }
        `;

        const model = genAIInstance.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: { maxOutputTokens: 3000, temperature: 0.2, response_mime_type: "application/json" } 
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisData = JSON.parse(response.text());

        // Save to DB
        const report = new AnalysisReport({
            userId,
            targetRole,
            ...analysisData
        });
        await report.save();

        return res.status(200).json({ success: true, data: analysisData });
    } catch (error) {
        console.error("[AI Gap Analysis Error]:", error);
        return res.status(500).json({ success: false, message: "AI Analysis failed.", error: error.message });
    }
}

async function getLatestGapAnalysis(req, res) {
    try {
        const userId = req.user.id;
        const latestReport = await AnalysisReport.findOne({ userId }).sort({ createdAt: -1 });
        
        if (!latestReport) {
            return res.status(404).json({ success: false, message: "No analysis report found." });
        }

        return res.status(200).json({ success: true, data: latestReport });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch report." });
    }
}

async function deleteGapAnalysis(req, res) {
    try {
        const userId = req.user.id;
        await AnalysisReport.deleteMany({ userId });
        return res.status(200).json({ success: true, message: "Reports deleted." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete reports." });
    }
}

module.exports = { generateAssessment, generateGapAnalysis, getLatestGapAnalysis, deleteGapAnalysis };
