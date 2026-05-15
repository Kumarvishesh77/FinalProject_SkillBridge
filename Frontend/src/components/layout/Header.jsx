import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../features/auth/hooks/user.Auth';
import './Header.scss';

const Header = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/', { replace: true });
    };

    return (
        <header className="header">
            <div className="container header-container">
                <Link to="/" className="logo">
                    Skill<span>Bridge</span>
                </Link>

                <nav className="navigation">
                    <Link to="/features">Features</Link>
                    <Link to="/about">About</Link>
                    {user ? (
                        <>
                            <Link to="/home">Dashboard</Link>
                            <div className="user-pill" style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                background: 'rgba(255,255,255,0.1)', 
                                padding: '4px 12px', 
                                borderRadius: '20px',
                                marginLeft: '20px'
                            }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                    {user.fullname?.split(' ')[0] || user.username}
                                </span>
                                <img 
                                    src={user.avatar || "/profileplaceHolder.jfif"} 
                                    alt="User" 
                                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>
                            <button className="btn-logout" onClick={onLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btnLogin-popup">Login</Link>
                            <Link to="/register" className="btnRegister-popup">Enrollment</Link>
                        </>
                    )}
                    <button id="darkModeToggle" onClick={toggleTheme}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
