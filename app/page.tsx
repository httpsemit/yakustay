import Link from "next/link";
import { getRooms, type Room } from "@/lib/firestore";
import RoomCard from "@/components/rooms/RoomCard";
import AvailabilityWidget from "@/components/home/AvailabilityWidget";
import Testimonials from "@/components/home/Testimonials";

// Loyalty tier data
const tiers = [
  {
    name: "Silver",
    points: "0 – 4,999 pts",
    bg: "#efeee3",
    accent: "#b4cdb8",
    perks: ["10% off dining", "Late checkout (subject to availability)", "Welcome amenity"],
  },
  {
    name: "Gold",
    points: "5,000 – 14,999 pts",
    bg: "#e9e9dd",
    accent: "#d0e9d4",
    perks: ["15% off dining & spa", "Free room upgrade (subject to availability)", "Priority booking", "Airport transfer"],
  },
  {
    name: "Platinum",
    points: "15,000+ pts",
    bg: "#1b3022",
    accent: "#d0e9d4",
    color: "#d0e9d4",
    perks: ["20% off all services", "Guaranteed room upgrade", "Personal butler", "Complimentary breakfast", "Exclusive experiences"],
  },
];

export default async function Home() {
  let rooms: Room[] = [];
  try {
    rooms = await getRooms();
  } catch {
    // Firestore not configured yet — use empty array
  }

  return (
    <div style={{ background: "#fbfaee" }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 640,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Chello Yaku Guest House mountain view"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(6,27,14,0.85) 0%, rgba(6,27,14,0.2) 60%, transparent 100%)",
          }}
        />

        {/* Hero content */}
        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            padding: "0 32px 80px",
          }}
        >
          {/* Chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {[
              { label: "Mountain Retreat", bg: "#d0e9d4", color: "#0b2013" },
              { label: "Free Tea · Online Booking", bg: "#d4e4f6", color: "#0d1d2a" },
              { label: "Curated Experiences", bg: "#ffdcc4", color: "#2f1501" },
            ].map(({ label, bg, color }) => (
              <span
                key={label}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color,
                  background: bg,
                  borderRadius: "9999px",
                  padding: "4px 12px",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.0,
              color: "#ffffff",
              marginBottom: 32,
              maxWidth: 700,
            }}
          >
            Where the mountains<br />
            <em style={{ fontStyle: "italic", fontWeight: 300, opacity: 0.9 }}>
              meet Kimin&apos;s mist.
            </em>
          </h1>

          {/* Availability search widget (nightly + hourly) */}
          <AvailabilityWidget />
        </div>
      </section>

      {/* ── STATS ROW ─────────────────────────────────────────────── */}
      <section style={{ background: "#f5f4e8", padding: "48px 32px" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {[
            { value: "100+", label: "Satisfied Customers" },
            { value: "4.9★", label: "Guest Rating" },
            { value: "₹999", label: "Rooms From / Night" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Noto Serif', serif",
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: "#061b0e",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURES ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
          The Grand Haven Experience
        </p>
        <h2
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "2.5rem",
            fontWeight: 300,
            color: "#061b0e",
            marginBottom: 40,
            lineHeight: 1.1,
          }}
        >
          Crafted for <em style={{ fontStyle: "italic" }}>those who seek.</em>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "auto auto",
            gap: 16,
          }}
        >
          {/* Large feature */}
          <div
            style={{
              gridRow: "1 / 3",
              background: "#1b3022",
              borderRadius: "1rem",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: 340,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b4cdb8", marginBottom: 8 }}>
                Landscape
              </p>
              <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#ffffff", lineHeight: 1.3 }}>
                Panoramic mountain views from every room
              </p>
            </div>
          </div>

          {/* Small features */}
          {[
            { title: "Free Tea", desc: "Complimentary tea on every online booking.*", bg: "#efeee3" },
            { title: "Serene Silence", desc: "A noise-free retreat — our property is a designated quiet zone for complete peace of mind.", bg: "#dde8e0" },
          ].map(({ title, desc, bg }) => (
            <div key={title} style={{ background: bg, borderRadius: "1rem", padding: 28 }}>
              <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.15rem", fontWeight: 400, color: "#061b0e", marginBottom: 6 }}>{title}</p>
              <p style={{ fontSize: "0.875rem", color: "#50606f", fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HERITAGE SCROLLER ─────────────────────────────────────── */}
      {rooms.length > 0 && (
        <section style={{ paddingBottom: 80 }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.75rem", fontWeight: 300, color: "#061b0e" }}>
              Our Rooms
            </h2>
            <Link href="/rooms" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div
            className="scroller"
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              paddingLeft: "calc((100vw - 1280px) / 2 + 32px)",
              paddingRight: 32,
              paddingBottom: 8,
            }}
          >
            {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <Testimonials />

      {/* ── LOYALTY TIERS ─────────────────────────────────────────── */}
      <section style={{ background: "#efeee3", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
            Chello Yaku Rewards
          </p>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 300, color: "#061b0e", marginBottom: 40, lineHeight: 1.1 }}>
            Every stay<em style={{ fontStyle: "italic" }}> earns you more.</em>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {tiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  background: tier.bg,
                  borderRadius: "1rem",
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: tier.accent,
                    marginBottom: 4,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: tier.color ?? "#061b0e",
                  }}
                >
                  {tier.name}
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: tier.color ? "rgba(208,233,212,0.7)" : "#50606f" }}>
                  {tier.points}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  {tier.perks.map((perk) => (
                    <li key={perk} style={{ fontSize: "0.8125rem", color: tier.color ? "rgba(208,233,212,0.85)" : "#434843", fontWeight: 300 }}>
                      — {perk}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────── */}
      <section style={{ padding: "96px 32px", background: "#fbfaee" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 12 }}>
              The Chello Yaku Promise
            </p>
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, color: "#061b0e", lineHeight: 1.1 }}>
              Why Choose <em style={{ fontStyle: "italic", color: "#1b3022" }}>Chello Yaku?</em>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 32,
            }}
          >
            {[
              {
                icon: "forest",
                title: "Immersive Nature",
                desc: "Wake up to misty mountains and lush valleys, far removed from the clamour of the city.",
              },
              {
                icon: "restaurant",
                title: "Farm-to-Table",
                desc: "Savour fresh, seasonal meals prepared with ingredients sourced from our own organic gardens.",
              },
              {
                icon: "self_improvement",
                title: "Absolute Serenity",
                desc: "A designated quiet zone designed to help you disconnect, reflect, and find your inner peace.",
              },
              {
                icon: "room_service",
                title: "Personalised Care",
                desc: "Experience warm, intuitive service that anticipates your needs without intruding on your privacy.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "#ffffff",
                  padding: 32,
                  borderRadius: "1rem",
                  boxShadow: "0 4px 24px rgba(27,48,34,0.04)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "transform 0.3s ease",
                }}
                className="hover:-translate-y-2"
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#efeee3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#1b3022", fontSize: 24 }}>
                    {icon}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", fontWeight: 400, color: "#061b0e", marginBottom: 12 }}>
                  {title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#50606f", fontWeight: 300, lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
