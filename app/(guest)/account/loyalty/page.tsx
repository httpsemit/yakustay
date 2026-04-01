import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getLoyaltyProfile, getPointTransactions } from "@/lib/firestore";
import Link from "next/link";

export const dynamic = "force-dynamic";

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Silver:   { bg: "#e8e8e8", text: "#4a4a4a", border: "#c0c0c0" },
  Gold:     { bg: "#fff8e1", text: "#795900", border: "#ffd740" },
  Platinum: { bg: "#e8f5e9", text: "#1b5e20", border: "#66bb6a" },
};

const TIER_THRESHOLDS = [
  { tier: "Silver",   min: 0,    max: 999,  next: "Gold",     nextAt: 1000 },
  { tier: "Gold",     min: 1000, max: 4999, next: "Platinum", nextAt: 5000 },
  { tier: "Platinum", min: 5000, max: Infinity, next: null,   nextAt: null },
];

export default async function LoyaltyPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    redirect("/login");
  }

  const [profile, transactions] = await Promise.all([
    getLoyaltyProfile(uid!).catch(() => null),
    getPointTransactions(uid!).catch(() => []),
  ]);

  const tier = profile?.tier ?? "Silver";
  const balance = profile?.pointsBalance ?? 0;
  const lifetime = profile?.lifetimePoints ?? 0;
  const colors = TIER_COLORS[tier];
  const thresholdInfo = TIER_THRESHOLDS.find((t) => t.tier === tier)!;
  const progressPct = thresholdInfo.nextAt
    ? Math.min(100, ((lifetime - thresholdInfo.min) / (thresholdInfo.nextAt - thresholdInfo.min)) * 100)
    : 100;

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Back link */}
        <Link href="/account" style={{ fontSize: 12, color: "#50606f", textDecoration: "none", display: "inline-block", marginBottom: 32 }}>
          ← Back to Account
        </Link>

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>
          Grand Haven
        </p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 40, lineHeight: 1.1 }}>
          Your Loyalty<br /><em style={{ fontStyle: "italic", opacity: 0.8 }}>Rewards.</em>
        </h1>

        {/* Tier card */}
        <div style={{
          background: "#fff", borderRadius: "1rem", padding: 32, marginBottom: 24,
          boxShadow: "0 4px 24px rgba(27,48,34,0.06)", border: `1px solid ${colors.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Current Tier</p>
              <div style={{ display: "inline-block", background: colors.bg, color: colors.text, padding: "6px 20px", borderRadius: 9999, fontWeight: 700, fontSize: 14, letterSpacing: "0.08em" }}>
                {tier}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>Points Balance</p>
              <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", lineHeight: 1 }}>
                {balance.toLocaleString()}
              </p>
              <p style={{ fontSize: 11, color: "#737973", marginTop: 4 }}>pts</p>
            </div>
          </div>

          {/* Progress bar */}
          {thresholdInfo.nextAt && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ fontSize: 12, color: "#50606f" }}>{lifetime.toLocaleString()} lifetime pts</p>
                <p style={{ fontSize: 12, color: "#50606f" }}>{thresholdInfo.nextAt.toLocaleString()} for {thresholdInfo.next}</p>
              </div>
              <div style={{ height: 6, background: "#efeee3", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "#061b0e", borderRadius: 999, transition: "width 0.5s" }} />
              </div>
              <p style={{ fontSize: 11, color: "#50606f", marginTop: 6 }}>
                {(thresholdInfo.nextAt - lifetime).toLocaleString()} more points to reach {thresholdInfo.next}
              </p>
            </div>
          )}
          {!thresholdInfo.nextAt && (
            <p style={{ marginTop: 16, fontSize: 13, color: "#1b5e20", fontWeight: 500 }}>
              🎉 You've reached our highest tier — Platinum!
            </p>
          )}
        </div>

        {/* How it works */}
        <div style={{ background: "#f5f4e8", borderRadius: "0.75rem", padding: 24, marginBottom: 32 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>How it works</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { tier: "Silver", pts: "0–999 pts", perks: "1 pt per ₹1 spent" },
              { tier: "Gold",   pts: "1,000+ pts", perks: "1.5× earning rate" },
              { tier: "Platinum", pts: "5,000+ pts", perks: "2× earning + priority service" },
            ].map(({ tier: t, pts, perks }) => (
              <div key={t} style={{ background: "#fff", borderRadius: "0.6rem", padding: 16, border: `1px solid ${TIER_COLORS[t].border}` }}>
                <div style={{ fontWeight: 700, color: TIER_COLORS[t].text, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 12, color: "#50606f", marginBottom: 4 }}>{pts}</div>
                <div style={{ fontSize: 12, color: "#434843" }}>{perks}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
          Points History
        </p>
        {transactions.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "0.75rem", padding: 32, textAlign: "center", color: "#737973", fontSize: "0.875rem", boxShadow: "0 2px 12px rgba(27,48,34,0.04)" }}>
            No transactions yet. Complete a booking to start earning points!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {transactions.map((tx) => (
              <div key={tx.id} style={{
                background: "#fff", borderRadius: "0.75rem", padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 2px 8px rgba(27,48,34,0.04)",
              }}>
                <div>
                  <p style={{ fontSize: "0.875rem", color: "#061b0e", fontWeight: 400 }}>{tx.description}</p>
                  <p style={{ fontSize: 11, color: "#737973", marginTop: 2 }}>
                    {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span style={{
                  fontFamily: "'Noto Serif', serif", fontSize: "1.1rem", fontWeight: 500,
                  color: tx.type === "earned" ? "#1b5e20" : "#ba1a1a",
                }}>
                  {tx.type === "earned" ? "+" : "-"}{tx.amount.toLocaleString()} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
