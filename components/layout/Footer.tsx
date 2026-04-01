import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#dbdbcf" }}>
      {/* ── GLOBAL CTA ──────────────────────────────────────────────── */}
      <div style={{ background: "#1b3022", padding: "80px 32px", textAlign: "center", color: "#ffffff" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d0e9d4", opacity: 0.8, marginBottom: 16 }}>
            Ready for a Pause?
          </p>
          <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
            Book your escape <em style={{ fontStyle: "italic", color: "#d0e9d4" }}>today.</em>
          </h2>
          <p style={{ fontSize: "0.9375rem", fontWeight: 300, color: "rgba(255,255,255,0.7)", marginBottom: 40, lineHeight: 1.6 }}>
            Experience the harmony of nature and warm hospitality at Chello Yaku Guest House. Reconnect with yourself, starting now.
          </p>
          <Link
            href="/rooms"
            style={{
              display: "inline-block",
              background: "#fbfaee",
              color: "#061b0e",
              padding: "16px 32px",
              borderRadius: "9999px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "transform 0.2s ease, opacity 0.2s ease",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
            className="hover:-translate-y-1 hover:shadow-lg"
          >
            Check Availability
          </Link>
        </div>
      </div>

      <div
        className="footer-grid section-pad"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 32px 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 32,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Noto Serif', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "1.2rem",
              color: "#061b0e",
              marginBottom: 8,
            }}
          >
            Grand Haven
          </p>
          <p style={{ fontSize: "0.875rem", color: "#50606f", lineHeight: 1.6, marginBottom: 16 }}>
            A boutique retreat on the<br />Assam-Arunachal border.
          </p>
          <p style={{ fontSize: "0.875rem", color: "#50606f", lineHeight: 1.6 }}>
            <strong>Location:</strong><br />
            Chello Yaku Guest House<br />
            NH-415, Banderdewa,<br />
            Assam-Arunachal Border, 791123, India
          </p>
        </div>

        <div>
          <p
            style={{
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#50606f",
              marginBottom: 16,
            }}
          >
            Explore
          </p>
          {[
            { href: "/rooms",   label: "Rooms"    },
            { href: "/about",   label: "About"    },
            { href: "/contact", label: "Contact"  },
            { href: "/faq",     label: "FAQ"      },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#50606f",
                textDecoration: "none",
                marginBottom: 8,
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div>
          <p
            style={{
              fontSize: "0.625rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#50606f",
              marginBottom: 16,
            }}
          >
            Legal
          </p>
          {[
            { href: "/terms",               label: "Terms & Conditions"  },
            { href: "/privacy",             label: "Privacy Policy"      },
            { href: "/cancellation-policy", label: "Cancellation Policy" },
            { href: "/cookies",             label: "Cookie Policy"       },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#50606f",
                textDecoration: "none",
                marginBottom: 8,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "32px auto 0",
          padding: "0 32px 48px",
          borderTop: "1px solid rgba(195, 200, 193, 0.3)",
          paddingTop: 24,
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "#50606f" }}>
          &copy; {new Date().getFullYear()} Chello Yaku Guest House. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
