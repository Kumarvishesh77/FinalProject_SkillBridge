import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { analyzeSkills, getLatestAnalysis, deleteAnalysis } from '../services/gap-analysis.api';
import { ProfileContext } from '../../profile/profile.context';
import { useProfile } from '../../profile/hooks/useProfile';

const GapAnalysisContext = createContext();

export const useGapAnalysisContext = () => {
    const context = useContext(GapAnalysisContext);
    if (!context) {
        throw new Error('useGapAnalysisContext must be used within a GapAnalysisProvider');
    }
    return context;
};

export const GapAnalysisProvider = ({ children }) => {
    const { profile } = useContext(ProfileContext);
    const { fetchProfile } = useProfile();
    const [view, setView] = useState('input'); // 'input' | 'analyzing' | 'output'
    const [analysisData, setAnalysisData] = useState(null);
    const [careerDetails, setCareerDetails] = useState({
        currentJobRole: '',
        targetJobRole: '',
        jobDescription: '',
    });
    const [skills, setSkills] = useState([]);
    const [resumeFile, setResumeFile] = useState(null);
    const hasSyncedProfile = useRef(false);

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, []);

    // Sync from profile only ONCE when profile becomes available
    useEffect(() => {
        if (profile && !hasSyncedProfile.current) {
            setCareerDetails(prev => ({
                ...prev,
                currentJobRole: profile.roleOrStudy || prev.currentJobRole,
                targetJobRole: profile.targetRole || prev.targetJobRole
            }));
            
            if (profile.skills && profile.skills.length > 0) {
                const normalizedSkills = profile.skills.map((s, idx) => ({
                    id: s._id || idx,
                    skill: s.name,
                    level: s.proficiency,
                    exp: s.experience || '',
                    confidence: s.confidence || 'Medium'
                }));
                setSkills(normalizedSkills);
                hasSyncedProfile.current = true;
            }
        }
    }, [profile]);

    useEffect(() => {
        const loadInitialData = async () => {
            const latest = await getLatestAnalysis();
            if (latest) {
                setAnalysisData(latest);
                setView('output');
                if (latest.targetRole) {
                    setCareerDetails(prev => ({
                        ...prev,
                        targetJobRole: latest.targetRole
                    }));
                }
            }
        };
        loadInitialData();
    }, []);

    const handleAnalyze = async () => {
        setView('analyzing');
        try {
            const data = await analyzeSkills({
                currentRole: careerDetails.currentJobRole,
                targetRole: careerDetails.targetJobRole,
                jobDescription: careerDetails.jobDescription,
                skills: skills.map(s => ({ 
                    name: s.skill, 
                    proficiency: s.level, 
                    experience: s.exp, 
                    confidence: s.confidence 
                })),
                // Full context from profile
                workDomain: profile?.workDomain,
                totalExperience: profile?.totalExperience,
                currentDomain: profile?.currentDomain,
                resumeFileName: resumeFile?.name || null
            });
            setAnalysisData(data);
            setView('output');
        } catch (error) {
            console.error("Analysis failed:", error);
            setView('input');
        }
    };

    const resetAnalysis = async () => {
        await deleteAnalysis();
        setView('input');
        setAnalysisData(null);
        setResumeFile(null);
    };

    return (
        <GapAnalysisContext.Provider value={{
            view,
            setView,
            analysisData,
            careerDetails,
            setCareerDetails,
            skills,
            setSkills,
            resumeFile,
            setResumeFile,
            handleAnalyze,
            resetAnalysis
        }}>
            {children}
        </GapAnalysisContext.Provider>
    );
};
