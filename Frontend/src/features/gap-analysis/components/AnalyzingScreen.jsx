import React, { useState, useEffect } from 'react';

const steps = [
    "Parsing resume content...",
    "Extracting skills from job description...",
    "Comparing against your profile...",
    "Identifying skill gaps...",
    "Generating analysis report...",
];

export const AnalyzingScreen = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setStep(p => Math.min(p + 1, steps.length - 1)), 700);
        return () => clearInterval(t);
    }, []);

    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", minHeight: "60vh", gap: 32,
        }}>
            <div style={{ position: "relative" }}>
                <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    border: `3px solid var(--glass-border)`,
                    borderTop: `3px solid var(--accent)`,
                    animation: "gap-spin 1s linear infinite",
                }} />
                <div style={{
                    position: "absolute", inset: 0, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 28,
                }}>🤖</div>
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 12, color: 'var(--heading-color)' }}>
                    AI is analyzing your profile
                </div>
                <div style={{ width: 320, margin: '0 auto' }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "7px 0", opacity: i > step ? 0.2 : 1, transition: "opacity 0.4s",
                            textAlign: 'left'
                        }}>
                            <span style={{ color: i <= step ? "#00e5a0" : 'var(--para-color)', flexShrink: 0 }}>
                                {i < step ? "✓" : i === step ? "›" : "○"}
                            </span>
                            <span style={{ fontSize: 13, color: i <= step ? 'var(--text-main)' : 'var(--para-color)' }}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ width: 320 }}>
                <div className="gap-loading-bar" style={{ height: 4, borderRadius: 2 }} />
            </div>
        </div>
    );
};
