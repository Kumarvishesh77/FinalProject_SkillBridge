import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="hero-section"
    >
      <h1 className="futuristic-title">AI Skill Validation</h1>
      <p className="futuristic-subtitle">Validate real skills using adaptive AI assessments.</p>
    </motion.div>
  );
};

export default Hero;
