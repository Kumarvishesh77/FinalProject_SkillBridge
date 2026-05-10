import React, { useState, useEffect } from 'react';
import { useProfile } from '../../features/profile/hooks/useProfile';
import './Profile.scss';

const levelColors = { Expert: "#00e5a0", Advanced: "#00c6ff", Intermediate: "#ffb703", Basic: "#ff4d6d", Beginner: "#ff4d6d", None: "#7b96b2" };
const confColors = { High: "#00e5a0", Medium: "#ffb703", Low: "#ff4d6d" };

const Chip = ({ label, color }) => (
    <span style={{ 
        background: color + "22", color, border: `1px solid ${color}44`,
        borderRadius: '6px', padding: '3px 10px', fontSize: '11px', fontWeight: '600'
    }}>
        {label}
    </span>
);

const Career = () => {
    const { profile, fetchProfile, handleUpdateProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [careerData, setCareerData] = useState({
        currentRole: '',
        experience: '',
        workDomain: '',
        targetDomain: '',
        targetJob: ''
    });

    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'Intermediate', experience: '', confidence: 'Medium' });
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState(null);

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
                workDomain: profile.workDomain || '',
                targetDomain: profile.targetDomain || '',
                targetJob: profile.targetRole || ''
            });
            // Adapt incoming skills to have name/proficiency/experience/confidence
            const normalizedSkills = (profile.skills || []).map((s, idx) => ({
                id: s._id || idx,
                name: s.name || '',
                proficiency: s.proficiency || 'Intermediate',
                experience: s.experience || '',
                confidence: s.confidence || 'Medium'
            }));
            setSkills(normalizedSkills);
        }
    }, [profile]);

    const handleSaveCareer = async () => {
        setStatus({ message: '', type: '' });
        const updateData = {
            roleOrStudy: careerData.currentRole,
            totalExperience: careerData.experience,
            workDomain: careerData.workDomain,
            targetDomain: careerData.targetDomain,
            targetRole: careerData.targetJob,
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
        if (!newSkill.name.trim()) return;
        const updatedSkills = [...skills, { id: Date.now(), ...newSkill }];
        setSkills(updatedSkills);
        
        // Prepare data for DB (strip temporary IDs)
        const dbSkills = updatedSkills.map(({ name, proficiency, experience, confidence }) => ({
            name, proficiency, experience, confidence
        }));

        const result = await handleUpdateProfile({ skills: dbSkills });
        if (result.success) {
            setStatus({ message: 'Skill added!', type: 'success' });
            setAdding(false);
            setNewSkill({ name: '', proficiency: 'Intermediate', experience: '', confidence: 'Medium' });
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        }
    };

    const handleSkillDelete = async (id) => {
        const updatedSkills = skills.filter(s => s.id !== id);
        setSkills(updatedSkills);
        
        const dbSkills = updatedSkills.map(({ name, proficiency, experience, confidence }) => ({
            name, proficiency, experience, confidence
        }));

        await handleUpdateProfile({ skills: dbSkills });
    };

    const handleUpdateSkill = (id, field, val) => {
        setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    };

    const handleSaveSkillEdit = async () => {
        const dbSkills = skills.map(({ name, proficiency, experience, confidence }) => ({
            name, proficiency, experience, confidence
        }));
        await handleUpdateProfile({ skills: dbSkills });
        setEditId(null);
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
                    <button className="btn-add-skill" onClick={() => setAdding(true)}>+ Add Skill</button>
                </div>

                <div className="skills-manager">
                    <div className="skills-table-container">
                        <table className="skills-table">
                            <thead>
                                <tr>
                                    <th>Skill Name</th>
                                    <th>Level</th>
                                    <th>Experience</th>
                                    <th>Confidence</th>
                                    <th style={{ width: '120px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id} className="skill-row">
                                        <td>
                                            {editId === skill.id ? (
                                                <input type="text" value={skill.name} onChange={e => handleUpdateSkill(skill.id, 'name', e.target.value)} className="table-input" />
                                            ) : (
                                                <span className="skill-name-text">{skill.name}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editId === skill.id ? (
                                                <select value={skill.proficiency} onChange={e => handleUpdateSkill(skill.id, 'proficiency', e.target.value)} className="table-select">
                                                    {["Beginner", "Intermediate", "Advanced", "Expert"].map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            ) : (
                                                <Chip label={skill.proficiency} color={levelColors[skill.proficiency] || levelColors.None} />
                                            )}
                                        </td>
                                        <td>
                                            {editId === skill.id ? (
                                                <input type="text" value={skill.experience} onChange={e => handleUpdateSkill(skill.id, 'experience', e.target.value)} placeholder="e.g. 2 yrs" className="table-input" />
                                            ) : (
                                                <span className="text-muted">{skill.experience || '-'}</span>
                                            )}
                                        </td>
                                        <td>
                                            {editId === skill.id ? (
                                                <select value={skill.confidence} onChange={e => handleUpdateSkill(skill.id, 'confidence', e.target.value)} className="table-select">
                                                    {["Low", "Medium", "High"].map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                            ) : (
                                                <Chip label={skill.confidence} color={confColors[skill.confidence]} />
                                            )}
                                        </td>
                                        <td>
                                            {editId === skill.id ? (
                                                <button className="btn-save-sm" onClick={handleSaveSkillEdit}>Save</button>
                                            ) : (
                                                <div className="skill-actions">
                                                    <button className="btn-edit-sm" onClick={() => setEditId(skill.id)}>Edit</button>
                                                    <button className="btn-delete-sm" onClick={() => handleSkillDelete(skill.id)}>Del</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {adding && (
                                    <tr className="adding-row">
                                        <td><input type="text" placeholder="Skill name..." value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} className="table-input" /></td>
                                        <td>
                                            <select value={newSkill.proficiency} onChange={e => setNewSkill({...newSkill, proficiency: e.target.value})} className="table-select">
                                                {["Beginner", "Intermediate", "Advanced", "Expert"].map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </td>
                                        <td><input type="text" placeholder="e.g. 1 yr" value={newSkill.experience} onChange={e => setNewSkill({...newSkill, experience: e.target.value})} className="table-input" /></td>
                                        <td>
                                            <select value={newSkill.confidence} onChange={e => setNewSkill({...newSkill, confidence: e.target.value})} className="table-select">
                                                {["Low", "Medium", "High"].map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="add-actions">
                                                <button className="btn-confirm-add" onClick={handleSkillAdd}>Add</button>
                                                <button className="btn-cancel-add" onClick={() => setAdding(false)}>✕</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {skills.length === 0 && !adding && (
                                    <tr>
                                        <td colSpan="5" className="empty-row">No skills added yet.</td>
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
