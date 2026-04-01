"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailedInner() {
  const searchParams = useSearchParams();
  const roomId       = searchParams.get("roomId") ?? "";

  return (
    <div
      style={{
        minHeight: "100vh", background: "#fbfaee",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "64px 32px", textAlign: "center",
      }}
    >
      {/* Error icon */}
      <div
        style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#ffdad6", display: "flex", alignItems: "center",
          justifyContent: "center", marginBottom: 28, fontSize: 32,
        }}
      >
        ✕
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#ba1a1a", marginBottom: 10 }}>
        Payment Failed
      </p>
      <h1
        style={{
          fontFamily: "'Noto Serif', serif", fontSize: "2.5rem", fontWeight: 300,
          letterSpacing: "-0.01em", color: "#061b0e", marginBottom: 16, lineHeight: 1.1,
        }}
      >
        Something<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>went wrong.</em>
      </h1>

      <p style={{ fontSize: "0.9375rem", fontWeight: 300, color: "#50606f", maxWidth: 400, lineHeight: 1.7, marginBottom: 40 }}>
        Your payment could not be processed. Your booking has not been confirmed.
        Please try again or contact us if the issue persists.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {roomId && (
          <Link
            href={`/rooms/${roomId}`}
            style={{
              background: "#061b0e", color: "#ffffff", textDecoration: "none",
              borderRadius: "0.75rem", padding: "12px 24px", fontSize: 11,
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            }}
          >
            Try Again
          </Link>
        )}
        <Link
          href="/rooms"
          style={{
            background: "transparent", color: "#061b0e", textDecoration: "none",
            border: "1px solid rgba(195,200,193,0.3)", borderRadius: "0.75rem",
            padding: "10px 20px", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}
        >
          Browse Rooms
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return <Suspense fallback={null}><FailedInner /></Suspense>;
}
