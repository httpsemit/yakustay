import { getAllRooms } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage() {
  const rooms = await getAllRooms();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <div>
          <h1 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", marginBottom: 8 }}>
            Rooms
          </h1>
          <p style={{ color: "#50606f" }}>Manage hotel rooms and availability.</p>
        </div>
        <button style={{ padding: "12px 24px", background: "#061b0e", color: "#fff", borderRadius: 6, border: "none", fontSize: "0.875rem", fontWeight: 500, cursor: "not-allowed", opacity: 0.5 }}>
          + Add Room (Stubbed)
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f2f1e8", borderBottom: "1px solid #efeee3" }}>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Room Name</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Capacity</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Price / Night</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Status</th>
              <th style={{ padding: "16px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} style={{ borderBottom: "1px solid #efeee3" }}>
                <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#061b0e", fontWeight: 500 }}>{room.name}</td>
                <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#50606f" }}>{room.capacity} Guests</td>
                <td style={{ padding: "16px 24px", fontSize: "0.9375rem", color: "#50606f" }}>₹{room.pricePerNight.toLocaleString("en-IN")}</td>
                <td style={{ padding: "16px 24px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: room.isAvailable ? "#d1fae5" : "#fee2e2", color: room.isAvailable ? "#065f46" : "#991b1b", padding: "4px 10px", borderRadius: 9999 }}>
                    {room.isAvailable ? "Available" : "Hidden"}
                  </span>
                </td>
                <td style={{ padding: "16px 24px" }}>
                  <button style={{ background: "none", border: "none", color: "#061b0e", cursor: "pointer", textDecoration: "underline", fontSize: "0.875rem" }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "32px 24px", textAlign: "center", color: "#50606f" }}>
                  No rooms found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
