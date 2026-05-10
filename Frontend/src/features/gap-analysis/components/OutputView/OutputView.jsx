import React, { useState } from 'react';
import { useGapAnalysis } from '../../hooks/useGapAnalysis';
import { Card, Chip, ScoreRing, SectionLabel, Spinner } from '../Common';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const T = {
    green: "#00e5a0",
    amber: "#ffb703",
    red: "#ff4d6d",
    accent: "#00c6ff",
    purple: "#a78bfa"
};

const levelColors = { Expert: T.green, Advanced: T.accent, Intermediate: T.amber, Basic: T.red, None: "#7b96b2" };

export const OutputView = () => {
    const { analysisData, resetAnalysis, careerDetails } = useGapAnalysis();
    const [generatingResume, setGeneratingResume] = useState(false);
    const [resumeReady, setResumeReady] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    if (!analysisData) return null;

    const handleGenerateResume = () => {
        setGeneratingResume(true);
        setTimeout(() => { setGeneratingResume(false); setResumeReady(true); }, 2800);
    };

    // Defensive data extraction
    const strengths = analysisData.strengths || { items: [], count: 0, percentage: 0 };
    const moderates = analysisData.moderates || { items: [], count: 0, percentage: 0 };
    const weaknesses = analysisData.weaknesses || { items: [], count: 0, percentage: 0 };
    const radarData = Array.isArray(analysisData.radarData) ? analysisData.radarData : [];
    const skillGap = Array.isArray(analysisData.skillGap) ? analysisData.skillGap : [];
    const resumeReport = analysisData.resumeReport || { rating: 0, missing: [], exclude: [], perfect: [], generatedResumePreview: "" };

    const PIE_DATA = [
        { name: "Strong Areas",   value: strengths.percentage || 0,  color: T.green },
        { name: "Moderate Areas", value: moderates.percentage || 0,   color: T.amber },
        { name: "Weak Areas",     value: weaknesses.percentage || 0,  color: T.red   },
    ];

    return (
        <div className="gap-output-view" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Header */}
            <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--heading-color)' }}>
                            Skill Analysis Report
                        </span>
                        <Chip label="AI Generated" color="var(--accent)" />
                    </div>
                    <p style={{ color: 'var(--para-color)', fontSize: 13 }}>
                        Target Role: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{careerDetails.targetJobRole}</span>
                    </p>
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <button className="gap-btn-ghost" style={{ padding: "9px 16px", fontSize: 12 }}
                        onClick={resetAnalysis}>↺ Re-analyze</button>
                    <button className="gap-btn-danger-outline" onClick={resetAnalysis}>🗑 Delete Report</button>
                </div>
            </div>

            {/* Score Cards Row */}
            <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                    { label: "Job Match Score",         score: analysisData.matchScore || 0,             color: T.amber,  sub: "AI calculated fit"                    },
                    { label: "Resume Selection Chance",  score: analysisData.resumeSelectionChance || 0,  color: T.red,    sub: "ATS visibility score"                   },
                    { label: "Skill Coverage",           score: analysisData.skillCoverage || 0,          color: T.accent, sub: `${skillGap.length} skills compared` },
                ].map((s, i) => (
                    <Card key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <ScoreRing score={s.score} color={s.color} size={120} />
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--heading-color)' }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: s.color, marginTop: 3 }}>{s.sub}</div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tabs */}
            <div className="fade-up-3" style={{ display: "flex", gap: 6, borderBottom: `1px solid var(--glass-border)`, paddingBottom: 0 }}>
                {[
                    { id: "overview", label: "📊 Overview" },
                    { id: "resume", label: "📄 Resume Feedback" },
                    { id: "gap", label: "🔍 Skill Gap" },
                ].map(t => (
                    <button key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`gap-tab-btn ${activeTab === t.id ? 'active' : ''}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Graph + Comparison */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        {/* Radar Chart */}
                        <Card>
                            <SectionLabel accent={T.purple}>Skill Radar — You vs Required</SectionLabel>
                            <ResponsiveContainer width="100%" height={240}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="var(--glass-border)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--para-color)", fontSize: 11, fontFamily: "monospace" }} />
                                    <Radar name="Your Level" dataKey="you" stroke={T.accent} fill={T.accent} fillOpacity={0.2} />
                                    <Radar name="Required" dataKey="required" stroke={T.green} fill={T.green} fillOpacity={0.08} strokeDasharray="4 4" />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--para-color)" }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </Card>

                        {/* Pie Chart */}
                        <Card>
                            <SectionLabel accent={T.amber}>Areas Distribution</SectionLabel>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={85}
                                        innerRadius={50} paddingAngle={3} label={({ name, value }) => `${value}%`}
                                        labelLine={{ stroke: "var(--glass-border)" }}>
                                        {PIE_DATA.map((e, i) => (
                                            <Cell key={i} fill={e.color} opacity={0.85}
                                                style={{ filter: `drop-shadow(0 0 4px ${e.color})` }} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: "var(--glass-bg)", border: `1px solid var(--glass-border)`, borderRadius: 8, fontSize: 13 }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: "var(--para-color)" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>

                    {/* Strength vs Weakness Table */}
                    <Card>
                        <SectionLabel>Strength vs Weakness Comparison</SectionLabel>
                        <div className="gap-comparison-grid">
                            {[
                                { title: "✅ Strong Areas", items: strengths.items || [], color: T.green },
                                { title: "⚠️ Moderate", items: moderates.items || [], color: T.amber },
                                { title: "❌ Weak Areas", items: weaknesses.items || [], color: T.red },
                            ].map((col, i) => (
                                <div key={i} className="gap-comparison-col">
                                    <div style={{ background: col.color + "15", padding: "10px 16px", fontSize: 12, fontWeight: 700, color: col.color, fontFamily: "monospace", borderBottom: `1px solid var(--glass-border)` }}>
                                        {col.title}
                                    </div>
                                    {(col.items || []).map((item, j) => (
                                        <div key={j} style={{ padding: "10px 16px", fontSize: 13, color: 'var(--text-main)', borderBottom: j < (col.items?.length || 0) - 1 ? `1px solid var(--glass-border)` : "none" }}>
                                            <span style={{ color: col.color, marginRight: 8 }}>•</span>{item}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* CTA Buttons */}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        <button className="gap-btn-green" onClick={() => setActiveTab("gap")}>
                            🔍 View Skill Gap Report
                        </button>
                        <button className="gap-btn-primary" onClick={() => setActiveTab("resume")}>
                            📄 View Resume Feedback
                        </button>
                    </div>
                </div>
            )}

            {/* TAB: RESUME FEEDBACK */}
            {activeTab === "resume" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Resume Score */}
                    <Card style={{ display: "flex", alignItems: "center", gap: 28 }}>
                        <ScoreRing score={resumeReport.rating || 0} color={T.amber} size={130} label="Resume Quality Score" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                                Your resume needs <span style={{ color: T.amber }}>some improvements</span>
                            </div>
                            <p style={{ color: 'var(--para-color)', fontSize: 13, lineHeight: 1.7 }}>
                                AI has analyzed your resume against the target role requirements.
                                Review the sections below to see what to add, remove, or keep.
                            </p>
                        </div>
                    </Card>

                    {/* Three columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                        {[
                            { title: "🔴 Missing — Add These", items: resumeReport.missing || [], color: T.red },
                            { title: "🟡 Exclude — Remove These", items: resumeReport.exclude || [], color: T.amber },
                            { title: "🟢 Perfect — Keep These", items: resumeReport.perfect || [], color: T.green },
                        ].map((col, i) => (
                            <Card key={i} style={{ padding: "20px" }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: col.color, fontFamily: "monospace", marginBottom: 14, letterSpacing: 0.3 }}>
                                    {col.title}
                                </div>
                                {(col.items || []).map((item, j) => (
                                    <div key={j} style={{
                                        display: "flex", gap: 8, alignItems: "flex-start",
                                        padding: "8px 0", borderBottom: j < (col.items?.length || 0) - 1 ? `1px solid var(--glass-border)` : "none",
                                    }}>
                                        <span style={{ color: col.color, flexShrink: 0, marginTop: 1 }}>
                                            {col.color === T.red ? "＋" : col.color === T.amber ? "−" : "✓"}
                                        </span>
                                        <span style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5 }}>{item}</span>
                                    </div>
                                ))}
                            </Card>
                        ))}
                    </div>

                    {/* Generate Resume Button */}
                    <Card style={{ background: 'var(--accent)11', borderColor: 'var(--accent)44' }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>Generate Corrected Resume</div>
                                <div style={{ color: 'var(--para-color)', fontSize: 13, marginTop: 4 }}>
                                    AI will create an optimized resume tailored for the target role
                                </div>
                            </div>
                            {!resumeReady ? (
                                <button className="gap-btn-primary" onClick={handleGenerateResume}
                                    disabled={generatingResume}
                                    style={{ display: "flex", alignItems: "center", gap: 10, opacity: generatingResume ? 0.8 : 1 }}>
                                    {generatingResume ? <><Spinner /> Generating...</> : "✦ Generate Full Resume"}
                                </button>
                            ) : (
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button className="gap-btn-green" style={{ fontSize: 13 }}>⬇ Download .docx</button>
                                    <button className="gap-btn-green-outline" style={{ fontSize: 13 }}>👁 Preview</button>
                                </div>
                            )}
                        </div>

                        {generatingResume && (
                            <div style={{ marginTop: 16 }}>
                                <div className="gap-loading-bar" />
                                <div style={{ color: 'var(--para-color)', fontSize: 12, marginTop: 8, fontFamily: "monospace" }}>
                                    AI is rewriting your resume for {careerDetails.targetJobRole} role...
                                </div>
                            </div>
                        )}

                        {resumeReady && (
                            <div style={{ marginTop: 16, padding: "14px 18px", background: "var(--glass-bg)", borderRadius: 10, border: `1px solid ${T.green}33` }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                    <span style={{ color: T.green, fontSize: 18 }}>📄</span>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>Resume Preview</span>
                                    <Chip label="Ready" color={T.green} />
                                </div>
                                <div style={{
                                    background: "rgba(0,0,0,0.1)", borderRadius: 8, padding: "16px 20px",
                                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--para-color)',
                                    lineHeight: 1.8, border: `1px solid var(--glass-border)`, whiteSpace: "pre-wrap",
                                }}>
                                    {resumeReport.generatedResumePreview}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* TAB: SKILL GAP */}
            {activeTab === "gap" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <Card>
                        <SectionLabel accent={T.green}>Skill Gap Analysis</SectionLabel>
                        <div className="gap-table-container">
                            <table className="gap-table">
                                <thead>
                                    <tr>
                                        <th>Skill</th>
                                        <th>Required Level</th>
                                        <th>Your Current Level</th>
                                        <th>Gap %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skillGap.map((row, i) => (
                                        <tr key={i} className="skill-row">
                                            <td>
                                                <span style={{ fontWeight: 600, color: row.gap > 50 ? T.red : 'var(--text-main)' }}>{row.skill}</span>
                                                {row.gap > 50 && <span style={{ marginLeft: 8, fontSize: 10, color: T.red }}>HIGH GAP</span>}
                                            </td>
                                            <td><Chip label={row.required} color={levelColors[row.required]} /></td>
                                            <td><Chip label={row.current} color={levelColors[row.current] || 'var(--para-color)'} /></td>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <div style={{ width: 60, height: 5, background: "var(--glass-border)", borderRadius: 3 }}>
                                                        <div style={{
                                                            width: `${row.gap}%`, height: "100%", borderRadius: 3,
                                                            background: row.gap > 60 ? T.red : row.gap > 30 ? T.amber : T.green,
                                                        }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, color: 'var(--para-color)', fontFamily: "monospace" }}>{row.gap}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Next step nudge — roadmap only available after assessment */}
                    <Card style={{ background: 'var(--accent)11', borderColor: 'var(--accent)44' }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                                    Next Step — Take Assessment
                                </div>
                                <div style={{ color: 'var(--para-color)', fontSize: 13 }}>
                                    Complete the skill assessment to validate your levels and unlock your personalized roadmap.
                                </div>
                            </div>
                            <button className="gap-btn-primary">📝 Go to Assessment →</button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
