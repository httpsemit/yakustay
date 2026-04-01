"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessInner() {
  const searchParams = useSearchParams();
  const bookingId    = searchParams.get("bookingId") ?? "";
  const ref          = bookingId.slice(0, 8).toUpperCase();

  return (
    <div
      style={{
        minHeight: "100vh", background: "#fbfaee",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "64px 32px", textAlign: "center",
      }}
    >
      {/* Success icon */}
      <div
        style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#d0e9d4", display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 28,
          fontSize: 32,
        }}
      >
        ✓
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
        Booking Confirmed
      </p>
      <h1
        style={{
          fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300,
          letterSpacing: "-0.01em", color: "#061b0e", marginBottom: 16, lineHeight: 1.1,
        }}
      >
        Your stay is<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>confirmed.</em>
      </h1>

      {bookingId && (
        <div
          style={{
            background: "#f5f4e8", borderRadius: "0.75rem",
            padding: "14px 24px", marginBottom: 32, display: "inline-block",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>
            Confirmation Number
          </p>
          <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", fontWeight: 300, color: "#061b0e" }}>
            {ref}
          </p>
        </div>
      )}

      <p style={{ fontSize: "0.9375rem", fontWeight: 300, color: "#50606f", maxWidth: 440, lineHeight: 1.7, marginBottom: 40 }}>
        A confirmation has been logged. We look forward to welcoming you to Grand Haven.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/account/bookings"
          style={{
            background: "#061b0e", color: "#ffffff", textDecoration: "none",
            borderRadius: "0.75rem", padding: "12px 24px", fontSize: 11,
            fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          }}
        >
          View My Bookings
        </Link>
        <Link
          href="/"
          style={{
            background: "transparent", color: "#061b0e", textDecoration: "none",
            border: "1px solid rgba(195,200,193,0.3)", borderRadius: "0.75rem",
            padding: "10px 20px", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <Suspense fallback={null}><SuccessInner /></Suspense>;
}
