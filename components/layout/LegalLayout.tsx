import React from "react";

interface LegalLayoutProps {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalLayout({ eyebrow, title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div style={{ background: "#fbfaee", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="legal-header" style={{ background: "#1b3022", padding: "72px 32px 56px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#b4cdb8",
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#819986",
              fontWeight: 300,
            }}
          >
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* ── PROSE CONTENT ────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "64px 32px 96px",
        }}
        className="legal-body"
      >
        <div
          style={{
            fontSize: "0.9375rem",
            lineHeight: 1.8,
            color: "#434843",
            fontWeight: 300,
          }}
          className="legal-prose"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

