import React, { useEffect } from 'react';
import { useAuth } from '../../features/auth/hooks/user.Auth';
import { useProfile } from '../../features/profile/hooks/useProfile';
import { Link } from 'react-router';
import './Dashboard.scss';

const Dashboard = () => {
    const { user } = useAuth();
    const { profile, fetchProfile } = useProfile();

    useEffect(() => {
        if (!profile) {
            fetchProfile();
        }
    }, [profile, fetchProfile]);

    const skillsCount = profile?.skills?.length || 0;
    const profilePercentage = profile?.completionPercentage || 0;
    const targetRole = profile?.targetRole || 'Not Set';

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <h1>Welcome back, <span>{user?.fullname || user?.username || 'User'}</span>!</h1>
                <p>Track your progress and continue your learning journey.</p>
            </header>

            <section className="status-grid">
                <div className="status-card">
                    <h3>Profile Status</h3>
                    <div className={`status-value ${profilePercentage === 100 ? 'success' : 'warning'}`}>
                        {profilePercentage}%
                    </div>
                    <p>{profilePercentage === 100 ? 'Your profile is complete!' : 'Complete your info to reach 100%.'}</p>
                </div>
                <div className="status-card">
                    <h3>Skills Tracked</h3>
                    <div className="status-value info">{skillsCount} Skills</div>
                    <p>You have added {skillsCount} skills to your profile.</p>
                </div>
                <div className="status-card">
                    <h3>Target Role</h3>
                    <div className="status-value info">{targetRole}</div>
                    <p>{targetRole === 'Not Set' ? 'Define your goal for a custom roadmap.' : 'Currently targeting this role.'}</p>
                </div>
            </section>

            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <div className="action-card">
                        <div className="icon">👤</div>
                        <h3>Update Profile</h3>
                        <p>Tell us about your current role and aspirations.</p>
                        <Link to="/account/career" className="btn-action">Go to Profile</Link>
                    </div>
                    <div className="action-card">
                        <div className="icon">📝</div>
                        <h3>Take Assessment</h3>
                        <p>Test your knowledge and identify your skill level.</p>
                        <Link to="/assessment" className="btn-action">Start Quiz</Link>
                    </div>
                    <div className="action-card">
                        <div className="icon">🗺️</div>
                        <h3>View Roadmap</h3>
                        <p>See the steps needed to reach your target role.</p>
                        <Link to="/roadmap" className="btn-action">View Map</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
