import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="endwraper">
                    <div className="footer-section">
                        <b>Resources</b>
                        <ul>
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">Skill Repository</a></li>
                            <li><a href="#">Community</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <b>Company</b>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <b>Legal</b>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-credit">
                    &copy; 2026 SkillPath. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
