import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, ChevronRight } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { availableSkills } from '../data/mockData';

const AssessmentCards = () => {
  const { startSetup } = useAssessment();
  const [selectedSkill, setSelectedSkill] = React.useState('');

  return (
    <div className="assessment-cards-grid">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-card card-overall"
      >
        <div className="card-header">
          <Zap className="icon-purple" />
          <h3>Overall Proficiency</h3>
        </div>
        <p>Get a comprehensive validation of your technical and behavioral skills.</p>
        <ul className="card-features">
          <li><ChevronRight size={16} /> Technical Assessment</li>
          <li><ChevronRight size={16} /> Behavioral Assessment</li>
        </ul>
        <button 
          className="btn-primary-futuristic"
          onClick={() => startSetup('Overall')}
        >
          Start Overall Assessment
        </button>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-card card-skill"
      >
        <div className="card-header">
          <Target className="icon-blue" />
          <h3>Skill Specific</h3>
        </div>
        <p>Deep dive into a specific technology or methodology.</p>
        <div className="skill-selector">
          <select 
            value={selectedSkill} 
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="futuristic-select"
          >
            <option value="">Select a skill...</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
        <button 
          className="btn-primary-futuristic"
          disabled={!selectedSkill}
          onClick={() => startSetup(selectedSkill)}
        >
          Start Skill Assessment
        </button>
      </motion.div>
    </div>
  );
};

export default AssessmentCards;
