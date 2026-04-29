"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReferralPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyCode, setApplyCode] = useState("");
  const [applyMsg, setApplyMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) =>
      fetch("/api/referral/my-code", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (d.code) setReferralCode(d.code); })
        .catch(() => {})
    );
  }, [user]);

  function handleCopy() {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleApply() {
    if (!applyCode.trim() || !user) return;
    setApplying(true); setApplyMsg("");
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/referral/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code: applyCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      setApplyMsg(res.ok ? "✓ Referral code applied! You'll receive your reward after your first booking." : data.error ?? "Invalid code.");
    } catch {
      setApplyMsg("Something went wrong.");
    } finally {
      setApplying(false);
    }
  }

  if (loading || !user) return null;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${referralCode}`;

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        <Link href="/account" style={{ fontSize: 12, color: "#50606f", textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
          ← Back to Account
        </Link>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>
          Chello Yaku
        </p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 12, lineHeight: 1.1 }}>
          Refer a Friend<br /><em style={{ fontStyle: "italic", opacity: 0.8 }}>& Earn.</em>
        </h1>
        <p style={{ fontSize: "1rem", fontWeight: 300, color: "#50606f", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
          Share your unique referral code. When a friend completes their first booking, you earn <strong>500 loyalty points</strong>.
        </p>

        {/* Referral code card */}
        <div style={{ background: "#fff", borderRadius: "1rem", padding: 32, marginBottom: 24, boxShadow: "0 4px 24px rgba(27,48,34,0.06)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
            Your Referral Code
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              flex: 1, background: "#f5f4e8", borderRadius: "0.75rem", padding: "18px 24px",
              fontFamily: "'Noto Serif', serif", fontSize: "1.8rem", fontWeight: 300, letterSpacing: "0.15em", color: "#061b0e",
            }}>
              {referralCode ?? "Loading…"}
            </div>
            <button
              onClick={handleCopy}
              disabled={!referralCode}
              style={{
                background: copied ? "#d0e9d4" : "#061b0e", color: copied ? "#1b5e20" : "#fff",
                border: "none", borderRadius: "0.75rem", padding: "18px 20px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
              }}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          {referralCode && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, color: "#737973", marginBottom: 8 }}>Or share this link:</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  readOnly value={shareUrl}
                  style={{
                    flex: 1, background: "#f5f4e8", border: "none", borderRadius: "0.5rem",
                    padding: "10px 14px", fontSize: 12, color: "#50606f", outline: "none",
                  }}
                />
                <a
                  href={`https://wa.me/?text=Use%20my%20referral%20code%20${referralCode}%20at%20Grand%20Haven%20Hotel%20and%20get%20exclusive%20benefits!%20${encodeURIComponent(shareUrl)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    background: "#25D366", color: "#fff", border: "none", borderRadius: "0.5rem",
                    padding: "10px 16px", fontSize: 11, fontWeight: 700, textDecoration: "none",
                    display: "flex", alignItems: "center",
                  }}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div style={{ background: "#f5f4e8", borderRadius: "0.75rem", padding: 24, marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
            How it works
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { step: "1", text: "Share your unique code with friends & family" },
              { step: "2", text: "They register using your referral link" },
              { step: "3", text: "They complete their first booking at Chello Yaku" },
              { step: "4", text: "You receive 500 loyalty points — automatically!" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#061b0e", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {step}
                </div>
                <p style={{ fontSize: "0.875rem", color: "#434843", fontWeight: 300, lineHeight: 1.5 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Apply a referral code */}
        <div style={{ background: "#fff", borderRadius: "1rem", padding: 32, boxShadow: "0 4px 24px rgba(27,48,34,0.06)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
            Have a Friend's Code? Apply it here
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              value={applyCode}
              onChange={(e) => setApplyCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              maxLength={8}
              style={{
                flex: 1, background: "#f5f4e8", border: "none", borderRadius: "0.75rem",
                padding: "14px 18px", fontSize: 16, fontWeight: 700, letterSpacing: "0.1em",
                color: "#061b0e", outline: "none",
              }}
            />
            <button
              onClick={handleApply}
              disabled={applying || !applyCode}
              style={{
                background: "#061b0e", color: "#fff", border: "none", borderRadius: "0.75rem",
                padding: "14px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", cursor: "pointer",
              }}
            >
              {applying ? "Applying…" : "Apply"}
            </button>
          </div>
          {applyMsg && (
            <p style={{
              marginTop: 12, fontSize: "0.875rem",
              color: applyMsg.startsWith("✓") ? "#1b5e20" : "#ba1a1a",
            }}>
              {applyMsg}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
