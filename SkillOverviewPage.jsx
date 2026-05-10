import { useState, useRef } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg: "#05080f",
  surface: "#0c1220",
  card: "#111d2e",
  cardHover: "#162234",
  border: "#1a2d45",
  borderLight: "#243d5c",
  accent: "#00c6ff",
  accentGlow: "#00c6ff33",
  green: "#00e5a0",
  greenGlow: "#00e5a022",
  red: "#ff4d6d",
  redGlow: "#ff4d6d22",
  amber: "#ffb703",
  amberGlow: "#ffb70322",
  purple: "#a78bfa",
  text: "#dde8f5",
  textMuted: "#4a6580",
  textSub: "#7b96b2",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.text};
    font-family: 'Outfit', sans-serif;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.borderLight}; border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 ${T.accentGlow}; }
    70% { box-shadow: 0 0 0 12px transparent; }
    100% { box-shadow: 0 0 0 0 transparent; }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes borderRun {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  @keyframes scoreCount {
    from { opacity: 0; transform: scale(0.5); }
    to { opacity: 1; transform: scale(1); }
  }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-2 { animation: fadeUp 0.45s 0.1s ease both; }
  .fade-up-3 { animation: fadeUp 0.45s 0.2s ease both; }
  .fade-up-4 { animation: fadeUp 0.45s 0.3s ease both; }
  .fade-up-5 { animation: fadeUp 0.45s 0.4s ease both; }

  .skill-row:hover { background: ${T.cardHover} !important; }

  .btn-primary {
    background: linear-gradient(135deg, ${T.accent}, #0090d4);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 13px 28px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${T.accentGlow};
  }
  .btn-ghost {
    background: transparent;
    color: ${T.accent};
    border: 1px solid ${T.accent}55;
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover {
    background: ${T.accentGlow};
    border-color: ${T.accent};
  }
  .btn-green {
    background: linear-gradient(135deg, ${T.green}, #00b07a);
    color: #000;
    border: none;
    border-radius: 10px;
    padding: 13px 28px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-green:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${T.greenGlow};
  }
  .btn-outline-green {
    background: transparent;
    color: ${T.green};
    border: 1px solid ${T.green}55;
    border-radius: 10px;
    padding: 11px 22px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-outline-green:hover {
    background: ${T.greenGlow};
    border-color: ${T.green};
  }

  input[type="text"], textarea, select {
    background: ${T.surface};
    border: 1px solid ${T.border};
    border-radius: 10px;
    color: ${T.text};
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    padding: 11px 16px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input[type="text"]:focus, textarea:focus, select:focus {
    border-color: ${T.accent}88;
    box-shadow: 0 0 0 3px ${T.accentGlow};
  }
  textarea { resize: vertical; min-height: 90px; }
  select option { background: ${T.card}; }

  .upload-zone {
    border: 2px dashed ${T.borderLight};
    border-radius: 14px;
    padding: 36px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s;
    background: ${T.surface};
  }
  .upload-zone:hover, .upload-zone.drag-over {
    border-color: ${T.accent};
    background: ${T.accentGlow};
  }

  .tag {
    display: inline-block;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.3px;
  }

  .score-ring {
    position: relative;
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }

  table { border-collapse: collapse; width: 100%; }
  th {
    background: #0d1a2b;
    color: ${T.textSub};
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 12px 16px;
    text-align: left;
  }
  td { padding: 11px 16px; border-bottom: 1px solid ${T.border}22; font-size: 13.5px; vertical-align: middle; }

  .loading-bar {
    height: 3px;
    background: linear-gradient(90deg, transparent, ${T.accent}, ${T.green}, transparent);
    background-size: 200% 100%;
    animation: shimmer 1.4s linear infinite;
    border-radius: 2px;
  }
`;

// ── DATA LAYER ────────────────────────────────────────────────────────────────
// USER_PROFILE: Comes from GET /api/skills + GET /api/auth/me
// Replace this with actual API response when integrating backend.
const USER_PROFILE = {
  name: "John Doe",
  initials: "JD",
  currentJobRole: "Senior Full-Stack Engineer",
  targetJobRole: "DevOps / Platform Engineer",
  skills: [
    { id: 1, skill: "React.js",           level: "Advanced",     exp: "3 yrs",  confidence: "High"   },
    { id: 2, skill: "Node.js",             level: "Intermediate", exp: "2 yrs",  confidence: "Medium" },
    { id: 3, skill: "CI/CD Pipelines",     level: "Basic",        exp: "6 mo",   confidence: "High"   },
    { id: 4, skill: "Docker / Kubernetes", level: "Basic",        exp: "3 mo",   confidence: "Low"    },
    { id: 5, skill: "TypeScript",          level: "Intermediate", exp: "1.5 yrs",confidence: "High"   },
  ],
};

// AI_RESPONSE: Comes from POST /api/analyze/skill (or GET /api/analyze/skill/report on revisit)
// This is the exact shape the backend AI endpoint should return.
// When integrating: replace this object with the parsed API JSON response.
const AI_RESPONSE = {
  // ── Stored as SkillAnalysisReport in DB ──
  matchScore: 52,              // 0–100 overall job match
  resumeSelectionChance: 38,   // 0–100 likelihood of resume shortlist
  skillCoverage: 61,           // 0–100 % of required skills user has

  strengths: {
    items: [
      "React.js (Advanced)",
      "TypeScript proficiency",
      "Frontend architecture",
      "REST API design",
      "Git workflow",
    ],
    count: 5,
    percentage: 35,
  },
  weaknesses: {
    items: [
      "CI/CD pipelines (needs Advanced level)",
      "Docker orchestration",
      "Kubernetes deployment",
      "System design at scale",
      "Cloud infrastructure (AWS/GCP)",
    ],
    count: 5,
    percentage: 37,
  },
  moderates: {
    items: [
      "Node.js backend",
      "Database design",
      "Testing (Jest/Cypress)",
      "Linux/Shell scripting",
    ],
    count: 4,
    percentage: 28,
  },

  // Used to build radar chart — derived from skill gap comparison
  radarData: [
    { skill: "React",         you: 85, required: 90 },
    { skill: "Node.js",       you: 65, required: 80 },
    { skill: "CI/CD",         you: 30, required: 75 },
    { skill: "Docker",        you: 25, required: 70 },
    { skill: "TypeScript",    you: 70, required: 85 },
    { skill: "System Design", you: 50, required: 80 },
  ],

  // ── Stored as SkillGap[] rows in DB ──
  skillGap: [
    { skill: "CI/CD Pipelines",     required: "Advanced",     current: "Basic",        gap: 65 },
    { skill: "Docker / Kubernetes", required: "Intermediate", current: "Basic",        gap: 50 },
    { skill: "System Design",       required: "Advanced",     current: "None",         gap: 80 },
    { skill: "Node.js",             required: "Advanced",     current: "Intermediate", gap: 30 },
    { skill: "TypeScript",          required: "Expert",       current: "Intermediate", gap: 35 },
    { skill: "React.js",            required: "Expert",       current: "Advanced",     gap: 10 },
  ],

  // ── Stored as ResumeReport in DB ──
  resumeReport: {
    rating: 72,   // 0–100
    missing: [
      "GitHub / portfolio link",
      "Quantified impact metrics (e.g. '40% faster load time')",
      "Cloud platform certifications",
      "Open source contributions",
    ],
    exclude: [
      "Outdated Java/PHP skills (2018)",
      "Unrelated internship (retail, 2016)",
      "Objective statement — replace with summary",
    ],
    perfect: [
      "Education section",
      "Technical skills layout",
      "Project descriptions clarity",
      "Contact information",
    ],
    // generatedResume populated separately via POST /api/analyze/resume/generate
    generatedResumePreview: `John Doe — DevOps & Platform Engineer\njohn@email.com | github.com/johndoe | linkedin.com/in/johndoe\n\nFull-stack engineer transitioning to DevOps with 3+ years of experience in React, Node.js, and cloud infrastructure. Led optimization reducing build times by 40%. Actively expanding expertise in Kubernetes, Terraform, and CI/CD automation...\n\n[ Full resume continues — 2 pages ]`,
  },
};

// Derived from AI_RESPONSE for chart components (no changes needed during integration)
const RADAR_DATA = AI_RESPONSE.radarData;

const PIE_DATA = [
  { name: "Strong Areas",   value: AI_RESPONSE.strengths.percentage,  color: T.green },
  { name: "Moderate Areas", value: AI_RESPONSE.moderates.percentage,   color: T.amber },
  { name: "Weak Areas",     value: AI_RESPONSE.weaknesses.percentage,  color: T.red   },
];

// Flat aliases — so render code needs zero changes during backend integration
const MOCK_SKILLS  = USER_PROFILE.skills;
const STRENGTHS    = AI_RESPONSE.strengths.items;
const WEAKNESSES   = AI_RESPONSE.weaknesses.items;
const MODERATES    = AI_RESPONSE.moderates.items;
const SKILL_GAP    = AI_RESPONSE.skillGap;

// Resume aliases — sourced from AI_RESPONSE.resumeReport
const RESUME_MISSING = AI_RESPONSE.resumeReport.missing;
const RESUME_EXCLUDE = AI_RESPONSE.resumeReport.exclude;
const RESUME_PERFECT = AI_RESPONSE.resumeReport.perfect;

// ── SMALL HELPERS ─────────────────────────────────────────────────────────────
const levelColors = { Expert: T.green, Advanced: T.accent, Intermediate: T.amber, Basic: T.red, None: T.textMuted };
const confColors = { High: T.green, Medium: T.amber, Low: T.red };

function Chip({ label, color }) {
  return (
    <span className="tag" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
      {label}
    </span>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <div style={{ width: 3, height: 18, background: accent || T.accent, borderRadius: 2 }} />
      <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: T.text, letterSpacing: 0.3 }}>
        {children}
      </span>
    </div>
  );
}

function Card({ children, style = {}, className = "" }) {
  return (
    <div className={className} style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: "24px 26px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function ScoreRing({ score, label, color = T.accent, size = 140 }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.border} strokeWidth={8} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease", filter: `drop-shadow(0 0 6px ${color})` }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size > 130 ? 28 : 22, color, lineHeight: 1 }}>
            {score}%
          </span>
          <span style={{ fontSize: 10, color: T.textMuted, marginTop: 2, fontFamily: "monospace" }}>score</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 12, color: T.textSub, textAlign: "center", maxWidth: size }}>{label}</span>}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 20, height: 20, border: `2px solid ${T.border}`,
      borderTop: `2px solid ${T.accent}`, borderRadius: "50%",
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

// ── VIEW 1: INPUT ─────────────────────────────────────────────────────────────
function InputView({ onAnalyze }) {
  const [skills, setSkills] = useState(MOCK_SKILLS);
  const [jobRole, setJobRole] = useState("Senior Full-Stack Engineer");
  const [targetRole, setTargetRole] = useState("DevOps / Platform Engineer");
  const [jobDesc, setJobDesc] = useState("");
  const [fileName, setFileName] = useState(null);
  const [drag, setDrag] = useState(false);
  const [newSkill, setNewSkill] = useState({ skill: "", level: "Basic", exp: "", confidence: "Medium" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && (f.name.endsWith(".pdf") || f.name.endsWith(".docx"))) setFileName(f.name);
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, background: T.accentGlow,
            border: `1px solid ${T.accent}44`, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🎯</div>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: T.text, lineHeight: 1.1 }}>
              Skill Overview
            </h1>
            <p style={{ color: T.textMuted, fontSize: 13, marginTop: 2 }}>
              Analyze your skills against your target role with AI
            </p>
          </div>
        </div>
        <div className="loading-bar" style={{ opacity: 0.3 }} />
      </div>

      {/* Career Details */}
      <Card className="fade-up-2">
        <SectionLabel>Career Details</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: T.textMuted, fontFamily: "monospace", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CURRENT JOB ROLE</label>
            <input type="text" value={jobRole} onChange={e => setJobRole(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: T.textMuted, fontFamily: "monospace", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>TARGET JOB ROLE</label>
            <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
              style={{ borderColor: T.accent + "55" }} />
          </div>
        </div>

        {/* Skill Table */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, color: T.textSub }}>Your Skills</span>
          <button className="btn-ghost" style={{ padding: "7px 16px", fontSize: 12 }}
            onClick={() => setAdding(true)}>+ Add Skill</button>
        </div>

        <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
          <table>
            <thead>
              <tr>
                {["Skill", "Level", "Experience", "Confidence", ""].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="skill-row" style={{ background: T.card, transition: "background 0.15s" }}>
                  <td>
                    {editId === s.id
                      ? <input type="text" value={s.skill} onChange={e => updateSkill(s.id, "skill", e.target.value)} style={{ padding: "6px 10px", fontSize: 13 }} />
                      : <span style={{ color: T.text, fontWeight: 500 }}>{s.skill}</span>}
                  </td>
                  <td>
                    {editId === s.id
                      ? <select value={s.level} onChange={e => updateSkill(s.id, "level", e.target.value)} style={{ padding: "6px 10px" }}>
                          {["Basic", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                        </select>
                      : <Chip label={s.level} color={levelColors[s.level] || T.textSub} />}
                  </td>
                  <td>
                    {editId === s.id
                      ? <input type="text" value={s.exp} onChange={e => updateSkill(s.id, "exp", e.target.value)} style={{ padding: "6px 10px", fontSize: 13 }} />
                      : <span style={{ color: T.textSub, fontSize: 13 }}>{s.exp}</span>}
                  </td>
                  <td>
                    {editId === s.id
                      ? <select value={s.confidence} onChange={e => updateSkill(s.id, "confidence", e.target.value)} style={{ padding: "6px 10px" }}>
                          {["Low", "Medium", "High"].map(l => <option key={l}>{l}</option>)}
                        </select>
                      : <Chip label={s.confidence} color={confColors[s.confidence]} />}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {editId === s.id ? (
                      <span onClick={() => setEditId(null)} style={{ color: T.green, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save</span>
                    ) : (
                      <span style={{ display: "flex", gap: 12 }}>
                        <span onClick={() => setEditId(s.id)} style={{ color: T.accent, cursor: "pointer", fontSize: 12 }}>Edit</span>
                        <span onClick={() => deleteSkill(s.id)} style={{ color: T.red, cursor: "pointer", fontSize: 12 }}>Del</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Add Row */}
              {adding && (
                <tr style={{ background: T.accentGlow }}>
                  <td><input type="text" placeholder="Skill name..." value={newSkill.skill}
                    onChange={e => setNewSkill(p => ({ ...p, skill: e.target.value }))} style={{ padding: "6px 10px", fontSize: 13 }} /></td>
                  <td>
                    <select value={newSkill.level} onChange={e => setNewSkill(p => ({ ...p, level: e.target.value }))} style={{ padding: "6px 10px" }}>
                      {["Basic", "Intermediate", "Advanced", "Expert"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </td>
                  <td><input type="text" placeholder="e.g. 1 yr" value={newSkill.exp}
                    onChange={e => setNewSkill(p => ({ ...p, exp: e.target.value }))} style={{ padding: "6px 10px", fontSize: 13 }} /></td>
                  <td>
                    <select value={newSkill.confidence} onChange={e => setNewSkill(p => ({ ...p, confidence: e.target.value }))} style={{ padding: "6px 10px" }}>
                      {["Low", "Medium", "High"].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </td>
                  <td>
                    <span onClick={addSkill} style={{ color: T.green, cursor: "pointer", fontSize: 12, fontWeight: 700, marginRight: 10 }}>✓ Add</span>
                    <span onClick={() => setAdding(false)} style={{ color: T.textMuted, cursor: "pointer", fontSize: 12 }}>✕</span>
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
            className={`upload-zone${drag ? " drag-over" : ""}`}
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              {fileName ? "📄" : "⬆️"}
            </div>
            {fileName ? (
              <div>
                <div style={{ color: T.green, fontWeight: 600, fontSize: 14 }}>{fileName}</div>
                <div style={{ color: T.textMuted, fontSize: 12, marginTop: 4 }}>Click to change file</div>
              </div>
            ) : (
              <div>
                <div style={{ color: T.text, fontWeight: 500, fontSize: 14 }}>Drop your resume here</div>
                <div style={{ color: T.textMuted, fontSize: 12, marginTop: 4 }}>PDF or DOCX supported</div>
              </div>
            )}
          </div>
        </Card>

        {/* Job Description */}
        <Card>
          <SectionLabel>Target Job Description</SectionLabel>
          <textarea
            placeholder="Paste the job description here...&#10;&#10;e.g. We are looking for a DevOps engineer with 3+ years of experience in CI/CD, Docker, Kubernetes..."
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            style={{ minHeight: 148, lineHeight: 1.6, fontSize: 13 }}
          />
          <div style={{ marginTop: 8, fontSize: 11, color: T.textMuted, fontFamily: "monospace" }}>
            {jobDesc.length > 0 ? `${jobDesc.split(/\s+/).filter(Boolean).length} words` : "Tip: more detail = better analysis"}
          </div>
        </Card>
      </div>

      {/* Analyze Button */}
      <div className="fade-up-4" style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
        <button className="btn-primary" style={{ padding: "15px 52px", fontSize: 16, borderRadius: 14 }}
          onClick={onAnalyze}>
          ✦ Analyze with AI
        </button>
      </div>
    </div>
  );
}

// ── VIEW 2: OUTPUT ─────────────────────────────────────────────────────────────
function OutputView({ onReset }) {
  const [showGapReport, setShowGapReport] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [resumeReady, setResumeReady] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleGenerateResume = () => {
    setGeneratingResume(true);
    setTimeout(() => { setGeneratingResume(false); setResumeReady(true); }, 2800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div className="fade-up" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: T.text }}>
              Skill Analysis Report
            </span>
            <Chip label="AI Generated" color={T.accent} />
          </div>
          <p style={{ color: T.textMuted, fontSize: 13 }}>
            Target Role: <span style={{ color: T.accent, fontWeight: 600 }}>{USER_PROFILE.targetJobRole}</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          <button className="btn-ghost" style={{ padding: "9px 16px", fontSize: 12 }}
            onClick={onReset}>↺ Re-analyze</button>
          <button style={{
            background: T.red + "18", border: `1px solid ${T.red}44`, color: T.red,
            borderRadius: 10, padding: "9px 16px", fontSize: 12, cursor: "pointer",
            fontFamily: "'Syne', sans-serif", fontWeight: 600,
          }} onClick={onReset}>🗑 Delete Report</button>
        </div>
      </div>

      {/* Score Cards Row */}
      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { label: "Job Match Score",         score: AI_RESPONSE.matchScore,             color: T.amber,  sub: "Moderate fit"                    },
          { label: "Resume Selection Chance",  score: AI_RESPONSE.resumeSelectionChance,  color: T.red,    sub: "Below average"                   },
          { label: "Skill Coverage",           score: AI_RESPONSE.skillCoverage,          color: T.accent, sub: `${AI_RESPONSE.skillGap.length} skills compared` },
        ].map((s, i) => (
          <Card key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <ScoreRing score={s.score} color={s.color} size={120} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: T.text }}>{s.label}</div>
              <div style={{ fontSize: 12, color: s.color, marginTop: 3 }}>{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="fade-up-3" style={{ display: "flex", gap: 6, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "resume", label: "📄 Resume Feedback" },
          { id: "gap", label: "🔍 Skill Gap" },
        ].map(t => (
          <button key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 18px", fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 600,
              color: activeTab === t.id ? T.accent : T.textMuted,
              borderBottom: `2px solid ${activeTab === t.id ? T.accent : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
            }}>
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
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: T.textSub, fontSize: 11, fontFamily: "monospace" }} />
                  <Radar name="Your Level" dataKey="you" stroke={T.accent} fill={T.accent} fillOpacity={0.2} />
                  <Radar name="Required" dataKey="required" stroke={T.green} fill={T.green} fillOpacity={0.08} strokeDasharray="4 4" />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: T.textSub }} />
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
                    labelLine={{ stroke: T.borderLight }}>
                    {PIE_DATA.map((e, i) => (
                      <Cell key={i} fill={e.color} opacity={0.85}
                        style={{ filter: `drop-shadow(0 0 4px ${e.color})` }} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: T.textSub }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Strength vs Weakness Table */}
          <Card>
            <SectionLabel>Strength vs Weakness Comparison</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
              {[
                { title: "✅ Strong Areas", items: STRENGTHS, color: T.green },
                { title: "⚠️ Moderate", items: MODERATES, color: T.amber },
                { title: "❌ Weak Areas", items: WEAKNESSES, color: T.red },
              ].map((col, i) => (
                <div key={i} style={{ borderRight: i < 2 ? `1px solid ${T.border}` : "none" }}>
                  <div style={{ background: col.color + "15", padding: "10px 16px", fontSize: 12, fontWeight: 700, color: col.color, fontFamily: "monospace", borderBottom: `1px solid ${T.border}` }}>
                    {col.title}
                  </div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ padding: "10px 16px", fontSize: 13, color: T.text, borderBottom: j < col.items.length - 1 ? `1px solid ${T.border}22` : "none" }}>
                      <span style={{ color: col.color, marginRight: 8 }}>•</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="btn-green" onClick={() => setActiveTab("gap")}>
              🔍 View Skill Gap Report
            </button>
            <button className="btn-primary" onClick={() => setActiveTab("resume")}>
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
            <ScoreRing score={AI_RESPONSE.resumeReport.rating} color={T.amber} size={130} label="Resume Quality Score" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
                Your resume needs <span style={{ color: T.amber }}>some improvements</span>
              </div>
              <p style={{ color: T.textSub, fontSize: 13, lineHeight: 1.7 }}>
                Overall structure is good, but key DevOps-specific elements are missing.
                Adding quantified metrics and cloud certifications could push selection chance from 38% → 65%+.
              </p>
            </div>
          </Card>

          {/* Three columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {[
              { title: "🔴 Missing — Add These", items: RESUME_MISSING, color: T.red },
              { title: "🟡 Exclude — Remove These", items: RESUME_EXCLUDE, color: T.amber },
              { title: "🟢 Perfect — Keep These", items: RESUME_PERFECT, color: T.green },
            ].map((col, i) => (
              <Card key={i} style={{ padding: "20px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: col.color, fontFamily: "monospace", marginBottom: 14, letterSpacing: 0.3 }}>
                  {col.title}
                </div>
                {col.items.map((item, j) => (
                  <div key={j} style={{
                    display: "flex", gap: 8, alignItems: "flex-start",
                    padding: "8px 0", borderBottom: j < col.items.length - 1 ? `1px solid ${T.border}22` : "none",
                  }}>
                    <span style={{ color: col.color, flexShrink: 0, marginTop: 1 }}>
                      {col.color === T.red ? "＋" : col.color === T.amber ? "−" : "✓"}
                    </span>
                    <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>

          {/* Generate Resume Button */}
          <Card style={{ background: T.accentGlow, borderColor: T.accent + "44" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>Generate Corrected Resume</div>
                <div style={{ color: T.textMuted, fontSize: 13, marginTop: 4 }}>
                  AI will create an optimized resume tailored for the target role
                </div>
              </div>
              {!resumeReady ? (
                <button className="btn-primary" onClick={handleGenerateResume}
                  disabled={generatingResume}
                  style={{ display: "flex", alignItems: "center", gap: 10, opacity: generatingResume ? 0.8 : 1 }}>
                  {generatingResume ? <><Spinner /> Generating...</> : "✦ Generate Full Resume"}
                </button>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-green" style={{ fontSize: 13 }}>⬇ Download .docx</button>
                  <button className="btn-outline-green" style={{ fontSize: 13 }}>👁 Preview</button>
                </div>
              )}
            </div>

            {generatingResume && (
              <div style={{ marginTop: 16 }}>
                <div className="loading-bar" />
                <div style={{ color: T.textMuted, fontSize: 12, marginTop: 8, fontFamily: "monospace" }}>
                  AI is rewriting your resume for {USER_PROFILE.targetJobRole} role...
                </div>
              </div>
            )}

            {resumeReady && (
              <div style={{ marginTop: 16, padding: "14px 18px", background: T.card, borderRadius: 10, border: `1px solid ${T.green}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ color: T.green, fontSize: 18 }}>📄</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Resume Preview</span>
                  <Chip label="Ready" color={T.green} />
                </div>
                <div style={{
                  background: "#070c18", borderRadius: 8, padding: "16px 20px",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.textSub,
                  lineHeight: 1.8, border: `1px solid ${T.border}`, whiteSpace: "pre-wrap",
                }}>
                  {AI_RESPONSE.resumeReport.generatedResumePreview}
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
            <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
              <table>
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Required Level</th>
                    <th>Your Current Level</th>
                    <th>Gap %</th>
                  </tr>
                </thead>
                <tbody>
                  {SKILL_GAP.map((row, i) => (
                    <tr key={i} style={{
                      background: i % 2 === 0 ? "#0d1526" : T.card,
                    }}>
                      <td>
                        <span style={{ fontWeight: 600, color: row.gap > 50 ? T.red : T.text }}>{row.skill}</span>
                        {row.gap > 50 && <span style={{ marginLeft: 8, fontSize: 10, color: T.red }}>HIGH GAP</span>}
                      </td>
                      <td><Chip label={row.required} color={levelColors[row.required]} /></td>
                      <td><Chip label={row.current} color={levelColors[row.current] || T.textMuted} /></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 60, height: 5, background: T.border, borderRadius: 3 }}>
                            <div style={{
                              width: `${row.gap}%`, height: "100%", borderRadius: 3,
                              background: row.gap > 60 ? T.red : row.gap > 30 ? T.amber : T.green,
                            }} />
                          </div>
                          <span style={{ fontSize: 12, color: T.textSub, fontFamily: "monospace" }}>{row.gap}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Next step nudge — roadmap only available after assessment */}
          <Card style={{ background: T.accentGlow, borderColor: T.accent + "44" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                  Next Step — Take Assessment
                </div>
                <div style={{ color: T.textSub, fontSize: 13 }}>
                  Complete the skill assessment to validate your levels and unlock your personalized roadmap.
                </div>
              </div>
              <button className="btn-primary">📝 Go to Assessment →</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── LOADING TRANSITION ─────────────────────────────────────────────────────────
function AnalyzingScreen() {
  const steps = [
    "Parsing resume content...",
    "Extracting skills from job description...",
    "Comparing against your profile...",
    "Identifying skill gaps...",
    "Generating analysis report...",
  ];
  const [step, setStep] = useState(0);

  useState(() => {
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
          border: `3px solid ${T.border}`,
          borderTop: `3px solid ${T.accent}`,
          animation: "spin 1s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 28,
        }}>🤖</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 12 }}>
          AI is analyzing your profile
        </div>
        <div style={{ width: 320 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 0", opacity: i > step ? 0.2 : 1, transition: "opacity 0.4s",
            }}>
              <span style={{ color: i <= step ? T.green : T.textMuted, flexShrink: 0 }}>
                {i < step ? "✓" : i === step ? "›" : "○"}
              </span>
              <span style={{ fontSize: 13, color: i <= step ? T.text : T.textMuted }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 320 }}>
        <div className="loading-bar" style={{ height: 4, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("input"); // "input" | "analyzing" | "output"

  const handleAnalyze = () => {
    setView("analyzing");
    setTimeout(() => setView("output"), 4000);
  };

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: T.bg }}>
        {/* Top Nav */}
        <nav style={{
          borderBottom: `1px solid ${T.border}`,
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: T.surface,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: T.accent, letterSpacing: -0.5 }}>
              SkillBridge
            </span>
            {["Dashboard", "Skill Overview", "Assessment", "Roadmap", "Reports"].map((n, i) => (
              <span key={n} style={{
                fontSize: 13, color: i === 1 ? T.accent : T.textMuted,
                cursor: "pointer", fontWeight: i === 1 ? 600 : 400,
                borderBottom: i === 1 ? `2px solid ${T.accent}` : "2px solid transparent",
                paddingBottom: 2,
              }}>{n}</span>
            ))}
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#000",
          }}>{USER_PROFILE.initials}</div>
        </nav>

        {/* Page Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px 60px" }}>
          {view === "input" && <InputView onAnalyze={handleAnalyze} />}
          {view === "analyzing" && <AnalyzingScreen />}
          {view === "output" && <OutputView onReset={() => setView("input")} />}
        </div>
      </div>
    </>
  );
}
