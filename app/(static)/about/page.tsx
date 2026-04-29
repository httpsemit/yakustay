import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Affordable Stay in Assam",
  description:
    "Learn about Chello Yaku Guest House, your tranquil mountain retreat in Kimin. Discover our heritage, local roots, and commitment to affordable hospitality in Assam.",
};

const TEAM = [
  {
    name: "Upendra Kumar Kushwaha",
    role: "Founder & Owner",
    img: "/images/navlogo.png",
    bio: "A native of the beautiful Papumpare region, Upendra founded Chello Yaku with a dream to showcase the warm hospitality and natural beauty of Arunachal Pradesh. His vision was to create a peaceful retreat where travelers could experience authentic local culture while enjoying modern comfort.",
  },
  {
    name: "Rahul Tosa (Maina)",
    role: "Operations Manager",
    img: "/images/footerlogo.png",
    bio: "Maina brings her exceptional organizational skills and warm personality to ensure every guest feels like family. She oversees daily operations with meticulous attention to detail and a genuine commitment to creating memorable stays.",
  },
];

const VALUES = [
  {
    icon: "landscape",
    title: "Himalayan Heritage",
    desc: "Nestled in the foothills of the Himalayas, Chello Yaku celebrates the natural beauty of Arunachal Pradesh. Every room offers stunning views of the mountains and valleys that make this region extraordinary.",
  },
  {
    icon: "home",
    title: "Local Roots",
    desc: "Over 90% of our team members are from the local community. We believe in providing opportunities to our neighbors and sharing the authentic culture of Papumpare with every guest.",
  },
  {
    icon: "spa",
    title: "Tranquil Comfort",
    desc: "Escape the noise and crowds. With only limited rooms available, we ensure each guest receives personalized attention and the peaceful environment needed for true relaxation.",
  },
  {
    icon: "eco",
    title: "Sustainable Practices",
    desc: "We're committed to preserving the natural beauty that surrounds us. From rainwater harvesting to supporting local artisans, every choice we make honors our environment and community.",
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
          src="/images/IMG20260128083601.jpg"
          alt="Chello Yaku Guest House building in Papumpare"
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
              Our Journey
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
              From vision to <em style={{ fontStyle: "italic" }}>reality.</em>
            </h2>
            <p style={{ fontSize: "1rem", color: "#434843", lineHeight: 1.8, marginBottom: 16, fontWeight: 300 }}>
              Chello Yaku Guest House began as a dream in 2019 - to create a sanctuary where travelers could experience the true essence of Himalayan hospitality. Located in the serene landscapes of Papumpare, we transformed this vision into a reality by combining traditional Arunachali warmth with modern comfort. Every corner of our guest house tells a story of dedication, love, and respect for both our guests and the natural beauty that surrounds us.
            </p>
            <p style={{ fontSize: "1rem", color: "#434843", lineHeight: 1.8, fontWeight: 300 }}>
              What started as a humble establishment has grown into a beloved retreat where guests return year after year. We've maintained our intimate scale because we believe hospitality should be personal, not commercial. Each stay with us is an invitation to experience the authentic rhythm of life in the Himalayas.
            </p>
          </div>
          <div style={{ borderRadius: "1rem", overflow: "hidden", aspectRatio: "4/3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/IMG20260128084845.jpg"
              alt="Chello Yaku Guest House building exterior"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "#efeee3", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
            What defines <em style={{ fontStyle: "italic" }}>Chello Yaku</em>
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
          Meet the <em style={{ fontStyle: "italic" }}>hearts behind Chello Yaku.</em>
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
