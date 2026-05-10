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
                            <button className="btn-logout" onClick={onLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btnLogin-popup">Login</Link>
                            <Link to="/register" className="btnRegister-popup">Sign Up</Link>
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
