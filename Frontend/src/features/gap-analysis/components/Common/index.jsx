import React from 'react';

export const Card = ({ children, style = {}, className = "" }) => {
  return (
    <div className={`gap-card ${className}`} style={{
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      padding: '24px 26px',
      backdropFilter: 'blur(20px)',
      boxShadow: 'var(--shadow)',
      ...style,
    }}>
      {children}
    </div>
  );
};

export const Chip = ({ label, color }) => {
  return (
    <span className="gap-tag" style={{ 
      background: color + "22", 
      color, 
      border: `1px solid ${color}44`,
      display: 'inline-block',
      borderRadius: '6px',
      padding: '3px 10px',
      fontSize: '11px',
      fontWeight: '600',
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.3px',
    }}>
      {label}
    </span>
  );
};

export const SectionLabel = ({ children, accent }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
      <div style={{ width: 3, height: 18, background: accent || 'var(--accent)', borderRadius: 2 }} />
      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--heading-color)', letterSpacing: '0.3px' }}>
        {children}
      </span>
    </div>
  );
};

export const ScoreRing = ({ score, label, color = 'var(--accent)', size = 140 }) => {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--glass-border)" strokeWidth={8} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.2s ease", filter: `drop-shadow(0 0 6px ${color})` }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontWeight: 800, fontSize: size > 130 ? 28 : 22, color, lineHeight: 1 }}>
            {score}%
          </span>
          <span style={{ fontSize: 10, color: "var(--para-color)", marginTop: 2, fontFamily: "monospace" }}>score</span>
        </div>
      </div>
      {label && <span style={{ fontSize: 12, color: "var(--para-color)", textAlign: "center", maxWidth: size }}>{label}</span>}
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="gap-spinner" style={{
      width: 20, height: 20, border: '2px solid var(--glass-border)',
      borderTop: '2px solid var(--accent)', borderRadius: '50%',
      animation: 'gap-spin 0.7s linear infinite', flexShrink: 0,
    }} />
  );
};
