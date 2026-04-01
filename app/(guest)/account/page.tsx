import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getUserById } from "@/lib/firestore";
import { updateProfileAction } from "./actions";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your profile, view upcoming reservations, and update your preferences.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const token = cookies().get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const user = await getUserById(decoded.uid);
  if (!user) {
    return <div>User profile not found.</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", padding: 48, borderRadius: 12, boxShadow: "0 8px 32px rgba(27,48,34,0.05)" }}>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
          My Profile
        </h1>
        <p style={{ color: "#50606f", marginBottom: 32 }}>Manage your personal details and preferences.</p>
        
        <form action={updateProfileAction} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>First Name</label>
              <input name="firstName" defaultValue={user.firstName} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #d4d3c9", borderRadius: 6, background: "#fbfaee", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Last Name</label>
              <input name="lastName" defaultValue={user.lastName} required style={{ width: "100%", padding: "12px 16px", border: "1px solid #d4d3c9", borderRadius: 6, background: "#fbfaee", outline: "none" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Email (Read Only)</label>
            <input name="email" defaultValue={user.email} readOnly style={{ width: "100%", padding: "12px 16px", border: "1px solid #efeee3", borderRadius: 6, background: "#f2f1e8", color: "#737973", outline: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>
              {user.phone ? "Phone Number (Read Only)" : "Phone Number"}
            </label>
            <input 
              name="phone" 
              defaultValue={user.phone} 
              required
              readOnly={!!user.phone}
              style={{ 
                width: "100%", 
                padding: "12px 16px", 
                border: user.phone ? "1px solid #efeee3" : "1px solid #d4d3c9", 
                borderRadius: 6, 
                background: user.phone ? "#f2f1e8" : "#fbfaee",
                color: user.phone ? "#737973" : "inherit",
                outline: "none" 
              }} 
            />
          </div>

          <button type="submit" style={{ marginTop: 12, padding: "14px 24px", background: "#061b0e", color: "#fff", border: "none", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}>
            Save Changes
          </button>
        </form>

        <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid #efeee3", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>
            Quick Links
          </p>
          {[
            { href: "/account/bookings", label: "My Bookings", desc: "View and manage your reservations" },
            { href: "/account/loyalty",  label: "Loyalty Rewards", desc: "Check your points balance and tier" },
            { href: "/account/referral", label: "Referral Program", desc: "Share your code and earn 500 pts per friend" },
          ].map(({ href, label, desc }) => (
            <Link
              key={href} href={href}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "16px 20px", background: "#f5f4e8", borderRadius: "0.75rem",
                textDecoration: "none", color: "#061b0e",
              }}
            >
              <div>
                <p style={{ fontWeight: 500, fontSize: "0.9375rem", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 12, color: "#50606f", fontWeight: 300 }}>{desc}</p>
              </div>
              <span style={{ fontSize: 18, color: "#737973" }}>→</span>
            </Link>
          ))}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
