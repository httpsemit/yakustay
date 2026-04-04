"use client";

export default function MaintenanceStrip() {
  return (
    <div
      style={{
        background: "#ff6b35",
        color: "#ffffff",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "0.875rem",
        fontWeight: 500,
        letterSpacing: "0.025em",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
    >
      🚧 <strong>Site Under Maintenance:</strong> We're improving your experience. For bookings, contact us on WhatsApp: <a href="https://wa.me/919678267281" target="_blank" rel="noopener noreferrer" style={{ color: "#ffffff", textDecoration: "underline", fontWeight: 600 }}>+91 96782 67281</a>
    </div>
  );
}
