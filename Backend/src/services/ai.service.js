const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.generateQuestions = async (skill, level, count = 5) => {
    try {
        const prompt = `Generate ${count} assessment questions for the skill "${skill}" at "${level}" level. 
        The questions should be in JSON format as an array of objects.
        Each object should have:
        - id (string, e.g., "Q1")
        - type (string, one of: "mcq", "descriptive", "coding", "fillup", "case-study")
        - difficulty (string, e.g., "${level}")
        - question (string)
        - options (array of strings, only for "mcq")
        - correctAnswer (string, only for "mcq")
        - placeholder (string, only for "coding")
        - scenario (string, only for "case-study")
        
        Ensure a mix of question types. Return ONLY the JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON if AI wrapped it in markdown
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Question Generation Error:", error);
        // Fallback to basic mock if AI fails
        return [
            {
                id: "Q1",
                type: "mcq",
                difficulty: level,
                question: `What is a core concept of ${skill}?`,
                options: ["Concept A", "Concept B", "Concept C", "Concept D"],
                correctAnswer: "Concept A"
            }
        ];
    }
};

exports.evaluateAnswers = async (batchAnswers) => {
    try {
        const prompt = `Evaluate the following assessment answers: ${JSON.stringify(batchAnswers)}.
        Provide a score out of 100 and a brief feedback string.
        Return as JSON: { "score": number, "feedback": "string" }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Evaluation Error:", error);
        return { score: 70, feedback: "Evaluation completed with fallback logic." };
    }
};

exports.detectSkillLevel = async (score, currentLevel) => {
    if (score > 85) return "Advanced";
    if (score > 60) return "Intermediate";
    return "Basic";
};

exports.generateFeedback = async (assessmentId, finalScore) => {
    try {
        const prompt = `Generate a detailed assessment feedback for a candidate who scored ${finalScore}/100.
        Return as JSON: { "strengths": ["string"], "weaknesses": ["string"], "summary": "string" }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Feedback Error:", error);
        return {
            strengths: ["Strong commitment", "Good effort"],
            weaknesses: ["Technical depth", "Complex scenarios"],
            summary: "The candidate shows potential but requires further study in advanced areas."
        };
    }
};

exports.generateSkillGap = async (skill, verifiedLevel) => {
    try {
        const prompt = `Analyze the skill gap for "${skill}" where the verified level is "${verifiedLevel}".
        A candidate needs to reach "Expert" level.
        Return as JSON array: [{ "skill": "${skill}", "requiredLevel": "Expert", "currentLevel": "${verifiedLevel}", "gap": "description of gap" }]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Skill Gap Error:", error);
        return [{ skill, requiredLevel: "Expert", currentLevel: verifiedLevel, gap: "Further specialized training recommended." }];
    }
};
