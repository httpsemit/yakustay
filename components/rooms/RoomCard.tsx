import Link from "next/link";
import type { Room } from "@/lib/firestore";

interface Props { room: Room; }

export default function RoomCard({ room }: Props) {
  return (
    <Link
      href={`/rooms/${room.id}`}
      style={{ textDecoration: "none", display: "block", flexShrink: 0, width: 280 }}
    >
      <div
        style={{
          width: 280,
          borderRadius: "0.75rem",
          overflow: "hidden",
          background: "#efeee3",
          cursor: "pointer",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(27,48,34,0.18)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", width: 280, height: 340, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={room.primaryImage}
            alt={room.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(6,27,14,0.7) 0%, transparent 55%)",
            }}
          />
          {/* Price badge */}
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14,
              right: 14,
            }}
          >
            <p
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "1.1rem",
                fontWeight: 300,
                color: "#ffffff",
                marginBottom: 2,
              }}
            >
              {room.name}
            </p>
            <p
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              ₹{room.pricePerNight.toLocaleString("en-IN")} / night
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#50606f",
              background: "#d4e4f6",
              borderRadius: "9999px",
              padding: "3px 10px",
            }}
          >
            Up to {room.capacity} guests
          </span>
          {room.amenities.slice(0, 2).map((a) => (
            <span
              key={a}
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#434843",
                background: "#e4e3d7",
                borderRadius: "9999px",
                padding: "3px 10px",
              }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
