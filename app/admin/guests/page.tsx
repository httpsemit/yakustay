import { getAllUsers } from "@/lib/firestore";
import Link from "next/link";
import { format } from "date-fns";
import { Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export default async function AdminGuestsPage() {
  const users = await getAllUsers();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <div>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
            Guests
          </h1>
          <p style={{ color: "#50606f" }}>View registered users and their details.</p>
        </div>
        <Link href="/api/admin/guests/export" target="_blank" style={{ padding: "12px 24px", background: "#fff", color: "#061b0e", border: "1px solid #d4d3c9", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
          Export CSV (Route)
        </Link>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f2f1e8", borderBottom: "1px solid #efeee3" }}>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Name / Role</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Contact</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Ref. Code Used</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Joined</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const dateVal = (u.createdAt as any) instanceof Timestamp ? u.createdAt.toDate() : ((u.createdAt as any) instanceof Date ? u.createdAt : (typeof (u.createdAt as any) === 'string' ? new Date(u.createdAt) : new Date(u.createdAt)));
              const formattedDate = dateVal instanceof Date ? format(dateVal, "MMM d, yyyy") : format(new Date(), "MMM d, yyyy");

              return (
                <tr key={u.id} style={{ borderBottom: "1px solid #efeee3" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <p style={{ fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500, margin: 0 }}>{u.firstName} {u.lastName}</p>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: u.role === "admin" ? "#d93025" : "#50606f", background: u.role === "admin" ? "#fce8e6" : "#f2f1e8", padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block" }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <p style={{ fontSize: "0.875rem", color: "#50606f", margin: 0, marginBottom: 4 }}>{u.email}</p>
                    <p style={{ fontSize: "0.875rem", color: "#50606f", margin: 0 }}>{u.phone || "-"}</p>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500 }}>
                    {(u as any).appliedReferralCode ? (
                       <span style={{ fontFamily: "monospace", letterSpacing: "0.05em", background: "#f2f1e8", padding: "4px 8px", borderRadius: 4, fontSize: "0.875rem" }}>
                         {(u as any).appliedReferralCode}
                       </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#50606f" }}>
                    {formattedDate}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                     <button style={{ background: "none", border: "none", color: "#061b0e", cursor: "pointer", textDecoration: "underline", fontSize: "0.875rem" }}>
                      View Notes
                    </button>
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "32px 24px", textAlign: "center", color: "#50606f" }}>
                  No users found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
