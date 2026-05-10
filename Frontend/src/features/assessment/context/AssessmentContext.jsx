import React, { createContext, useContext, useState, useCallback } from 'react';
import * as assessmentApi from '../services/assessment.api';

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
  const [stage, setStage] = useState('selection'); // 'selection', 'setup', 'loading', 'live', 'result'
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [assessmentConfig, setAssessmentConfig] = useState(null);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [assessmentId, setAssessmentId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const startSetup = (skill) => {
    setSelectedSkill(skill);
    setStage('setup');
    setError(null);
  };

  const beginAssessment = async (config) => {
    try {
      setAssessmentConfig(config);
      setStage('loading');
      setError(null);
      
      const response = await assessmentApi.startAssessment({
        type: selectedSkill === 'Overall' ? 'Overall Proficiency' : 'Particular Skill Assessment',
        skillName: selectedSkill,
        selectedLevel: config.level
      });

      if (response.success) {
        setAssessmentId(response.assessmentId);
        setCurrentAssessment({
          skillName: selectedSkill,
          estimatedLevel: config.level,
          questions: response.questions
        });
        setStage('live');
      } else {
        throw new Error(response.message || 'Failed to start assessment');
      }
    } catch (err) {
      console.error("Begin Assessment Error:", err);
      setError(err.response?.data?.message || err.message);
      setStage('selection');
    }
  };

  const submitAssessment = useCallback(async (finalAnswers) => {
    try {
      setAnswers(finalAnswers);
      setStage('loading');
      setError(null);

      // First, submit answers for evaluation
      const formattedAnswers = Object.entries(finalAnswers).map(([qId, answer]) => ({
        questionId: qId,
        answer
      }));

      const evalResponse = await assessmentApi.submitBatch({
        assessmentId,
        answers: formattedAnswers
      });

      if (!evalResponse.success) {
        throw new Error(evalResponse.message || 'Failed to evaluate answers');
      }

      // Then finish and generate final report
      const finishResponse = await assessmentApi.finishAssessment({
        assessmentId,
        finalScore: evalResponse.score
      });

      if (finishResponse.success) {
        const { result, assessment } = finishResponse;
        setResults({
          overallScore: result.finalScore,
          verifiedLevel: assessment.verifiedLevel,
          confidenceAlignment: result.confidenceAlignment,
          strongestArea: result.strengths[0] || 'N/A',
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          summary: result.summary,
          radarData: result.skillGap.map(gap => ({
            subject: gap.skill,
            A: result.finalScore,
            fullMark: 100
          })),
          pieData: [
            { name: 'Correct', value: result.finalScore },
            { name: 'Incorrect', value: 100 - result.finalScore },
          ]
        });
        setStage('result');
      } else {
        throw new Error(finishResponse.message || 'Failed to finalize report');
      }
    } catch (err) {
      console.error("Submit Assessment Error:", err);
      setError(err.response?.data?.message || err.message);
      setStage('live');
    }
  }, [assessmentId]);

  const resetAssessment = () => {
    setStage('selection');
    setSelectedSkill(null);
    setAssessmentConfig(null);
    setCurrentAssessment(null);
    setAssessmentId(null);
    setAnswers({});
    setResults(null);
    setError(null);
  };

  return (
    <AssessmentContext.Provider value={{
      stage,
      setStage,
      selectedSkill,
      setSelectedSkill,
      assessmentConfig,
      currentAssessment,
      answers,
      results,
      error,
      startSetup,
      beginAssessment,
      submitAssessment,
      resetAssessment
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
