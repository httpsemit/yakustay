import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getLoyaltyProfile } from "@/lib/firestore";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LoyaltyRedeemPage() {
  const token = cookies().get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const profile = await getLoyaltyProfile(decoded.uid) || { pointsBalance: 0 };
  const maxDiscountValue = Math.floor(profile.pointsBalance / 10);

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 48, borderRadius: 12, boxShadow: "0 8px 32px rgba(27,48,34,0.05)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 12 }}>Loyalty Program</p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
          Redeem Points
        </h1>
        <p style={{ color: "#50606f", marginBottom: 32 }}>Exchange your loyalty points for discounts on your next stay. 10 points = ₹1.</p>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f2f1e8", padding: "16px 24px", borderRadius: 8, marginBottom: 32 }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#061b0e", margin: 0 }}>Available Points</p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", color: "#061b0e", margin: 0 }}>{profile.pointsBalance}</p>
        </div>

        <form action="/api/loyalty/redeem" method="POST" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Amount to Redeem</label>
            <div style={{ position: "relative" }}>
              <input type="number" name="points" max={profile.pointsBalance} min={100} defaultValue={profile.pointsBalance >= 100 ? profile.pointsBalance : ""} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #d4d3c9", borderRadius: 6, background: "#fbfaee", outline: "none", fontSize: "1rem" }} placeholder="Min. 100 points" />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#a5aba5", fontSize: "0.875rem" }}>pts</span>
            </div>
          </div>
          <button type="submit" disabled={profile.pointsBalance < 100} style={{ padding: "14px 24px", background: profile.pointsBalance < 100 ? "#a5aba5" : "#061b0e", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, cursor: profile.pointsBalance < 100 ? "not-allowed" : "pointer", transition: "background 0.2s" }}>
             Generate Discount Code
          </button>
          {profile.pointsBalance < 100 && (
            <p style={{ fontSize: "0.8125rem", color: "#d93025", margin: 0 }}>You need at least 100 points to redeem a discount.</p>
          )}
        </form>

        <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid #efeee3" }}>
          <Link href="/loyalty" style={{ color: "#061b0e", fontWeight: 500, textDecoration: "none", fontSize: "0.875rem" }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
