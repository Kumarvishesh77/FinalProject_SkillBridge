import React from 'react';
import { AssessmentProvider, useAssessment } from '../../features/assessment/context/AssessmentContext';
import { useTheme } from '../../context/ThemeContext';
import Hero from '../../features/assessment/components/Hero';
import AssessmentCards from '../../features/assessment/components/AssessmentCards';
import SkillTable from '../../features/assessment/components/SkillTable';
import AssessmentSetupModal from '../../features/assessment/components/AssessmentSetupModal';
import AILoadingScreen from '../../features/assessment/components/AILoadingScreen';
import LiveAssessment from '../../features/assessment/components/LiveAssessment';
import ResultDashboard from '../../features/assessment/components/ResultDashboard';
import '../../features/assessment/assessment.scss';

const AssessmentContent = () => {
  const { stage } = useAssessment();

  if (stage === 'loading') return <AILoadingScreen />;
  if (stage === 'live') return <LiveAssessment />;
  if (stage === 'result') return <ResultDashboard />;

  return (
    <div className="assessment-page">
      <Hero />
      <AssessmentCards />
      <SkillTable />
      <AssessmentSetupModal />
    </div>
  );
};

const Assessment = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <AssessmentProvider>
      <div className={`assessment-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <AssessmentContent />
      </div>
    </AssessmentProvider>
  );
};

export default Assessment;
