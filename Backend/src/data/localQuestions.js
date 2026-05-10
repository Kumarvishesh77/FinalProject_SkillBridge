/**
 * Minimal Emergency Fallback
 * This is only a safety net if the internet is completely down.
 * All assessments are designed to be generated dynamically via AI.
 */
const localQuestions = {
    "General": {
        "Beginner": [
            { "id": 1, "question": "The AI is currently generating your custom assessment. Please wait...", "options": ["Option A", "Option B", "Option C", "Option D"], "correctOptionIndex": 0, "answer": "Option A" }
        ]
    }
};

module.exports = localQuestions;
