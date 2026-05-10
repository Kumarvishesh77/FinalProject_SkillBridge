import api from "../../../services/api";

const API_URL = '/api/ai';

export const analyzeSkills = async (data) => {
    // data: { currentRole, targetRole, jobDescription, skills }
    try {
        const response = await api.post(`${API_URL}/generate-gap-analysis`, data);
        return response.data.data;
    } catch (error) {
        console.error("API Error in analyzeSkills:", error);
        throw error;
    }
};

export const getLatestAnalysis = async () => {
    try {
        const response = await api.get(`${API_URL}/latest-gap-analysis`);
        return response.data.data;
    } catch (error) {
        // If it's a 404, we just return null silently as it's expected if no report exists
        if (error.response?.status !== 404) {
            console.error("API Error in getLatestAnalysis:", error);
        }
        return null;
    }
};

export const deleteAnalysis = async () => {
    try {
        await api.delete(`${API_URL}/gap-analysis`);
        return true;
    } catch (error) {
        console.error("API Error in deleteAnalysis:", error);
        return false;
    }
};

export const generateResume = async (analysisId) => {
    await new Promise(resolve => setTimeout(resolve, 2800));
    return {
        success: true,
        preview: "Mock generated resume content...",
    };
};
