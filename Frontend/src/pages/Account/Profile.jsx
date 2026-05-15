import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/hooks/user.Auth';
import { useProfile } from '../../features/profile/hooks/useProfile';
import './Profile.scss';
import { 
    Edit, Camera, User, Briefcase, GraduationCap, 
    FileText, CheckCircle, Save, X, Plus, Trash2,
    Calendar, Mail, Phone, MapPin, Globe, Users
} from 'lucide-react';

const Profile = () => {
    const { user, handleLogout } = useAuth();
    const { profile, fetchProfile, handleUpdateProfile, profileLoading } = useProfile();
    
    const [activeTab, setActiveTab] = useState('basic');
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    
    const [formData, setFormData] = useState({
        // Basic Info
        fullname: '',
        email: '',
        mobileNumber: '',
        gender: '',
        dob: '',
        nationality: '',
        secondaryEmail: '',
        residentialAddress: '',
        about: '',
        organizationName: '',
        
        // Career Info
        currentStatus: 'Beginner',
        roleOrStudy: '',
        targetRole: '',
        department: '',
        reportingManager: '',
        employmentType: 'Permanent',
        joiningDate: '',
        workLocation: '',
        totalExperience: 0,
        
        // Skills (handled separately)
        skills: []
    });

    const [newSkill, setNewSkill] = useState({ name: '', proficiency: 'Beginner' });

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    useEffect(() => {
        if (profile) {
            setFormData({
                fullname: profile.userName || profile.userId?.fullname || '',
                email: profile.userEmail || profile.userId?.email || '',
                mobileNumber: profile.mobileNumber || '',
                gender: profile.gender || '',
                dob: profile.dob ? profile.dob.split('T')[0] : '',
                nationality: profile.nationality || '',
                secondaryEmail: profile.secondaryEmail || '',
                residentialAddress: profile.residentialAddress || '',
                about: profile.about || '',
                organizationName: profile.organizationName || profile.userId?.orgId || '',
                
                currentStatus: profile.currentStatus || 'Beginner',
                roleOrStudy: profile.roleOrStudy || '',
                targetRole: profile.targetRole || '',
                department: profile.department || '',
                reportingManager: profile.reportingManager || '',
                employmentType: profile.employmentType || 'Permanent',
                joiningDate: profile.joiningDate ? profile.joiningDate.split('T')[0] : '',
                workLocation: profile.workLocation || '',
                totalExperience: profile.totalExperience || 0,
                
                skills: profile.skills || []
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setStatus({ message: '', type: '' });
        const result = await handleUpdateProfile(formData);
        
        if (result.success) {
            setStatus({ message: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        } else {
            setStatus({ message: result.message || 'Failed to update profile.', type: 'error' });
        }
    };

    const handleAddSkill = () => {
        if (!newSkill.name.trim()) return;
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, { ...newSkill }]
        }));
        setNewSkill({ name: '', proficiency: 'Beginner' });
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    // Calculate completion percentage
    const calculateCompletion = () => {
        const fields = [
            formData.fullname, formData.mobileNumber, formData.gender, 
            formData.dob, formData.about, formData.targetRole, 
            formData.skills.length > 0
        ];
        const completed = fields.filter(f => !!f).length;
        return Math.round((completed / fields.length) * 100);
    };

    const completionPercent = calculateCompletion();
    const dashArray = `${completionPercent}, 100`;

    if (profileLoading && !profile) {
        return <div className="loading-screen"><h1>Loading Profile...</h1></div>;
    }

    return (
        <div className="profile-page-v2">
            {status.message && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            {/* Sidebar */}
            <aside className="profile-sidebar">
                <div className="sidebar-card identity-card">
                    <div className="avatar-container">
                        <img src="/profileplaceHolder.jfif" alt="Profile" />
                        <div className="avatar-overlay">
                            <Camera size={24} />
                        </div>
                    </div>
                    <h1>{formData.fullname || 'Your Name'}</h1>
                    <p className="status">{formData.roleOrStudy || 'Set your role'}</p>
                    <div className={`badge ${completionPercent === 100 ? 'complete' : ''}`}>
                        {completionPercent === 100 ? 'Verified Profile' : 'Incomplete Profile'}
                    </div>
                </div>

                <div className="sidebar-card completion-card">
                    <h3>Profile Completion</h3>
                    <div className="progress-radial">
                        <svg viewBox="0 0 36 36" className="circular-chart">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle" strokeDasharray={dashArray} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div className="percentage">{completionPercent}%</div>
                    </div>
                    <p className="hint">Complete your profile to unlock all features including Skill Gap Analysis.</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="profile-main-content">
                <nav className="content-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <User size={18} style={{ marginRight: '8px' }} /> Basic Details
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'career' ? 'active' : ''}`}
                        onClick={() => setActiveTab('career')}
                    >
                        <Briefcase size={18} style={{ marginRight: '8px' }} /> Career Status
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
                        onClick={() => setActiveTab('education')}
                    >
                        <GraduationCap size={18} style={{ marginRight: '8px' }} /> Education
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'compliance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compliance')}
                    >
                        <FileText size={18} style={{ marginRight: '8px' }} /> Compliance
                    </button>
                </nav>

                <div className="tab-panels">
                    {/* Basic Details Panel */}
                    <div className={`tab-panel ${activeTab === 'basic' ? 'active' : ''}`}>
                        <div className="panel-header">
                            <div>
                                <h2>Basic Information</h2>
                                <p>Manage your identity and contact details.</p>
                            </div>
                            {!isEditing ? (
                                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                    <Edit size={16} /> Edit Details
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-edit" style={{ background: 'transparent', color: 'var(--para-color)', border: '1px solid var(--glass-border)' }} onClick={() => setIsEditing(false)}>
                                        <X size={16} /> Cancel
                                    </button>
                                    <button className="btn-edit" style={{ background: 'var(--primary-btn)', color: '#fff', border: 'none' }} onClick={handleSave}>
                                        <Save size={16} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                {isEditing ? (
                                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="John Doe" />
                                ) : (
                                    <div className="value-box">{formData.fullname || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="value-box readonly">{formData.email}</div>
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                {isEditing ? (
                                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                ) : (
                                    <div className="value-box">{formData.mobileNumber || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                {isEditing ? (
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <div className="value-box">{formData.gender || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                {isEditing ? (
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                ) : (
                                    <div className="value-box">{formData.dob || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Nationality</label>
                                {isEditing ? (
                                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. American" />
                                ) : (
                                    <div className="value-box">{formData.nationality || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group span-2">
                                <label>Residential Address</label>
                                {isEditing ? (
                                    <input type="text" name="residentialAddress" value={formData.residentialAddress} onChange={handleChange} placeholder="123 Street, City, Country" />
                                ) : (
                                    <div className="value-box">{formData.residentialAddress || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group span-2">
                                <label>About You</label>
                                {isEditing ? (
                                    <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Tell us about yourself..." rows="4"></textarea>
                                ) : (
                                    <div className="value-box bio">{formData.about || <span className="placeholder">No bio added yet.</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Organization ID</label>
                                {isEditing ? (
                                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} placeholder="e.g. SKILL-123" />
                                ) : (
                                    <div className="value-box readonly">{formData.organizationName || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Career Status Panel */}
                    <div className={`tab-panel ${activeTab === 'career' ? 'active' : ''}`}>
                        <div className="panel-header">
                            <div>
                                <h2>Career Status</h2>
                                <p>Professional standing and skills expertise.</p>
                            </div>
                            {!isEditing && (
                                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                                    <Edit size={16} /> Edit Status
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Current Status</label>
                                {isEditing ? (
                                    <select name="currentStatus" value={formData.currentStatus} onChange={handleChange}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">Working Professional</option>
                                        <option value="Career Switcher">Career Switcher</option>
                                    </select>
                                ) : (
                                    <div className="value-box">{formData.currentStatus}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Target Role (Career Goal)</label>
                                {isEditing ? (
                                    <select name="targetRole" value={formData.targetRole} onChange={handleChange}>
                                    <option value="">Select Target Role</option>
                                    <optgroup label="Development">
                                        <option value="Frontend Developer">Frontend Developer</option>
                                        <option value="Backend Developer">Backend Developer</option>
                                        <option value="Full Stack Developer">Full Stack Developer</option>
                                        <option value="Mobile App Developer">Mobile App Developer</option>
                                        <option value="DevOps Engineer">DevOps Engineer</option>
                                    </optgroup>
                                    <optgroup label="Data & AI">
                                        <option value="Data Scientist">Data Scientist</option>
                                        <option value="Data Analyst">Data Analyst</option>
                                        <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                                        <option value="AI Researcher">AI Researcher</option>
                                    </optgroup>
                                    <optgroup label="Design & Product">
                                        <option value="UI/UX Designer">UI/UX Designer</option>
                                        <option value="Product Manager">Product Manager</option>
                                        <option value="Business Analyst">Business Analyst</option>
                                    </optgroup>
                                    <optgroup label="Security & Infrastructure">
                                        <option value="Cyber Security Analyst">Cyber Security Analyst</option>
                                        <option value="Cloud Architect">Cloud Architect</option>
                                        <option value="System Administrator">System Administrator</option>
                                    </optgroup>
                                </select>
                                ) : (
                                    <div className="value-box">{formData.targetRole || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                {isEditing ? (
                                    <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Engineering" />
                                ) : (
                                    <div className="value-box">{formData.department || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Work Location</label>
                                {isEditing ? (
                                    <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} placeholder="e.g. Remote" />
                                ) : (
                                    <div className="value-box">{formData.workLocation || <span className="placeholder">Not set</span>}</div>
                                )}
                            </div>
                        </div>

                        <div className="skills-manager">
                            <div className="skills-header">
                                <h3>Skills & Expertise</h3>
                            </div>
                            
                            <div className="skills-table-container">
                                <table className="skills-table">
                                    <thead>
                                        <tr>
                                            <th>Skill Name</th>
                                            <th>Proficiency</th>
                                            {isEditing && <th>Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.skills.map((skill, index) => (
                                            <tr key={index}>
                                                <td><span className="skill-name">{skill.name}</span></td>
                                                <td><span className="proficiency">{skill.proficiency}</span></td>
                                                {isEditing && (
                                                    <td>
                                                        <button onClick={() => handleRemoveSkill(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                        {formData.skills.length === 0 && (
                                            <tr>
                                                <td colSpan={isEditing ? 3 : 2} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                                                    No skills added yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                {isEditing && (
                                    <div className="add-skill-row">
                                        <input 
                                            type="text" 
                                            placeholder="Add skill (e.g. React)" 
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
                                        </select>
                                        <button className="btn-add" onClick={handleAddSkill}>
                                            <Plus size={16} /> Add
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Education Panel */}
                    <div className={`tab-panel ${activeTab === 'education' ? 'active' : ''}`}>
                        <div className="panel-header">
                            <div>
                                <h2>Education</h2>
                                <p>Your academic background and qualifications.</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                            <GraduationCap size={48} color="#94a3b8" style={{ marginBottom: '20px' }} />
                            <p style={{ color: '#94a3b8' }}>Academic records feature is coming soon.</p>
                        </div>
                    </div>

                    {/* Compliance Panel */}
                    <div className={`tab-panel ${activeTab === 'compliance' ? 'active' : ''}`}>
                        <div className="panel-header">
                            <div>
                                <h2>Compliance & Documents</h2>
                                <p>Identification and verification details.</p>
                            </div>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Verification Status</label>
                                <div className="value-box readonly">
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Employee ID</label>
                                <div className="value-box readonly">SB-{user?._id?.slice(-6).toUpperCase() || 'N/A'}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px dashed var(--primary-btn)' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--primary-btn)', fontWeight: 500 }}>
                                Corporate documents and background verification results are managed by the HR portal.
                            </p>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="form-footer-actions">
                        <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>Save Profile</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
