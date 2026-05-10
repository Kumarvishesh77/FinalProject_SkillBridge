import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, ShieldCheck, Activity, Eye } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const LiveAssessment = () => {
  const { stage, currentAssessment, submitAssessment } = useAssessment();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  if (stage !== 'live' || !currentAssessment) return null;

  const questions = currentAssessment.questions;
  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleAnswerChange = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      submitAssessment(answers);
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'mcq':
        return (
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`option-btn ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswerChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'descriptive':
      case 'case-study':
        return (
          <textarea
            className="futuristic-textarea"
            placeholder="Type your detailed answer here..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
      case 'coding':
        return (
          <div className="code-editor-container">
            <div className="editor-header">
              <span>editor.js</span>
            </div>
            <textarea
              className="code-textarea"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        );
      case 'fillup':
        return (
          <input
            type="text"
            className="futuristic-input"
            placeholder="Complete the sentence..."
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="live-assessment-container">
      <header className="sticky-header glass-card">
        <div className="header-top">
          <div className="skill-info">
            <span className="skill-name">{currentAssessment.skillName}</span>
            <span className="question-count">Question {currentIdx + 1} of {questions.length}</span>
          </div>
          <div className="estimated-level">
            Estimated Level: <span className="level-text">{currentAssessment.estimatedLevel}</span>
          </div>
        </div>
        <div className="progress-bar-container">
          <motion.div 
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="assessment-main">
        <div className="question-side">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card question-card"
            >
              <div className="question-meta">
                <span className={`badge ${currentQuestion.difficulty.toLowerCase()}`}>
                  {currentQuestion.difficulty}
                </span>
                <span className="badge type-badge">{currentQuestion.type.replace('-', ' ')}</span>
              </div>
              
              {currentQuestion.scenario && (
                <div className="scenario-box">
                  <strong>Scenario:</strong> {currentQuestion.scenario}
                </div>
              )}

              <h2 className="question-text">{currentQuestion.question}</h2>
              
              <div className="answer-section">
                {renderQuestionInput()}
              </div>

              <div className="navigation-actions">
                <button 
                  className="btn-secondary" 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <div className="center-actions">
                   <button className="btn-icon-only"><Save size={18} /></button>
                </div>
                <button 
                  className="btn-primary-futuristic"
                  onClick={handleNext}
                >
                  {currentIdx === questions.length - 1 ? 'Finish' : 'Next Question'} <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="ai-status-side">
          <div className="glass-card ai-status-card">
            <h3>AI Proctoring</h3>
            <ul className="ai-status-list">
              <li><ShieldCheck size={16} className="text-green" /> Evaluating answers</li>
              <li><Activity size={16} className="text-blue" /> Detecting confidence patterns</li>
              <li><Eye size={16} className="text-purple" /> Tracking consistency</li>
            </ul>
            <div className="ai-pulse-container">
              <div className="ai-pulse" />
              <span>AI is active</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default LiveAssessment;
