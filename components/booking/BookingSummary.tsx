interface Props {
  roomName:      string;
  checkIn:       string;
  checkOut:      string;
  nights:        number;
  pricePerNight: number;
}

const TAX_RATE = 0.12; // 12% GST

export default function BookingSummary({ roomName, checkIn, checkOut, nights, pricePerNight }: Props) {
  const subtotal = pricePerNight * nights;
  const tax      = Math.round(subtotal * TAX_RATE);
  const total    = subtotal + tax;

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div
      style={{
        background: "#f5f4e8",
        borderRadius: "0.75rem",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <p
        style={{
          fontSize: "0.625rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#50606f",
        }}
      >
        Booking Summary
      </p>

      <p
        style={{
          fontFamily: "'Noto Serif', serif",
          fontSize: "1.15rem",
          fontWeight: 400,
          color: "#061b0e",
          lineHeight: 1.3,
        }}
      >
        {roomName}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Row label="Check-in"  value={fmt(checkIn)}  />
        <Row label="Check-out" value={fmt(checkOut)} />
        <Row label="Duration"  value={`${nights} night${nights !== 1 ? "s" : ""}`} />
      </div>

      <div style={{ height: 1, background: "rgba(195,200,193,0.3)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Row label={`₹${pricePerNight.toLocaleString("en-IN")} × ${nights} nights`} value={`₹${subtotal.toLocaleString("en-IN")}`} />
        <Row label="GST (12%)" value={`₹${tax.toLocaleString("en-IN")}`} muted />
      </div>

      <div style={{ height: 1, background: "rgba(195,200,193,0.3)" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span
          style={{
            fontSize: "0.625rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#50606f",
          }}
        >
          Total
        </span>
        <span
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "1.5rem",
            fontWeight: 300,
            color: "#061b0e",
          }}
        >
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "0.8125rem", color: muted ? "#737973" : "#50606f" }}>{label}</span>
      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: muted ? "#737973" : "#1b1c15" }}>{value}</span>
    </div>
  );
}
