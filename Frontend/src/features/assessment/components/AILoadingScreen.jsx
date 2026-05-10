import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const AILoadingScreen = () => {
  const { stage } = useAssessment();
  const [steps, setSteps] = useState([
    { id: 1, label: 'Preparing Questions', status: 'pending' },
    { id: 2, label: 'Analyzing Skill', status: 'pending' },
    { id: 3, label: 'Generating Adaptive Flow', status: 'pending' },
  ]);

  useEffect(() => {
    if (stage !== 'loading') return;

    const timers = [
      setTimeout(() => setSteps(s => s.map(step => step.id === 1 ? { ...step, status: 'complete' } : step)), 800),
      setTimeout(() => setSteps(s => s.map(step => step.id === 2 ? { ...step, status: 'complete' } : step)), 1600),
      setTimeout(() => setSteps(s => s.map(step => step.id === 3 ? { ...step, status: 'complete' } : step)), 2400),
    ];

    return () => timers.forEach(clearTimeout);
  }, [stage]);

  if (stage !== 'loading') return null;

  return (
    <div className="loading-screen">
      <div className="loading-content-wrapper">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="ai-icon-container"
        >
          <Cpu size={64} className="text-purple" />
        </motion.div>
        
        <div className="loading-steps">
          {steps.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`loading-step ${step.status}`}
            >
              {step.status === 'complete' ? (
                <CheckCircle size={24} className="text-green" />
              ) : (
                <div className="dot-pulse" />
              )}
              <span>{step.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AILoadingScreen;
