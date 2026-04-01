import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Chello Yaku Guest House",
  description:
    "Learn the story behind Chello Yaku Guest House in Kimin — a welcoming retreat built on hospitality and the beauty of Arunachal Pradesh.",
};

const TEAM = [
  {
    name: "Upendra Kumar Kushwaha",
    role: "Owner",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Born and raised in the region, Upendra envisioned Chello Yaku as a place where travelers could experience genuine warmth and comfort amidst the beauty of Kimin.",
  },
  {
    name: "Rahul Tosa (Maina)",
    role: "Manager",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    bio: "Maina ensures every guest feels at home, managing daily operations with personal attention to detail and a commitment to exceptional service.",
  },
];

const VALUES = [
  {
    icon: "landscape",
    title: "Nature First",
    desc: "Every design decision is made with the landscape in mind. We exist in nature, not on top of it.",
  },
  {
    icon: "volunteer_activism",
    title: "Community Rooted",
    desc: "Over 80% of our team are local hires. We invest directly in the communities that make this place special.",
  },
  {
    icon: "spa",
    title: "Quiet Luxury",
    desc: "No crowds, no noise. We limit our capacity deliberately so every guest feels truly seen.",
  },
  {
    icon: "eco",
    title: "Sustainability",
    desc: "Solar-powered, rainwater-harvested, and zero single-use plastic. We built it right from the start.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#fbfaee", minHeight: "100vh" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: 440,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Chello Yaku Guest House misty mountains"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(6,27,14,0.9) 0%, rgba(6,27,14,0.25) 60%, transparent 100%)",
          }}
        />
        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            padding: "0 32px 64px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b4cdb8", marginBottom: 12 }}>
            Our story
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2rem, 5vw, 3.75rem)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: 680,
              margin: 0,
            }}
          >
            Built where the plains{" "}
            <em style={{ fontStyle: "italic" }}>meet the peaks.</em>
          </h1>
        </div>
      </section>

      {/* ── ORIGIN STORY ──────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px" }}>
        <div
          className="about-story-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
              Est. 2019
            </p>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "2.25rem",
                fontWeight: 300,
                color: "#061b0e",
                lineHeight: 1.15,
                marginBottom: 24,
              }}
            >
              A labour of <em style={{ fontStyle: "italic" }}>love in the foothills.</em>
            </h2>
            <p style={{ fontSize: "1rem", color: "#434843", lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
              Chello Yaku Guest House was born from a simple vision: to provide a warm, welcoming home for travelers visiting the beautiful Kimin region. Located near the petrol pump in the heart of Kimin, our guest house offers comfortable accommodations with genuine hospitality.
            </p>
            <p style={{ fontSize: "1rem", color: "#434843", lineHeight: 1.8, fontWeight: 300 }}>
              We started with comfortable rooms designed to make every guest feel at home. Today, that vision continues to guide everything we do. Every aspect of Chello Yaku is managed with personal care, ensuring visitors experience the warmth and beauty of our region.
            </p>
          </div>
          <div style={{ borderRadius: "1rem", overflow: "hidden", aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
              alt="Chello Yaku Guest House building"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "#efeee3", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
            What drives us
          </p>
          <h2
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "2rem",
              fontWeight: 300,
              color: "#061b0e",
              marginBottom: 48,
              lineHeight: 1.2,
            }}
          >
            Our <em style={{ fontStyle: "italic" }}>guiding principles.</em>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {VALUES.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "#ffffff",
                  borderRadius: "1rem",
                  padding: 32,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#d0e9d4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: "#061b0e" }}>
                    {icon}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.125rem",
                    fontWeight: 400,
                    color: "#061b0e",
                    marginBottom: 8,
                  }}
                >
                  {title}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#50606f", lineHeight: 1.7, fontWeight: 300 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
          The people
        </p>
        <h2
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "2rem",
            fontWeight: 300,
            color: "#061b0e",
            marginBottom: 48,
          }}
        >
          Meet the <em style={{ fontStyle: "italic" }}>team behind the magic.</em>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {TEAM.map(({ name, role, img, bio }) => (
            <div
              key={name}
              style={{
                background: "#ffffff",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(27,48,34,0.06)",
              }}
            >
              <div style={{ height: 260, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
              </div>
              <div style={{ padding: 28 }}>
                <p
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.125rem",
                    fontWeight: 400,
                    color: "#061b0e",
                    marginBottom: 4,
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#50606f",
                    marginBottom: 12,
                  }}
                >
                  {role}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#434843", lineHeight: 1.7, fontWeight: 300 }}>
                  {bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
