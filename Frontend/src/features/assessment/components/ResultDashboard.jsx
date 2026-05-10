import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import { Award, Target, TrendingUp, BookOpen, Save, Map, RefreshCcw, Home } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const COLORS = ['#6a11cb', '#2575fc', '#00C49F', '#FFBB28', '#FF8042'];

const ResultDashboard = () => {
  const { stage, results, resetAssessment } = useAssessment();

  if (stage !== 'result' || !results) return null;

  return (
    <div className="result-dashboard">
      <h1 className="futuristic-title">Validation Complete</h1>
      
      <div className="summary-cards-grid">
        <div className="glass-card summary-card">
          <Award className="icon-purple" />
          <div className="card-info">
            <label>Overall Score</label>
            <div className="value">{results.overallScore}%</div>
          </div>
        </div>
        <div className="glass-card summary-card">
          <Target className="icon-blue" />
          <div className="card-info">
            <label>Verified Level</label>
            <div className="value">{results.verifiedLevel}</div>
          </div>
        </div>
        <div className="glass-card summary-card">
          <TrendingUp className="icon-green" />
          <div className="card-info">
            <label>Confidence Alignment</label>
            <div className="value">{results.confidenceAlignment}</div>
          </div>
        </div>
        <div className="glass-card summary-card">
          <BookOpen className="icon-yellow" />
          <div className="card-info">
            <label>Strongest Area</label>
            <div className="value">{results.strongestArea}</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="glass-card chart-container">
          <h3>Skill Proficiency Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={results.radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
              <Radar
                name="Proficiency"
                dataKey="A"
                stroke="#6a11cb"
                fill="#6a11cb"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card chart-container">
          <h3>Accuracy Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={results.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {results.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ai-feedback-section">
        <h3>AI Insights & Feedback</h3>
        <p className="ai-summary-text">{results.summary}</p>
        <div className="feedback-cards">
          <div className="glass-card feedback-card">
            <div className="feedback-tag positive">Strengths</div>
            <ul className="feedback-list">
              {results.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="glass-card feedback-card">
            <div className="feedback-tag neutral">Areas for Improvement</div>
            <ul className="feedback-list">
              {results.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <footer className="result-footer">
        <button className="btn-secondary"><Save size={18} /> Save Result</button>
        <button className="btn-secondary"><Map size={18} /> Generate Roadmap</button>
        <button className="btn-secondary" onClick={resetAssessment}><RefreshCcw size={18} /> Retake</button>
        <button className="btn-primary-futuristic" onClick={resetAssessment}><Home size={18} /> Back to Dashboard</button>
      </footer>
    </div>
  );
};

export default ResultDashboard;
