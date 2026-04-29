import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getLoyaltyProfile, getPointTransactions } from "@/lib/firestore";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loyalty Dashboard",
  description: "View your loyalty tier, track your points balance, and redeem rewards at Chello Yaku Hotel.",
};

export const dynamic = "force-dynamic";

export default async function LoyaltyDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  // If no loyalty profile exists, we can show default "Silver" with 0 points
  const profile = await getLoyaltyProfile(decoded.uid) || {
    pointsBalance: 0,
    lifetimePoints: 0,
    tier: "Silver"
  };

  const transactions = await getPointTransactions(decoded.uid);

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 12 }}>Rewards Program</p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 48 }}>
          Loyalty Dashboard
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div style={{ background: "#061b0e", padding: 32, borderRadius: 12, color: "#fff", boxShadow: "0 8px 32px rgba(27,48,34,0.15)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>Available Points</p>
            <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "3rem", margin: 0 }}>{profile.pointsBalance}</p>
            
            <Link href="/loyalty/redeem" style={{ display: "inline-block", marginTop: 24, padding: "10px 20px", background: "#fbfaee", color: "#061b0e", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
              Redeem Points
            </Link>
          </div>
          <div style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 8px 32px rgba(27,48,34,0.05)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Current Tier</p>
            <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", color: "#061b0e", marginBottom: 8 }}>{profile.tier}</p>
            <p style={{ fontSize: "0.875rem", color: "#50606f" }}>Lifetime Points: {profile.lifetimePoints}</p>
            
            <div style={{ marginTop: 24, fontSize: "0.875rem", color: "#50606f" }}>
              {profile.tier === "Silver" ? "Reach 1,000 points for Gold Tier." : profile.tier === "Gold" ? "Reach 5,000 points for Platinum Tier." : "You've reached the highest tier!"}
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 24 }}>
          Transaction History
        </h2>
        
        {transactions.length === 0 ? (
          <div style={{ background: "#fff", padding: 32, borderRadius: 12, textAlign: "center" }}>
            <p style={{ color: "#50606f" }}>No points history available yet.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
            {transactions.map((tx, idx) => (
              <div key={tx.id} style={{ padding: "24px 32px", borderBottom: idx !== transactions.length - 1 ? "1px solid #efeee3" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#061b0e", marginBottom: 4 }}>{tx.description}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#50606f" }}>{format(new Date(tx.createdAt), "MMM d, yyyy")}</p>
                </div>
                <div style={{ fontSize: "1.125rem", fontWeight: 500, color: tx.type === "earned" ? "#065f46" : "#991b1b" }}>
                  {tx.type === "earned" ? "+" : "-"}{tx.amount} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
