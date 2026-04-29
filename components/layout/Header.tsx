"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    router.push("/");
  }

  const navLinks = [
    { href: "/rooms",   label: "Rooms"   },
    { href: "/about",   label: "About"   },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      suppressHydrationWarning
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(251, 250, 238, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 0 32px rgba(27, 28, 21, 0.06)",
      }}
    >
      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src="/images/navlogo.png"
            alt="Chello Yaku Guest House Logo"
            style={{
              height: "40px",
              width: "auto",
              maxWidth: "200px",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop nav — hidden below 640px via className */}
        <nav className="header-desktop-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#50606f",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Profile avatar — links to account */}
              <Link
                href="/account"
                title={user.displayName ?? "My Account"}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1b3022, #4a7c59)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d0e9d4",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(27,48,34,0.18)",
                }}
              >
                {(user.displayName ?? user.email ?? "G")[0].toUpperCase()}
              </Link>
              {/* Book Now */}
              <Link
                href="/rooms"
                style={{
                  background: "#061b0e",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "0.75rem",
                  padding: "10px 20px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Book Now
              </Link>
            </div>
          ) : (
            <Link
              href="/rooms"
              style={{
                background: "#061b0e",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "0.75rem",
                padding: "10px 20px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Book Now
            </Link>
          )}
        </nav>

          {/* Mobile: Book Now + profile avatar + Hamburger */}
          <div className="header-mobile-controls" style={{ display: "none", alignItems: "center", gap: 12 }}>
            {user ? (
              <Link
                href="/account"
                title={user.displayName ?? "My Account"}
                onClick={() => setMenuOpen(false)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1b3022, #4a7c59)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d0e9d4",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                {(user.displayName ?? user.email ?? "G")[0].toUpperCase()}
              </Link>
            ) : null}
            <Link
              href="/rooms"
              onClick={() => setMenuOpen(false)}
              style={{
                background: "#061b0e",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "0.75rem",
                padding: "9px 16px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Book Now
            </Link>
          <button
            id="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#061b0e",
                borderRadius: 2,
                transition: "transform 0.25s, opacity 0.25s",
                transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#061b0e",
                borderRadius: 2,
                transition: "opacity 0.2s",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "#061b0e",
                borderRadius: 2,
                transition: "transform 0.25s, opacity 0.25s",
                transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────── */}
      <div
        className="header-mobile-menu"
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          padding: "8px 24px 24px",
          borderTop: "1px solid rgba(195,200,193,0.25)",
          gap: 4,
        }}
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "#1b1c15",
              textDecoration: "none",
              padding: "13px 0",
              borderBottom: "1px solid rgba(195,200,193,0.2)",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </Link>
        ))}

        {user && (
          <>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#1b1c15",
                textDecoration: "none",
                padding: "13px 0",
                borderBottom: "1px solid rgba(195,200,193,0.2)",
                letterSpacing: "0.02em",
              }}
            >
              My Account
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                background: "#061b0e",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.75rem",
                padding: "13px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: 8,
                width: "100%",
              }}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
}
