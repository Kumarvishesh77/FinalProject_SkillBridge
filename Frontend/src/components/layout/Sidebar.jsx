import React from 'react';
import { NavLink } from 'react-router';
import './Sidebar.scss';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <NavLink to="/home" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                    <span className="icon">🏠</span>
                    <span className="label">Dashboard</span>
                </NavLink>
                
                <div className="nav-section">
                    <span className="section-title">Account</span>
                    <NavLink to="/account/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">👤</span>
                        <span className="label">Personal Info</span>
                    </NavLink>
                    <NavLink to="/account/career" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">💼</span>
                        <span className="label">Career Info</span>
                    </NavLink>
                </div>

                <div className="nav-section">
                    <span className="section-title">Skills & Growth</span>
                    <NavLink to="/skills" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">📊</span>
                        <span className="label">Skill Overview</span>
                    </NavLink>
                    <NavLink to="/assessment" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">📝</span>
                        <span className="label">Assessment</span>
                    </NavLink>
                    <NavLink to="/gap-analysis" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🔍</span>
                        <span className="label">Gap Analysis</span>
                    </NavLink>
                    <NavLink to="/roadmap" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="icon">🗺️</span>
                        <span className="label">Learning Roadmap</span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
