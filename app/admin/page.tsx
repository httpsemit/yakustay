import { getAllBookings, getAllRooms, getAllUsers } from "@/lib/firestore";
import Link from "next/link";
import { format, isWithinInterval, parseISO } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [bookings, rooms, users] = await Promise.all([
    getAllBookings(),
    getAllRooms(),
    getAllUsers(),
  ]);

  const totalRevenue = bookings
    .filter(b => b.status === "confirmed" || b.status === "pending")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const today = new Date();
  const checkedInBookings = bookings.filter(b => 
    (b.status === "confirmed" || b.status === "pending") &&
    isWithinInterval(today, { start: parseISO(b.checkIn), end: parseISO(b.checkOut) })
  );

  const occupancyRate = rooms.length > 0 
    ? Math.round((checkedInBookings.length / rooms.length) * 100) 
    : 0;

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ color: "#50606f", marginBottom: 48 }}>Overview of hotel performance and activities.</p>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Total Revenue</p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", color: "#061b0e" }}>₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Occupancy Rate</p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", color: "#061b0e" }}>{occupancyRate}%</p>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Total Bookings</p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", color: "#061b0e" }}>{bookings.length}</p>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Registered Guests</p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", color: "#061b0e" }}>{users.filter(u => u.role === "guest").length}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 24 }}>
        Recent Bookings
      </h2>
      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.02)", overflow: "hidden", marginBottom: 48 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f5f4e8", borderBottom: "1px solid #efeee3" }}>
            <tr>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Guest Name</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Room Name</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Dates</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Status</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => {
              const room = rooms.find((r) => r.id === b.roomId);
              return (
                <tr key={b.id} style={{ borderBottom: "1px solid #efeee3" }}>
                  <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500 }}>{b.guestName}</td>
                  <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#50606f" }}>{room?.name ?? "Unknown Room"}</td>
                  <td style={{ padding: "16px 24px", fontSize: "0.875rem", color: "#50606f" }}>
                    {format(parseISO(b.checkIn), "MMM d")} - {format(parseISO(b.checkOut), "MMM d, yyyy")}
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      background: b.status === "confirmed" ? "#d0e9d4" : b.status === "pending" ? "#fcefc7" : "#ffdad6",
                      color: b.status === "confirmed" ? "#1b3022" : b.status === "pending" ? "#4a3c00" : "#ba1a1a",
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500 }}>₹{b.totalPrice.toLocaleString("en-IN")}</td>
                </tr>
              );
            })}
            {recentBookings.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "#50606f", fontSize: "0.9375rem" }}>
                  No recent bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 24 }}>
        Quick Actions
      </h2>
      <div style={{ display: "flex", gap: 16 }}>
        <Link href="/admin/bookings" style={{ padding: "12px 24px", background: "#061b0e", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
          Manage Bookings
        </Link>
        <Link href="/admin/rooms" style={{ padding: "12px 24px", background: "#fff", color: "#061b0e", border: "1px solid #d4d3c9", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
          Manage Rooms
        </Link>
        <Link href="/admin/guests" style={{ padding: "12px 24px", background: "#fff", color: "#061b0e", border: "1px solid #d4d3c9", borderRadius: 6, textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
          View Guests
        </Link>
      </div>
    </div>
  );
}
