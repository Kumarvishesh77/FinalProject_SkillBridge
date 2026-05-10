import React, { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/hooks/user.Auth';
import { useProfile } from '../../features/profile/hooks/useProfile';
import './Profile.scss';

const Profile = () => {
    const { user } = useAuth();
    const { profile, fetchProfile, handleUpdateProfile } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        about: ''
    });

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    useEffect(() => {
        if (profile) {
            const names = (profile.userName || profile.userId?.fullname || '').split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: profile.userEmail || profile.userId?.email || '',
                phone: profile.mobileNumber || '',
                about: profile.about || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        
        const fullname = `${formData.firstName} ${formData.lastName}`.trim();
        const updateData = {
            fullname,
            mobileNumber: formData.phone,
            about: formData.about
        };

        const result = await handleUpdateProfile(updateData);
        
        if (result.success) {
            setStatus({ message: 'Profile saved successfully!', type: 'success' });
            setIsEditing(false);
            // Clear message after 3 seconds
            setTimeout(() => setStatus({ message: '', type: '' }), 3000);
        } else {
            setStatus({ message: result.message || 'Failed to save profile.', type: 'error' });
        }
    };

    return (
        <div className="profile-page-v2">
            <div className="page-header">
                <h1>Personal Information</h1>
                <p>Manage your identity and contact details.</p>
            </div>

            {status.message && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="profile-card">
                <form onSubmit={handleSubmit}>
                    <div className="section-header">
                        <h2>Basic Details</h2>
                        {!isEditing ? (
                            <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>Edit Details</button>
                        ) : (
                            <div className="edit-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Save Changes</button>
                            </div>
                        )}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>First Name</label>
                            {isEditing ? (
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                            ) : (
                                <div className="value-box">{formData.firstName || <span className="placeholder">Not set</span>}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            {isEditing ? (
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                            ) : (
                                <div className="value-box">{formData.lastName || <span className="placeholder">Not set</span>}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="value-box readonly">{formData.email}</div>
                            <p className="helper-text">Email cannot be changed.</p>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                            ) : (
                                <div className="value-box">{formData.phone || <span className="placeholder">Not set</span>}</div>
                            )}
                        </div>

                        <div className="form-group span-2">
                            <label>About You</label>
                            {isEditing ? (
                                <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Tell us a bit about yourself..." rows="4"></textarea>
                            ) : (
                                <div className="value-box bio">{formData.about || <span className="placeholder">Tell us about yourself...</span>}</div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
