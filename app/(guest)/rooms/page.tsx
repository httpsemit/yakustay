import { getRooms, MOCK_ROOMS, type Room } from "@/lib/firestore";
import Link         from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Browse our luxury rooms and suites at Grand Haven Hotel. From Executive to Presidential, find your perfect mountain retreat.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms();
  } catch {
    // Firestore not configured yet
  }

  // Fallback to mock data if no rooms are returned or DB fails
  if (rooms.length === 0) {
    rooms = MOCK_ROOMS;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#50606f", marginBottom: 10,
          }}
        >
          Grand Haven Hotel
        </p>
        <h1
          style={{
            fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300,
            letterSpacing: "-0.01em", color: "#061b0e", marginBottom: 8, lineHeight: 1.1,
          }}
        >
          Our Rooms &<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>Suites.</em>
        </h1>
        <p style={{ fontSize: "1rem", fontWeight: 300, color: "#50606f", marginBottom: 48, maxWidth: 480 }}>
          Five distinct retreats — each with its own character, all with the same unhurried quiet.
        </p>

        {rooms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "1rem", color: "#50606f" }}>
              Rooms are being prepared. Please check back shortly.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {rooms.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="hover:shadow-[0_8px_32px_rgba(27,48,34,0.15)] transition-shadow duration-200 cursor-pointer"
                  style={{
                    background: "#efeee3", borderRadius: "0.75rem", overflow: "hidden",
                  }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={room.primaryImage} alt={room.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,27,14,0.5) 0%, transparent 50%)" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", background: "rgba(6,27,14,0.4)", borderRadius: "9999px", padding: "3px 10px" }}>
                        Up to {room.capacity} guests
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "20px 20px 24px" }}>
                    <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.15rem", fontWeight: 400, color: "#061b0e", marginBottom: 6 }}>{room.name}</p>
                    <p style={{ fontSize: "0.8125rem", fontWeight: 300, color: "#50606f", marginBottom: 16, lineHeight: 1.5 }}>
                      {room.description.slice(0, 90)}…
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f" }}>From</p>
                        <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", fontWeight: 300, color: "#061b0e" }}>
                          ₹{room.pricePerNight.toLocaleString("en-IN")}<span style={{ fontSize: "0.75rem", color: "#737973", fontFamily: "Inter, sans-serif" }}> /night</span>
                        </p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#061b0e" }}>View →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
