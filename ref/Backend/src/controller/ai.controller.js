/**
 * AI Question Generator Controller
 * Generates high-quality questions using Google Gemini AI with local fallback.
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");
const localQuestions = require("../data/localQuestions");

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
        const questionCount = 10;

        const prompt = `
            Task: Generate ${questionCount} assessment questions for skill: "${skill}" at "${level}" level.
            Requirements:
            1. Difficulty: ${level} strictly.
            2. Format: Standard MCQs with 4 options.
            
            Format: Valid JSON ONLY.
            Structure: {"questions": [{"id": 1, "type": "mcq", "question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]}
        `;

        const modelName = "gemini-1.5-flash";
        const model = genAIInstance.getGenerativeModel({ 
            model: modelName,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.5 }
        });

        const result = await model.generateContent(prompt);
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
    const { currentRole, targetRole, userSkills, userAssessments, company } = req.body;

    if (!targetRole) {
        return res.status(400).json({ success: false, message: "Target role is required." });
    }

    try {
        console.log(`[AI Gap Analysis] Request: TargetRole=${targetRole}, Company=${company || 'None'}`);
        const apiKey = process.env.GOOGLE_GENAI_API_KEY;
        if (!apiKey || apiKey === "dummy_key") throw new Error("Missing API Key");

        const genAIInstance = new GoogleGenerativeAI(apiKey);
        const passedAssessments = (userAssessments || []).filter(a => a.passed);
        
        const prompt = `
            You are an expert career counselor at ${company || 'SkillBridge'}. Generate a precise Skill Gap Analysis focusing on PROGRESSION to reach the "${targetRole}".
            Input Data: 
            - User's Background: ${currentRole || 'Not specified'}
            - Target Role: ${targetRole}
            - Current Company: ${company || 'General'}
            - Passed Assessments: ${JSON.stringify(passedAssessments)}
            - Profile Skills: ${JSON.stringify(userSkills || [])}

            Mandatory Logic:
            1. Identify core skills for "${targetRole}" across Beginner, Intermediate, and Advanced levels.
            2. If company is specified, prioritize skills relevant to that company's focus (e.g., TCS focuses on Java/SQL, Infosys on React/JS).
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

        const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
        let result;
        let lastError;

        for (const modelName of modelNames) {
            try {
                console.log(`[AI Gap Analysis] Attempting with model: ${modelName}`);
                const model = genAIInstance.getGenerativeModel({ model: modelName, generationConfig: { maxOutputTokens: 2048, temperature: 0.1 } });
                const aiPromise = model.generateContent(prompt);
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 15000));
                result = await Promise.race([aiPromise, timeoutPromise]);
                if (result) break;
            } catch (err) { lastError = err; }
        }

        if (!result) throw lastError || new Error("Gap analysis failed");

        const response = await result.response;
        const responseText = response.text().trim();
        const cleanText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
        const analysisData = JSON.parse(cleanText);

        return res.status(200).json({ success: true, data: analysisData });
    } catch (error) {
        console.error("[AI Gap Analysis Error]:", error.message);
        return handleGapAnalysisFallback(targetRole, userSkills, userAssessments, company, res);
    }
}

function handleGapAnalysisFallback(targetRole, userSkills, userAssessments, company, res) {
    const roleReqs = {
        "Frontend Developer": { "HTML": "Advanced", "CSS": "Advanced", "JavaScript": "Intermediate", "React": "Intermediate" },
        "Backend Developer": { "Python": "Advanced", "Node.js": "Intermediate", "SQL": "Advanced" },
        "Full Stack Developer": { "HTML": "Advanced", "JavaScript": "Advanced", "Node.js": "Intermediate", "CSS": "Intermediate" },
        "Java Developer": { "Java": "Advanced", "Spring Boot": "Intermediate", "SQL": "Intermediate" },
        "Data Analyst": { "SQL": "Advanced", "Excel": "Advanced", "Python": "Intermediate", "Power BI": "Intermediate" },
        "Data Scientist": { "Python": "Advanced", "Machine Learning": "Intermediate", "Statistics": "Advanced", "SQL": "Intermediate" },
        "Business Analyst": { "Requirement Analysis": "Advanced", "SQL": "Intermediate", "Excel": "Advanced", "Communication": "Advanced" },
        "Machine Learning Engineer": { "Python": "Advanced", "Machine Learning": "Advanced", "Statistics": "Intermediate", "PyTorch": "Intermediate" },
        "Network Engineer": { "Networking": "Advanced", "Security": "Intermediate", "Routing": "Advanced" },
        "Cloud Engineer": { "Cloud Computing": "Advanced", "Networking": "Intermediate", "Docker": "Intermediate", "Kubernetes": "Intermediate" },
        "Microsoft 365 Admin": { "Microsoft 365": "Advanced", "Networking": "Intermediate", "Security": "Intermediate" },
        "Intune Specialist": { "Intune": "Advanced", "Security": "Advanced", "Networking": "Intermediate" }
    };
    
    // Company Priorities
    const companyPriorities = {
        "TCS": ["Java", "Spring Boot", "SQL"],
        "Infosys": ["JavaScript", "React", "Angular"],
        "Wipro": ["Networking", "Security", "Cloud Computing"],
        "Accenture": ["System Design", "Microservices", "Cloud Architecture"]
    };

    let requirements = roleReqs[targetRole] || { "Technical Communication": "Intermediate", "Problem Solving": "Advanced" };
    const prioritizedSkills = companyPriorities[company] || [];

    const levels = ["None", "Beginner", "Intermediate", "Advanced"];
    const strengths = [];
    const skillGaps = [];
    const userSkillsMap = {};

    if (userSkills) userSkills.forEach(s => userSkillsMap[(s.name || s).toLowerCase()] = s.proficiency || "Intermediate");
    if (userAssessments) userAssessments.forEach(a => { if (a.passed) userSkillsMap[a.skill.toLowerCase()] = a.level; });

    for (const [reqSkill, reqLevel] of Object.entries(requirements)) {
        const userLevel = userSkillsMap[reqSkill.toLowerCase()] || "None";
        const isPriority = prioritizedSkills.includes(reqSkill);
        const effectiveReqLevel = isPriority ? "Advanced" : reqLevel;

        if (levels.indexOf(userLevel) >= levels.indexOf(effectiveReqLevel)) {
            strengths.push({ name: reqSkill, level: userLevel, target: effectiveReqLevel });
        } else {
            skillGaps.push({ 
                name: reqSkill, 
                level: userLevel, 
                target: effectiveReqLevel, 
                type: userLevel === "None" ? "Missing Skill" : "Needs Improvement",
                priority: isPriority ? "High (Company Priority)" : "Normal"
            });
        }
    }

    return res.status(200).json({
        success: true,
        data: { 
            completedLevel: strengths.length > 0 ? "Initial Core Validated" : "Assessment Phase Active",
            nextLevelTarget: `Achieve ${targetRole} Proficiency ${company ? `at ${company}` : ''}`,
            strengths, 
            skillGaps, 
            keyAreasForImprovement: [
                `Master the core technical requirements for ${targetRole}.`,
                ...prioritizedSkills.map(s => `Focus on ${s} to align with ${company} standards.`),
                "Complete verified technical assessments to validate your proficiency levels."
            ],
            improvementSummary: `To successfully transition to a ${targetRole} role${company ? ` within ${company}` : ''}, you should prioritize closing the identified gaps in ${skillGaps.slice(0,2).map(g => g.name).join(' and ')}. Your existing knowledge in ${strengths.slice(0,2).map(s => s.name).join(' and ')} provides a strong foundation.`, 
            isFallback: true 
        }
    });
}

module.exports = { generateAssessment, generateGapAnalysis };
