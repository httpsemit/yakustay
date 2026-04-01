"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

type Status = "pending" | "confirmed" | "cancelled";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: Status;
}

const STATUS_STYLES: Record<Status, { bg: string; color: string }> = {
  pending:   { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#d1fae5", color: "#065f46" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function AdminBookingsClient() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("all");

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function handleStatusChange(bookingId: string, newStatus: Status) {
    if (!user) return;
    setUpdating(bookingId);
    try {
      const token = await user.getIdToken();
      await fetch("/api/admin/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: newStatus } : b));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
            Bookings
          </h1>
          <p style={{ color: "#50606f" }}>View and manage all guest reservations.</p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                background: filter === s ? "#061b0e" : "#f5f4e8",
                color: filter === s ? "#fff" : "#50606f",
                border: "none", borderRadius: "0.5rem", padding: "8px 16px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "capitalize", cursor: "pointer",
              }}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        {loading ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "#50606f" }}>Loading bookings…</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f2f1e8", borderBottom: "1px solid #efeee3" }}>
                {["Guest / Email", "Room", "Dates", "Total", "Status", "Change Status"].map((h) => (
                  <th key={h} style={{ padding: "16px 20px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #efeee3" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500, margin: 0 }}>{b.guestName}</p>
                    <p style={{ fontSize: "0.8125rem", color: "#50606f", margin: 0 }}>{b.guestEmail}</p>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "0.875rem", color: "#50606f" }}>{b.roomName}</td>
                  <td style={{ padding: "16px 20px", fontSize: "0.875rem", color: "#50606f", whiteSpace: "nowrap" }}>
                    {format(new Date(b.checkIn), "MMM d")} – {format(new Date(b.checkOut), "MMM d")}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "0.875rem", color: "#061b0e", fontWeight: 500, whiteSpace: "nowrap" }}>
                    ₹{b.totalPrice.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                      ...STATUS_STYLES[b.status], padding: "4px 10px", borderRadius: 9999,
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <select
                      value={b.status}
                      disabled={updating === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as Status)}
                      style={{
                        background: "#f5f4e8", border: "none", borderRadius: "0.5rem",
                        padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#061b0e",
                        cursor: updating === b.id ? "wait" : "pointer", outline: "none",
                        opacity: updating === b.id ? 0.5 : 1,
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: "48px 24px", textAlign: "center", color: "#50606f" }}>
                    No {filter === "all" ? "" : filter} bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
