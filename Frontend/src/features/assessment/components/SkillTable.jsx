import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../context/AssessmentContext';
import { AuthContext } from '../../auth/auth.context';
import { getHistory } from '../services/assessment.api';
import { Loader2 } from 'lucide-react';

const SkillTable = () => {
  const { startSetup } = useAssessment();
  const { user } = React.useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?._id) {
        try {
          const response = await getHistory(user._id);
          if (response.success) {
            setHistory(response.history);
          }
        } catch (error) {
          console.error("Failed to fetch assessment history:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [user]);

  if (loading) return (
    <div className="glass-card skill-table-container flex justify-center py-8">
      <Loader2 className="animate-spin text-purple-500" />
    </div>
  );

  return (
    <div className="glass-card skill-table-container">
      <h3>Assessment History & Verifications</h3>
      <table className="futuristic-table">
        <thead>
          <tr>
            <th>Skill Name</th>
            <th>Type</th>
            <th>Verified Level</th>
            <th>Score</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? history.map((item, index) => (
            <motion.tr 
              key={item._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <td>{item.skillName}</td>
              <td className="text-xs opacity-70">{item.type}</td>
              <td>
                <span className={`badge ${item.verifiedLevel.toLowerCase().replace(' ', '-')}`}>
                  {item.verifiedLevel}
                </span>
              </td>
              <td>{item.score}%</td>
              <td className="text-xs opacity-60">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td>
                <button 
                  className="btn-text-action"
                  onClick={() => startSetup(item.skillName)}
                >
                  Retake
                </button>
              </td>
            </motion.tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center py-4 opacity-50">No assessments found. Start your first validation!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SkillTable;
