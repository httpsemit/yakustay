import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingsForGuest, getRoomById } from "@/lib/firestore";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string };
}) {
  const token = cookies().get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const bookings = await getBookingsForGuest(decoded.uid);
  
  // Enrich with room details
  const enrichedBookings = await Promise.all(
    bookings.map(async (b) => {
      const room = await getRoomById(b.roomId);
      return { ...b, roomName: room?.name || "Unknown Room" };
    })
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 12 }}>
          Guest Dashboard
        </p>
        <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 48 }}>
          My Bookings
        </h1>

        {searchParams.success === "cancelled" && (
          <div style={{ background: "#d1fae5", color: "#065f46", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "0.875rem", fontWeight: 500 }}>
            Your booking has been successfully cancelled. A refund has been automatically initiated if applicable.
          </div>
        )}
        
        {searchParams.error && (
          <div style={{ background: "#fee2e2", color: "#991b1b", padding: "16px", borderRadius: "8px", marginBottom: "24px", fontSize: "0.875rem", fontWeight: 500 }}>
            An error occurred while attempting to cancel your booking: {searchParams.error}
          </div>
        )}

        {enrichedBookings.length === 0 ? (
          <div style={{ background: "#fff", padding: 48, borderRadius: 12, textAlign: "center", boxShadow: "0 8px 32px rgba(27,48,34,0.05)" }}>
            <p style={{ color: "#50606f", marginBottom: 24 }}>You have no bookings yet.</p>
            <Link href="/rooms" style={{ padding: "12px 24px", background: "#061b0e", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {enrichedBookings.map((b) => (
              <div key={b.id} style={{ background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 8px 32px rgba(27,48,34,0.05)", display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", color: "#061b0e", margin: 0 }}>
                      {b.roomName}
                    </h3>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#50606f", background: "#f5f4e8", padding: "2px 8px", borderRadius: 4, letterSpacing: "0.05em" }}>
                      #{b.id.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#50606f", marginBottom: 16, marginTop: 4 }}>
                    {format(new Date(b.checkIn), "MMM d, yyyy")} – {format(new Date(b.checkOut), "MMM d, yyyy")} ({b.nights} {b.nights === 1 ? 'night' : 'nights'})
                  </p>
                  
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: b.status === "confirmed" ? "#d1fae5" : b.status === "cancelled" ? "#fee2e2" : "#fef3c7", color: b.status === "confirmed" ? "#065f46" : b.status === "cancelled" ? "#991b1b" : "#92400e", padding: "4px 10px", borderRadius: 9999 }}>
                      {b.status}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", color: "#50606f", padding: "4px 0" }}>
                      ₹{b.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {b.status === "pending" || b.status === "confirmed" ? (
                  <form action={`/api/payments/refund`} method="POST">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button type="submit" style={{ padding: "10px 16px", background: "transparent", color: "#d93025", border: "1px solid #fce8e6", borderRadius: 6, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", transition: "background 0.2s" }}>
                      Cancel Booking
                    </button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <Link href="/account" style={{ color: "#061b0e", fontWeight: 500, textDecoration: "none", fontSize: "0.875rem" }}>
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
