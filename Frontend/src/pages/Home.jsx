import React from 'react';
import { Link } from 'react-router';
import './Home.scss';

const Home = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1>Master Your <span>Career Path</span> with AI</h1>
                        <p>
                            Bridge the gap between your current skills and your dream role. 
                            Get personalized roadmaps, skill assessments, and gap analysis powered by AI.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn-primary">Get Started</Link>
                            <Link to="/features" className="btn-secondary">Learn More</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        {/* Placeholder for hero image or illustration */}
                        <div className="image-placeholder"></div>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <h2>Everything you need to <span>Level Up</span></h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="icon">🚀</div>
                            <h3>Personalized Roadmaps</h3>
                            <p>Tailored learning paths to guide you from where you are to where you want to be.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon">📊</div>
                            <h3>Gap Analysis</h3>
                            <p>Identify exactly which skills you're missing for your target role.</p>
                        </div>
                        <div className="feature-card">
                            <div className="icon">📝</div>
                            <h3>Skill Assessments</h3>
                            <p>Validate your expertise with targeted quizzes and projects.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
