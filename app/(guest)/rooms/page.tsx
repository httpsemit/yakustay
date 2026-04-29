import { getRooms, MOCK_ROOMS, type Room } from "@/lib/firestore";
import { groupRoomsByTypeId, availabilityLabel } from "@/lib/roomUtils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affordable Rooms & Suites | Guest House in Kimin",
  description: "Browse budget-friendly rooms at Chello Yaku Guest House. Enjoy an affordable stay in Assam with modern amenities, just a short drive from North Lakhimpur.",
};

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms();
  } catch {
    // Firestore not configured yet
  }

  if (rooms.length === 0) rooms = MOCK_ROOMS;

  const groups = groupRoomsByTypeId(rooms);

  return (
    <div style={{ minHeight: "100vh", background: "#fbfaee", padding: "64px 32px" }}>
      <style>{`
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (min-width: 768px) {
          .rooms-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .rooms-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            max-width: 1200px;
            margin: 0 auto;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#50606f", marginBottom: 10,
          }}
        >
          Chello Yaku Hotel
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
          {groups.length} distinct retreat{groups.length !== 1 ? "s" : ""} — each with its own character, all with the same unhurried quiet.
        </p>

        {groups.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "1rem", color: "#50606f" }}>
              Rooms are being prepared. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="rooms-grid">
            {groups.map((group) => {
              const { details: room, count, roomTypeId } = group;
              const soldOut = count === 0;
              return (
                <Link
                  key={roomTypeId}
                  href={`/rooms/${roomTypeId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="hover:shadow-[0_8px_32px_rgba(27,48,34,0.15)] transition-shadow duration-200 cursor-pointer"
                    style={{
                      background: "#efeee3", borderRadius: "0.75rem", overflow: "hidden",
                      opacity: soldOut ? 0.6 : 1,
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={room.primaryImage} alt={room.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,27,14,0.5) 0%, transparent 50%)" }} />
                      {/* Availability badge */}
                      <div style={{ position: "absolute", top: 12, right: 12 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#ffffff",
                          background: soldOut ? "rgba(200,50,50,0.85)" : "rgba(27,48,34,0.75)",
                          borderRadius: "9999px", padding: "4px 10px",
                          backdropFilter: "blur(4px)",
                        }}>
                          {availabilityLabel(count)}
                        </span>
                      </div>
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
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: soldOut ? "#737973" : "#061b0e" }}>
                          {soldOut ? "Sold Out" : "View →"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
