import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const AssessmentSetupModal = () => {
  const { stage, setStage, selectedSkill, beginAssessment } = useAssessment();
  const [level, setLevel] = useState('Intermediate');

  if (stage !== 'setup') return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-card modal-content"
        >
          <div className="modal-header">
            <h3>Assessment Setup</h3>
            <button onClick={() => setStage('selection')} className="btn-close">
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-body">
            <div className="field-group">
              <label>Selected Skill</label>
              <div className="field-value">{selectedSkill}</div>
            </div>

            <div className="field-group">
              <label>Target Level</label>
              <div className="level-options">
                {['Basic', 'Intermediate', 'Advanced', 'Unsure'].map((l) => (
                  <button
                    key={l}
                    className={`level-btn ${level === l ? 'active' : ''}`}
                    onClick={() => setLevel(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="btn-secondary"
              onClick={() => setStage('selection')}
            >
              Cancel
            </button>
            <button 
              className="btn-primary-futuristic"
              onClick={() => beginAssessment({ level })}
            >
              Begin Assessment
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssessmentSetupModal;
