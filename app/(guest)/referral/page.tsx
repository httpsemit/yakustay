import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserById } from "@/lib/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Friend",
  description: "Share your unique referral link to earn loyalty points when friends book their stay at Grand Haven Hotel.",
};

export const dynamic = "force-dynamic";

export default async function ReferralDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const user = await getUserById(decoded.uid);
  if (!user) return <div>User not found.</div>;

  const referralCode = user.referralCode || "N/A";
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/register?ref=${referralCode}`;

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 12 }}>Share Grand Haven</p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 48 }}>
          Refer a Friend
        </h1>

        <div style={{ background: "#fff", padding: 48, borderRadius: 12, boxShadow: "0 8px 32px rgba(27,48,34,0.05)", textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", color: "#061b0e", marginBottom: 16 }}>
            Give 10%, Get 500 Points
          </h2>
          <p style={{ color: "#50606f", maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Share your unique referral link with your friends. They get 10% off their first booking, and you earn 500 loyalty points (₹50 value) when they complete their stay.
          </p>

          <div style={{ background: "#f2f1e8", padding: "16px 24px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px dashed #d4d3c9" }}>
            <code style={{ fontSize: "1.125rem", color: "#061b0e", fontWeight: 500, letterSpacing: "0.05em" }}>
              {referralCode}
            </code>
            <button style={{ padding: "8px 16px", background: "#061b0e", color: "#fff", borderRadius: 4, border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "not-allowed", opacity: 0.5 }}>
              Copy Link
            </button>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#a5aba5", marginTop: 12, userSelect: "all" }}>
            {referralLink}
          </p>
        </div>

        <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 24 }}>
          Your Referrals (Stubbed)
        </h2>
        <div style={{ background: "#fff", padding: 32, borderRadius: 12, textAlign: "center" }}>
          <p style={{ color: "#50606f" }}>You haven't referred anyone yet.</p>
        </div>
      </div>
    </div>
  );
}
