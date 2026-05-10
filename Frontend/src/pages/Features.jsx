import React from 'react';
import './Features.scss';

const Features = () => {
    return (
        <div className="features-page">
            <div className="container">
                <section className="features-header">
                    <h1>Powerful <span>Features</span> for Your Growth</h1>
                    <p>Leverage the power of AI to accelerate your career development.</p>
                </section>

                <div className="features-detailed">
                    <div className="feature-block">
                        <div className="feature-info">
                            <h3>AI-Powered Roadmaps</h3>
                            <p>Our advanced algorithms analyze thousands of career paths to generate the most efficient learning roadmap for you. No more guessing what to learn next.</p>
                        </div>
                        <div className="feature-visual"></div>
                    </div>

                    <div className="feature-block reverse">
                        <div className="feature-info">
                            <h3>Real-time Gap Analysis</h3>
                            <p>Upload your resume or link your LinkedIn, and we'll compare your current skills against the requirements of your target role in seconds.</p>
                        </div>
                        <div className="feature-visual"></div>
                    </div>

                    <div className="feature-block">
                        <div className="feature-info">
                            <h3>Smart Skill Repository</h3>
                            <p>Access a curated list of resources for every skill in your roadmap. We find the best courses, documentation, and tutorials so you don't have to.</p>
                        </div>
                        <div className="feature-visual"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
