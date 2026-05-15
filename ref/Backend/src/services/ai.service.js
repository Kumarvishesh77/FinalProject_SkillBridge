const { GoogleGenerativeAI } = require("@google/generative-ai");
const Profile = require("../models/profile.model");

/**
 * Generates Skill Gap Analysis and saves it to the user's profile.
 * This can be called from the controller or as a background task.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The generated analysis data.
 */
async function generateAndSaveGapAnalysis(userId) {
    try {
        const profile = await Profile.findOne({ userId });
        if (!profile) throw new Error("Profile not found");

        const { targetRole, skills: userSkills, assessments: userAssessments, organizationName: company } = profile;
        const currentRole = profile.currentStatus || 'Not specified';

        if (!targetRole) {
            console.log(`[AI Service] No target role for user ${userId}. Skipping gap analysis.`);
            return null;
        }

        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey || apiKey === "dummy_key") throw new Error("Missing API Key");

        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const passedAssessments = (userAssessments || []).filter(a => a.passed);
        
        const prompt = `
            You are an expert career counselor at ${company || 'SkillBridge'}. Generate a precise Skill Gap Analysis focusing on PROGRESSION to reach the "${targetRole}".
            Input Data: 
            - User's Background: ${currentRole}
            - Target Role: ${targetRole}
            - Current Company: ${company || 'General'}
            - Passed Assessments: ${JSON.stringify(passedAssessments)}
            - Profile Skills: ${JSON.stringify(userSkills || [])}

            Mandatory Logic:
            1. Identify core skills for "${targetRole}" across Beginner, Intermediate, and Advanced levels.
            2. If company is specified, prioritize skills relevant to that company's focus.
            3. Compare these against user's passed assessments.
            4. Classification: "Strength": Level cleared. "Needs Improvement": Lower level cleared, need NEXT level. "Missing Skill": Not yet assessed.
            
            Output Format:
            {
                "completedLevel": "Highest milestone reached",
                "nextLevelTarget": "Immediate next milestone",
                "strengths": [{"name": "Skill Name", "level": "Mastered", "target": "Required"}],
                "skillGaps": [{"name": "Skill Name", "level": "Current", "target": "Next", "type": "Needs Improvement"}],
                "keyAreasForImprovement": ["Point 1", "Point 2", "Point 3"],
                "improvementSummary": "Professional guidance summary."
            }
            Output strictly valid JSON.
        `;

        const modelNames = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro"];
        let result;
        let lastError;

        for (const modelName of modelNames) {
            try {
                console.log(`[AI Service] Attempting analysis with model: ${modelName}`);
                const model = genAIInstance.getGenerativeModel({ 
                    model: modelName, 
                    generationConfig: { maxOutputTokens: 2048, temperature: 0.1 } 
                });
                
                const aiPromise = model.generateContent(prompt);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 15000));
                
                result = await Promise.race([aiPromise, timeoutPromise]);
                if (result) break;
            } catch (err) {
                console.warn(`[AI Service] Model ${modelName} failed: ${err.message}`);
                lastError = err;
            }
        }

        if (!result) throw lastError || new Error("Gap analysis generation failed");

        const response = await result.response;
        const responseText = response.text().trim();
        const cleanText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
        const analysisData = JSON.parse(cleanText);

        // Save to database
        profile.gapAnalysis = analysisData;
        await profile.save();
        console.log(`[AI Service] Gap analysis saved for user ${userId}`);

        return analysisData;
    } catch (error) {
        console.error("[AI Service Error]:", error.message);
        
        // SAVE FALLBACK DATA TO DB SO USER SEES SOMETHING
        try {
            const profile = await Profile.findOne({ userId });
            if (profile && (!profile.gapAnalysis || !profile.gapAnalysis.strengths)) {
                const fallbackData = {
                    completedLevel: "Assessment Phase Active",
                    nextLevelTarget: `Path to ${profile.targetRole || 'Mastery'}`,
                    strengths: [],
                    skillGaps: [],
                    keyAreasForImprovement: ["Complete more technical assessments", "Update your profile skills", "Bridge theoretical knowledge gaps"],
                    improvementSummary: "AI analysis is currently unavailable. Showing assessment-based progress.",
                    isFallback: true
                };
                profile.gapAnalysis = fallbackData;
                await profile.save();
                return fallbackData;
            }
        } catch (dbErr) {
            console.error("[AI Service Fallback Save Error]:", dbErr.message);
        }

        throw error;
    }
}

module.exports = { generateAndSaveGapAnalysis };
