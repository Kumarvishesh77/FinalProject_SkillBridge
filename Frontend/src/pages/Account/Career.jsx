import React, { useState, useEffect } from 'react';
import { useProfile } from '../../features/profile/hooks/useProfile';
import './Profile.scss';

const Career = () => {
    const { profile, fetchProfile, handleUpdateProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [careerData, setCareerData] = useState({
        currentRole: '',
        experience: '',
        currentDomain: '',
        targetDomain: '',
        targetJob: ''
    });

    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'Beginner' });

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    useEffect(() => {
        if (profile) {
            setCareerData({
                currentRole: profile.roleOrStudy || '',
                experience: profile.totalExperience || '',
                currentDomain: profile.currentDomain || '',
                targetDomain: profile.targetDomain || '',
                targetJob: profile.targetRole || ''
            });
            setSkills(profile.skills || []);
        }
    }, [profile]);

    const handleSaveCareer = async () => {
        setStatus({ message: '', type: '' });
        const updateData = {
            roleOrStudy: careerData.currentRole,
            totalExperience: careerData.experience,
            currentDomain: careerData.currentDomain,
            targetDomain: careerData.targetDomain,
            targetGoal: careerData.targetJob,
            skills: skills // Keep skills in sync
        };

        const result = await handleUpdateProfile(updateData);
        if (result.success) {
            setStatus({ message: 'Career information saved!', type: 'success' });
            setIsEditing(false);
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        } else {
            setStatus({ message: result.message || 'Failed to save career info.', type: 'error' });
        }
    };

    const handleSkillAdd = async () => {
        if (newSkill.name.trim()) {
            const updatedSkills = [...skills, { name: newSkill.name, proficiency: newSkill.proficiency }];
            setSkills(updatedSkills);
            setNewSkill({ name: '', proficiency: 'Beginner' });
            
            // Auto-save skills to DB
            const result = await handleUpdateProfile({ skills: updatedSkills });
            if (result.success) {
                setStatus({ message: 'Skill added successfully!', type: 'success' });
                setTimeout(() => setStatus({ message: '', type: '' }), 3000);
            } else {
                setStatus({ message: 'Failed to sync skill to database.', type: 'error' });
            }
        }
    };

    const handleSkillDelete = async (skillName) => {
        const updatedSkills = skills.filter(s => s.name !== skillName);
        setSkills(updatedSkills);
        
        const result = await handleUpdateProfile({ skills: updatedSkills });
        if (result.success) {
            setStatus({ message: 'Skill removed.', type: 'success' });
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }
    };

    return (
        <div className="career-page">
            <div className="page-header">
                <h1>Career & Skills</h1>
                <p>Define your professional path and track your expertise.</p>
            </div>

            {status.message && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="profile-card">
                <div className="section-header">
                    <h2>Professional Background</h2>
                    {!isEditing ? (
                        <button className="btn-edit" onClick={() => setIsEditing(true)}>Edit Info</button>
                    ) : (
                        <div className="edit-actions">
                            <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="btn-save" onClick={handleSaveCareer}>Save Changes</button>
                        </div>
                    )}
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>Current Job Role</label>
                        {isEditing ? (
                            <input type="text" value={careerData.currentRole} onChange={(e) => setCareerData({...careerData, currentRole: e.target.value})} placeholder="e.g. Software Engineer" />
                        ) : (
                            <div className="value-box">{careerData.currentRole || <span className="placeholder">Not specified</span>}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Years of Experience</label>
                        {isEditing ? (
                            <input type="number" value={careerData.experience} onChange={(e) => setCareerData({...careerData, experience: e.target.value})} placeholder="e.g. 5" />
                        ) : (
                            <div className="value-box">{careerData.experience || '0'} Years</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Work Domain</label>
                        {isEditing ? (
                            <input type="text" value={careerData.workDomain} onChange={(e) => setCareerData({...careerData, workDomain: e.target.value})} placeholder="e.g. Fintech" />
                        ) : (
                            <div className="value-box">{careerData.workDomain || <span className="placeholder">Not specified</span>}</div>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Target Domain</label>
                        {isEditing ? (
                            <input type="text" value={careerData.targetDomain} onChange={(e) => setCareerData({...careerData, targetDomain: e.target.value})} placeholder="e.g. AI/ML" />
                        ) : (
                            <div className="value-box">{careerData.targetDomain || <span className="placeholder">Not specified</span>}</div>
                        )}
                    </div>
                    <div className="form-group span-2">
                        <label>Target Job Role</label>
                        {isEditing ? (
                            <input type="text" value={careerData.targetJob} onChange={(e) => setCareerData({...careerData, targetJob: e.target.value})} placeholder="e.g. Senior Architect" />
                        ) : (
                            <div className="value-box">{careerData.targetJob || <span className="placeholder">Define your goal</span>}</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="profile-card mt-4">
                <div className="section-header">
                    <h2>Current Skills</h2>
                </div>

                <div className="skills-manager">
                    <div className="add-skill-box">
                        <input 
                            type="text" 
                            placeholder="Add a new skill (e.g. Python)" 
                            value={newSkill.name}
                            onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                        />
                        <select 
                            value={newSkill.proficiency}
                            onChange={(e) => setNewSkill({...newSkill, proficiency: e.target.value})}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                        <button className="btn-add" onClick={handleSkillAdd}>Add Skill</button>
                    </div>

                    <div className="skills-table-container">
                        <table className="skills-table">
                            <thead>
                                <tr>
                                    <th>Skill Name</th>
                                    <th>Proficiency Level</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.length > 0 ? (
                                    skills.map((skill, index) => (
                                        <tr key={index}>
                                            <td>{skill.name}</td>
                                            <td>
                                                <span className={`proficiency-badge ${skill.proficiency.toLowerCase()}`}>
                                                    {skill.proficiency}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn-delete" onClick={() => handleSkillDelete(skill.name)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="empty-row">No skills added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
