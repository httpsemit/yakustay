"use client";

import { useState } from "react";

const FAQS = [
  {
    category: "Reservations",
    items: [
      {
        q: "How do I make a reservation?",
        a: "You can book directly through our website by selecting your check-in and check-out dates on the homepage, choosing a room, and completing the secure Stripe checkout. Alternatively, call us on +91 96782 67281 or email reservations@grandhaven.in.",
      },
      {
        q: "Is my booking instantly confirmed?",
        a: "Yes. Once your payment is processed through Stripe, your booking is instantly confirmed and you will receive a confirmation email with all the details.",
      },
      {
        q: "Can I modify my booking after confirmation?",
        a: "Modifications are subject to availability. Please contact our front desk at least 48 hours before your check-in date. We will do our best to accommodate changes.",
      },
      {
        q: "What is the minimum stay requirement?",
        a: "We have a minimum 2-night stay on weekends (Friday–Sunday) and during public holidays. Weekday reservations are available for a single night.",
      },
    ],
  },
  {
    category: "Check-in & Check-out",
    items: [
      {
        q: "What are your check-in and check-out times?",
        a: "Standard check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in and late check-out are available on request, subject to room availability, and may incur an additional charge.",
      },
      {
        q: "Is there a 24-hour front desk?",
        a: "Yes, our front desk is staffed around the clock — every day of the year.",
      },
      {
        q: "What ID do I need to bring?",
        a: "All guests are required to present a valid government-issued photo ID (Aadhaar, Passport, Driving Licence, or Voter ID) at check-in.",
      },
    ],
  },
  {
    category: "Cancellations & Refunds",
    items: [
      {
        q: "What is your cancellation policy?",
        a: "Cancellations made 48+ hours before check-in receive a full refund. Cancellations 24–48 hours before check-in receive a 50% refund. Cancellations within 24 hours of check-in are non-refundable. Please see our Cancellation Policy page for full details.",
      },
      {
        q: "How long do refunds take?",
        a: "Stripe refunds typically appear on your statement within 5–10 business days, depending on your card issuer.",
      },
    ],
  },
  {
    category: "Amenities & Services",
    items: [
      {
        q: "Is breakfast included?",
        a: "Yes. A complimentary farm-to-table breakfast is included with every room booking. We source ingredients from local farms and forage seasonally.",
      },
      {
        q: "Is there Wi-Fi?",
        a: "Complimentary high-speed Wi-Fi is available throughout the property, including all rooms and common areas.",
      },
      {
        q: "Do you offer airport transfers?",
        a: "Yes, we offer transfers to and from Tezpur airport. This can be arranged at an additional cost. Please contact us at least 48 hours in advance to book.",
      },
      {
        q: "Are pets allowed?",
        a: "We love animals, but unfortunately we are not able to accommodate pets at this time to protect the local wildlife.",
      },
    ],
  },
  {
    category: "Loyalty & Referral",
    items: [
      {
        q: "How does the Haven Rewards programme work?",
        a: "You earn 1 loyalty point for every ₹100 spent on your bookings. Points accumulate across stays and unlock Silver, Gold, and Platinum tier benefits. You can redeem 10 points for ₹1 off a future booking.",
      },
      {
        q: "How do I refer a friend?",
        a: "Log into your account and visit the Referral page to get your unique referral link. When a friend registers with your link and completes their first booking, they receive 10% off and you earn 500 bonus points.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid #e4e3d7",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            color: "#1b1c15",
            lineHeight: 1.5,
          }}
        >
          {q}
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: 20,
            color: "#50606f",
            flexShrink: 0,
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 400 : 0,
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          style={{
            fontSize: "0.9375rem",
            color: "#50606f",
            lineHeight: 1.75,
            fontWeight: 300,
            paddingBottom: 20,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ background: "#fbfaee", minHeight: "100vh" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#1b3022", padding: "80px 32px 64px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#b4cdb8",
              marginBottom: 12,
            }}
          >
            Everything you need to know
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.1,
              margin: "0 0 16px",
            }}
          >
            Frequently asked <em style={{ fontStyle: "italic" }}>questions.</em>
          </h1>
          <p style={{ fontSize: "1rem", color: "#819986", lineHeight: 1.7, fontWeight: 300, maxWidth: 520 }}>
            Can&rsquo;t find an answer? Our team is available 24/7 — just drop us a message on the{" "}
            <a href="/contact" style={{ color: "#d0e9d4", textDecoration: "underline" }}>
              Contact page.
            </a>
          </p>
        </div>
      </section>

      {/* ── FAQ SECTIONS ──────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "64px 32px 96px" }}>
        {FAQS.map(({ category, items }) => (
          <div key={category} style={{ marginBottom: 56 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#50606f",
                marginBottom: 4,
              }}
            >
              {category}
            </p>
            <div
              style={{
                width: 32,
                height: 2,
                background: "#d0e9d4",
                marginBottom: 24,
              }}
            />
            {items.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
