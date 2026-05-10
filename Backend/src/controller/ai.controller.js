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
    const { currentRole, targetRole, jobDescription, skills, workDomain, totalExperience, currentDomain, resumeFileName } = req.body;
    const userId = req.user.id;

    if (!targetRole) {
        return res.status(400).json({ success: false, message: "Target role is required." });
    }

    try {
        console.log(`[AI Gap Analysis] Request for User ${userId}, TargetRole=${targetRole}`);
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey || apiKey === "dummy_key") throw new Error("Missing API Key");

        const genAIInstance = new GoogleGenerativeAI(apiKey);
        
        console.log(`[AI Gap Analysis] Data - Skills: ${skills?.length}, Desc: ${jobDescription?.length} chars`);
        
        const prompt = `
            You are a Senior Career Strategy AI and Expert Technical Recruiter. 
            Generate a high-quality, professional Skill Gap Analysis for a user transitioning to a target role.
            
            USER PROFILE CONTEXT:
            - Current Role: ${currentRole || 'Not specified'}
            - Work Domain: ${workDomain || currentDomain || 'Not specified'}
            - Total Experience: ${totalExperience || 0} years
            - User's Current Skills (Detailed): ${JSON.stringify(skills || [])}
            - Resume Filename: ${resumeFileName || 'Not uploaded'}

            TARGET GOAL:
            - Target Role: ${targetRole}
            - Target Job Description: ${jobDescription || 'Not specified'}

            Your Goal:
            Perform a DEEP analysis comparing the User's Profile Context against the Target Goal. 
            1. Evaluate if their years of experience and domain background align with the target job description.
            2. Identify gaps in their current skill set (levels: Beginner/Intermediate/Advanced/Expert).
            3. Use the Resume Filename as a hint (assume the user has provided a resume) to give better feedback.

            Mandatory Sections (STRICT JSON):
            1. matchScore (0-100): Weighted calculation based on role, domain, and skills.
            2. resumeSelectionChance (0-100): Likelihood of passing an ATS/Recruiter screen.
            3. skillCoverage (0-100): Percentage of core required skills present.
            4. strengths, weaknesses, moderates:
               - Categorize user's skills specifically for the target role.
               - items: Array of strings.
            5. radarData: Exactly 6 core technical skills for the "${targetRole}". 
               - "you": Score (0-100) based on proficiency/experience.
               - "required": The ideal score for this role.
            6. skillGap: 4-6 specific skills needed. 
               - Compare "required" level vs user's "current" level.
               - "gap": Numerical value (0-100).
            7. resumeReport:
               - missing: Specific keywords, domain-specific projects, or certifications.
               - exclude: Recommendations on what to remove.
               - perfect: Highlighting the strongest alignment.
               - generatedResumePreview: A professionally rewritten "Professional Summary" (70-100 words) that bridges their ${totalExperience} years of experience into the ${targetRole} role.

            Format: STRICT VALID JSON ONLY. Do not include markdown code blocks.
            Ensure all numbers are integers.
        `;

        const modelNames = ["gemini-2.5-flash", "gemini-1.5-pro"];
        let analysisData = null;
        let lastError = null;

        for (const modelName of modelNames) {
            try {
                console.log(`[AI Gap Analysis] Attempting with model: ${modelName}`);
                const model = genAIInstance.getGenerativeModel({ 
                    model: modelName, 
                    generationConfig: { 
                        maxOutputTokens: 4000, 
                        temperature: 0.1, 
                        response_mime_type: "application/json" 
                    } 
                });

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const responseText = response.text().trim();
                
                console.log(`[AI Gap Analysis] ${modelName} Response Length: ${responseText.length}`);
                
                const cleanText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
                
                if (!cleanText || cleanText.length < 100) {
                    throw new Error(`AI (${modelName}) returned an suspiciously short response.`);
                }

                try {
                    analysisData = JSON.parse(cleanText);
                    
                    // Critical validation and default values to prevent frontend crash
                    if (analysisData) {
                        analysisData.matchScore = analysisData.matchScore || 0;
                        analysisData.resumeSelectionChance = analysisData.resumeSelectionChance || 0;
                        analysisData.skillCoverage = analysisData.skillCoverage || 0;
                        analysisData.strengths = analysisData.strengths || { items: [], count: 0, percentage: 0 };
                        analysisData.weaknesses = analysisData.weaknesses || { items: [], count: 0, percentage: 0 };
                        analysisData.moderates = analysisData.moderates || { items: [], count: 0, percentage: 0 };
                        analysisData.radarData = Array.isArray(analysisData.radarData) ? analysisData.radarData : [];
                        analysisData.skillGap = Array.isArray(analysisData.skillGap) ? analysisData.skillGap : [];
                        analysisData.resumeReport = analysisData.resumeReport || { rating: 0, missing: [], exclude: [], perfect: [], generatedResumePreview: "" };
                        
                        break; // Success
                    }
                } catch (parseError) {
                    console.error(`[AI Parse Error] Content:`, cleanText);
                    throw parseError;
                }
            } catch (err) {
                console.warn(`[AI] ${modelName} failed: ${err.message}`);
                lastError = err;
            }
        }

        if (!analysisData) {
            throw lastError || new Error("All AI models failed to generate a valid report.");
        }

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
        
        // Fallback Mock Response for Production Resilience
        const fallbackData = {
            matchScore: 45,
            resumeSelectionChance: 30,
            skillCoverage: 50,
            strengths: { items: ["General technical knowledge", "Communication skills"], count: 2, percentage: 20 },
            weaknesses: { items: ["Domain-specific expertise", "Advanced tooling"], count: 2, percentage: 30 },
            moderates: { items: ["Team collaboration", "Problem solving"], count: 2, percentage: 25 },
            radarData: [
                { skill: "Frontend", you: 40, required: 80 },
                { skill: "Backend", you: 30, required: 75 },
                { skill: "DevOps", you: 20, required: 70 },
                { skill: "Soft Skills", you: 60, required: 80 },
                { skill: "Architecture", you: 25, required: 85 },
                { skill: "Security", you: 15, required: 70 }
            ],
            skillGap: [
                { skill: "Target Role Specifics", required: "Advanced", current: "Beginner", gap: 60 }
            ],
            resumeReport: {
                rating: 50,
                missing: ["Professional portfolio link", "Recent project highlights"],
                exclude: ["Outdated skill listings"],
                perfect: ["Educational background", "Contact details"],
                generatedResumePreview: "AI analysis failed to generate a preview. Please try again."
            }
        };

        return res.status(200).json({ 
            success: true, 
            data: fallbackData, 
            isFallback: true, 
            errorMessage: error.message 
        });
    }
}

async function getLatestGapAnalysis(req, res) {
    try {
        const userId = req.user.id;
        const latestReport = await AnalysisReport.findOne({ userId }).sort({ createdAt: -1 });
        
        if (!latestReport) {
            return res.status(200).json({ success: true, data: null });
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
