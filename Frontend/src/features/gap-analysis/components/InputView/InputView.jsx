import React, { useState, useRef } from 'react';
import { useGapAnalysis } from '../../hooks/useGapAnalysis';
import { Card, Chip, SectionLabel } from '../Common';

const levelColors = { Expert: "#00e5a0", Advanced: "#00c6ff", Intermediate: "#ffb703", Basic: "#ff4d6d", None: "#7b96b2" };
const confColors = { High: "#00e5a0", Medium: "#ffb703", Low: "#ff4d6d" };

export const InputView = () => {
    const { skills, setSkills, careerDetails, setCareerDetails, handleAnalyze, resumeFile, setResumeFile } = useGapAnalysis();
    const [drag, setDrag] = useState(false);
    const [newSkill, setNewSkill] = useState({ skill: "", level: "Basic", exp: "", confidence: "Medium" });
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState(null);
    const fileRef = useRef();

    const handleFile = (f) => {
        if (f && (f.name.endsWith(".pdf") || f.name.endsWith(".docx"))) {
            setResumeFile(f);
        }
    };

    const addSkill = () => {
        if (!newSkill.skill.trim()) return;
        setSkills(p => [...p, { id: Date.now(), ...newSkill }]);
        setNewSkill({ skill: "", level: "Basic", exp: "", confidence: "Medium" });
        setAdding(false);
    };

    const deleteSkill = (id) => setSkills(p => p.filter(s => s.id !== id));

    const updateSkill = (id, field, val) =>
        setSkills(p => p.map(s => s.id === id ? { ...s, [field]: val } : s));

    return (
        <div className="gap-input-view" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div className="fade-up" style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                        width: 36, height: 36, background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)', borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18,
                    }}>🎯</div>
                    <div>
                        <h1 style={{ fontWeight: 800, fontSize: 22, color: 'var(--heading-color)', lineHeight: 1.1 }}>
                            Gap Analysis
                        </h1>
                        <p style={{ color: 'var(--para-color)', fontSize: 13, marginTop: 2 }}>
                            Analyze your skills against your target role with AI
                        </p>
                    </div>
                </div>
            </div>

            {/* Career Details */}
            <Card className="fade-up-2">
                <SectionLabel>Career Details</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                    <div>
                        <label className="gap-label">CURRENT JOB ROLE</label>
                        <input className="gap-input" type="text" value={careerDetails.currentJobRole} 
                            onChange={e => setCareerDetails(p => ({...p, currentJobRole: e.target.value}))} />
                    </div>
                    <div>
                        <label className="gap-label">TARGET JOB ROLE</label>
                        <input className="gap-input" type="text" value={careerDetails.targetJobRole} 
                            onChange={e => setCareerDetails(p => ({...p, targetJobRole: e.target.value}))}
                            style={{ borderColor: "var(--accent)" }} />
                    </div>
                </div>

                {/* Skill Table */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--para-color)' }}>Your Skills</span>
                    <button className="gap-btn-ghost" style={{ padding: "7px 16px", fontSize: 12 }}
                        onClick={() => setAdding(true)}>+ Add Skill</button>
                </div>

                <div className="gap-table-container">
                    <table className="gap-table">
                        <thead>
                            <tr>
                                {["Skill", "Level", "Experience", "Confidence", ""].map((h, i) => (
                                    <th key={i}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {skills.map((s) => (
                                <tr key={s.id} className="skill-row">
                                    <td>
                                        {editId === s.id
                                            ? <input className="gap-input-sm" type="text" value={s.skill} onChange={e => updateSkill(s.id, "skill", e.target.value)} />
                                            : <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{s.skill}</span>}
                                    </td>
                                    <td>
                                        {editId === s.id
                                            ? <select className="gap-select" value={s.level} onChange={e => updateSkill(s.id, "level", e.target.value)}>
                                                {["Basic", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                                            </select>
                                            : <Chip label={s.level} color={levelColors[s.level] || 'var(--para-color)'} />}
                                    </td>
                                    <td>
                                        {editId === s.id
                                            ? <input className="gap-input-sm" type="text" value={s.exp} onChange={e => updateSkill(s.id, "exp", e.target.value)} />
                                            : <span style={{ color: 'var(--para-color)', fontSize: 13 }}>{s.exp}</span>}
                                    </td>
                                    <td>
                                        {editId === s.id
                                            ? <select className="gap-select" value={s.confidence} onChange={e => updateSkill(s.id, "confidence", e.target.value)}>
                                                {["Low", "Medium", "High"].map(l => <option key={l}>{l}</option>)}
                                            </select>
                                            : <Chip label={s.confidence} color={confColors[s.confidence]} />}
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        {editId === s.id ? (
                                            <span onClick={() => setEditId(null)} className="gap-action-btn success">Save</span>
                                        ) : (
                                            <span style={{ display: "flex", gap: 12 }}>
                                                <span onClick={() => setEditId(s.id)} className="gap-action-btn primary">Edit</span>
                                                <span onClick={() => deleteSkill(s.id)} className="gap-action-btn danger">Del</span>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {/* Add Row */}
                            {adding && (
                                <tr className="gap-add-row">
                                    <td><input className="gap-input-sm" type="text" placeholder="Skill name..." value={newSkill.skill}
                                        onChange={e => setNewSkill(p => ({ ...p, skill: e.target.value }))} /></td>
                                    <td>
                                        <select className="gap-select" value={newSkill.level} onChange={e => setNewSkill(p => ({ ...p, level: e.target.value }))}>
                                            {["Basic", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                                        </select>
                                    </td>
                                    <td><input className="gap-input-sm" type="text" placeholder="e.g. 1 yr" value={newSkill.exp}
                                        onChange={e => setNewSkill(p => ({ ...p, exp: e.target.value }))} /></td>
                                    <td>
                                        <select className="gap-select" value={newSkill.confidence} onChange={e => setNewSkill(p => ({ ...p, confidence: e.target.value }))}>
                                            {["Low", "Medium", "High"].map(l => <option key={l}>{l}</option>)}
                                        </select>
                                    </td>
                                    <td>
                                        <span onClick={addSkill} className="gap-action-btn success">✓ Add</span>
                                        <span onClick={() => setAdding(false)} className="gap-action-btn muted">✕</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Upload + Job Desc */}
            <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Resume Upload */}
                <Card>
                    <SectionLabel>Upload Resume</SectionLabel>
                    <div
                        className={`gap-upload-zone${drag ? " drag-over" : ""}`}
                        onClick={() => fileRef.current.click()}
                        onDragOver={e => { e.preventDefault(); setDrag(true); }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                    >
                        <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: "none" }}
                            onChange={e => handleFile(e.target.files[0])} />
                        <div style={{ fontSize: 36, marginBottom: 12 }}>
                            {resumeFile ? "📄" : "⬆️"}
                        </div>
                        {resumeFile ? (
                            <div>
                                <div style={{ color: "#00e5a0", fontWeight: 600, fontSize: 14 }}>{resumeFile.name}</div>
                                <div style={{ color: 'var(--para-color)', fontSize: 12, marginTop: 4 }}>Click to change file</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: 14 }}>Drop your resume here</div>
                                <div style={{ color: 'var(--para-color)', fontSize: 12, marginTop: 4 }}>PDF or DOCX supported</div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Job Description */}
                <Card>
                    <SectionLabel>Target Job Description</SectionLabel>
                    <textarea
                        className="gap-textarea"
                        placeholder="Paste the job description here...&#10;&#10;e.g. We are looking for a DevOps engineer with 3+ years of experience in CI/CD, Docker, Kubernetes..."
                        value={careerDetails.jobDescription}
                        onChange={e => setCareerDetails(p => ({...p, jobDescription: e.target.value}))}
                        style={{ minHeight: 148, lineHeight: 1.6, fontSize: 13 }}
                    />
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--para-color)', fontFamily: "monospace" }}>
                        {careerDetails.jobDescription.length > 0 ? `${careerDetails.jobDescription.split(/\s+/).filter(Boolean).length} words` : "Tip: more detail = better analysis"}
                    </div>
                </Card>
            </div>

            {/* Analyze Button */}
            <div className="fade-up-4" style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                <button className="gap-btn-primary" style={{ padding: "15px 52px", fontSize: 16, borderRadius: 14 }}
                    onClick={handleAnalyze}>
                    ✦ Analyze with AI
                </button>
            </div>
        </div>
    );
};
