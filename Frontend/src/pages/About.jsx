import React from 'react';
import './About.scss';

const About = () => {
    return (
        <div className="about-page">
            <div className="container">
                <section className="about-hero">
                    <h1>Empowering <span>Professionals</span> Everywhere</h1>
                    <p>SkillPath was founded with a single mission: to make career progression accessible and transparent for everyone.</p>
                </section>

                <section className="about-content">
                    <div className="content-card">
                        <h3>Our Vision</h3>
                        <p>We envision a world where anyone can transition into their dream career by following a clear, data-driven path tailored to their unique background.</p>
                    </div>
                    <div className="content-card">
                        <h3>Our Technology</h3>
                        <p>By combining Large Language Models with real-world job market data, we provide insights that were previously only available through expensive career coaching.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
