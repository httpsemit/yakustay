import { getRooms, getRoomsByTypeId, MOCK_ROOMS, getBookedDates, type Room } from "@/lib/firestore";
import { groupRoomsByTypeId } from "@/lib/roomUtils";
import { notFound } from "next/navigation";
import AmenityChip from "@/components/rooms/AmenityChip";
import RoomBookingPanel from "./RoomBookingPanel";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

// ── Resolve the room group from the URL slug ───────────────────────────────
// The [id] slug is the roomTypeId (e.g. "deluxe-room") for grouped pages,
// or a legacy room id (e.g. "mock-1" / Firestore doc id) for single rooms.
async function resolveGroup(slug: string) {
  // 1. Try to find rooms by roomTypeId first
  let typeRooms = await getRoomsByTypeId(slug).catch(() => []);

  // 2. If not found, fall back: maybe the slug is a direct room id
  if (typeRooms.length === 0) {
    let singleRoom: Room | null = null;
    try {
      const { getRoomById } = await import("@/lib/firestore");
      singleRoom = await getRoomById(slug);
    } catch { /* ignore */ }

    if (!singleRoom) {
      // Last resort: MOCK_ROOMS
      singleRoom = MOCK_ROOMS.find((r) => r.id === slug || r.roomTypeId === slug) ?? null;
    }
    if (!singleRoom) return null;
    typeRooms = [singleRoom];
  }

  const groups = groupRoomsByTypeId(typeRooms);
  return groups[0] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const group = await resolveGroup(id);
  if (!group) return { title: "Room Not Found" };

  const room = group.details;
  return {
    title: `${room.name} | Budget Room near North Lakhimpur`,
    description: `${room.description.substring(0, 140)} Book now at Chello Yaku Guest House, Kimin, Assam.`,
    openGraph: {
      images: [room.primaryImage],
    },
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params;
  const group = await resolveGroup(id);
  if (!group) return notFound();

  const room      = group.details;
  const typeId    = group.roomTypeId;
  const available = group.count; // number of rooms free (before date filter)

  // Booked dates for the representative room only — used to block the calendar.
  // For multi-room groups, the calendar will warn if ALL rooms are taken on a date
  // (full implementation would aggregate; for now this is a safe conservative proxy).
  let bookedDates: string[] = [];
  try {
    bookedDates = await getBookedDates(room.id);
  } catch { /* Firestore not configured */ }

  return (
    <div style={{ background: "#fbfaee", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            name: room.name,
            description: room.description,
            image: room.primaryImage,
            occupancy: {
              "@type": "QuantitativeValue",
              value: room.capacity
            },
            offers: {
              "@type": "Offer",
              price: room.pricePerNight,
              priceCurrency: "INR"
            }
          })
        }}
      />
      <style>{`
        .room-detail-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 32px 80px;
        }
        .room-hero {
          position: relative;
          height: 40vh;
          min-height: 280px;
          max-height: 450px;
          overflow: hidden;
          border-radius: 0.75rem;
          box-shadow: 0 4px 20px rgba(27, 48, 34, 0.1);
        }
        .room-booking-panel {
          position: sticky;
          top: 88px;
        }
        @media (max-width: 768px) {
          .room-detail-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 28px 18px 64px;
          }
          .room-hero {
            height: 30vw;
            min-height: 180px;
            max-height: 300px;
            border-radius: 0.75rem;
          }
          .room-booking-panel {
            position: static;
          }
          .room-title {
            font-size: 1.75rem !important;
          }
          .room-price {
            font-size: 1.5rem !important;
          }
        }
      `}</style>

      {/* Hero image */}
      <div className="room-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={room.primaryImage} alt={room.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Content */}
      <div className="room-detail-grid">
        {/* Left — room info */}
        <div>
          {/* Chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <AmenityChip label={`Up to ${room.capacity} guests`} variant="info"    />
            <AmenityChip label="Mountain View"                   variant="success" />
            <AmenityChip label="Boutique"                        variant="warm"    />
            {available > 1 && (
              <AmenityChip label={`${available} rooms available`} variant="success" />
            )}
          </div>

          <h1
            className="room-title"
            style={{
              fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300,
              letterSpacing: "-0.01em", color: "#061b0e", marginBottom: 8, lineHeight: 1.1,
            }}
          >
            {room.name}
          </h1>

          {/* Price */}
          <p style={{ marginBottom: 24 }}>
            <span className="room-price" style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 300, color: "#061b0e" }}>
              ₹{room.pricePerNight.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginLeft: 6 }}>
              / night · per room
            </span>
          </p>

          <p style={{ fontSize: "1rem", fontWeight: 300, color: "#50606f", lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
            {room.description}
          </p>

          {/* Amenities */}
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
            Room Amenities
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {room.amenities?.map((a: string) => (
              <li key={a} style={{ fontSize: "0.9375rem", color: "#434843", fontWeight: 300, lineHeight: 1.4 }}>
                — {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — booking panel */}
        <div className="room-booking-panel">
          <RoomBookingPanel
            room={room}
            roomTypeId={typeId}
            availableCount={available}
            bookedDates={bookedDates}
          />
        </div>
      </div>
    </div>
  );
}
