"use client";

const testimonials = [
  { name: "Ravi M.",      location: "Mumbai",    rating: 5, text: "Absolutely magical stay. The silence and mountain air are unlike anything I've experienced." },
  { name: "Priya S.",     location: "Bangalore", rating: 5, text: "The free tea on arrival was a lovely touch. Will definitely be coming back!" },
  { name: "Arjun K.",     location: "Delhi",     rating: 5, text: "Booked online and the process was seamless. The room was cozy and the views were breathtaking." },
  { name: "Sneha R.",     location: "Pune",      rating: 5, text: "A true hidden gem. Peaceful, clean, and the staff were incredibly warm and welcoming." },
  { name: "Vikram T.",    location: "Chennai",   rating: 5, text: "The quiet zone policy is brilliant. It felt like a digital detox and we loved every minute." },
  { name: "Anjali P.",    location: "Hyderabad", rating: 5, text: "Such an affordable luxury. ₹999 starting price and the quality was outstanding." },
  { name: "Rohan D.",     location: "Kolkata",   rating: 5, text: "Stunning mountain views, comfortable beds, and zero noise. Perfect for a weekend getaway." },
  { name: "Meera V.",     location: "Jaipur",    rating: 5, text: "I've stayed at many hotels but Grand Haven has a charm that's hard to put into words." },
];

// Split into two rows for alternating directions
const row1 = testimonials.slice(0, 4);
const row2 = testimonials.slice(4);

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#b8860b", fontSize: 13 }}>★</span>
      ))}
    </div>
  );
}

function Card({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      style={{
        background:    "#ffffff",
        borderRadius:  "1rem",
        padding:       "24px 28px",
        minWidth:      280,
        maxWidth:      280,
        boxShadow:     "0 2px 16px rgba(27,48,34,0.07)",
        flexShrink:    0,
        border:        "1px solid #efeee3",
      }}
    >
      <StarRating count={t.rating} />
      <p style={{ fontSize: "0.875rem", color: "#1b1c15", fontWeight: 300, lineHeight: 1.6, marginBottom: 16 }}>
        "{t.text}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width:        36,
            height:       36,
            borderRadius: "50%",
            background:   "linear-gradient(135deg, #1b3022, #4a7c59)",
            display:      "flex",
            alignItems:   "center",
            justifyContent: "center",
            color:        "#d0e9d4",
            fontSize:     13,
            fontWeight:   700,
          }}
        >
          {t.name[0]}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#061b0e" }}>{t.name}</p>
          <p style={{ fontSize: 11, color: "#50606f" }}>{t.location}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction }: { items: typeof testimonials; direction: "left" | "right" }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display:   "flex",
          gap:       20,
          width:     "max-content",
          animation: `marquee-${direction} 30s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: "80px 0", background: "#fbfaee", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-row:hover > div {
          animation-play-state: paused;
        }
      `}} />

      {/* Header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", marginBottom: 40 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
          Guest Stories
        </p>
        <h2
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize:   "2rem",
            fontWeight: 300,
            color:      "#061b0e",
            lineHeight: 1.1,
          }}
        >
          What our guests <em style={{ fontStyle: "italic" }}>say about us.</em>
        </h2>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="marquee-row" style={{ marginBottom: 20 }}>
        <MarqueeRow items={row1} direction="left" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-row">
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
}
