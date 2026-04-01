import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Cancellation Policy — Grand Haven Hotel",
  description: "Understand Grand Haven Hotel's cancellation and refund policy before making a booking.",
};

const POLICY_TABLE = [
  {
    scenario: "Cancelled 48+ hours before check-in",
    refund: "100% refund",
    points: "Points fully reversed",
    color: "#d0e9d4",
  },
  {
    scenario: "Cancelled 24–48 hours before check-in",
    refund: "50% refund",
    points: "Points partially reversed",
    color: "#fffbe6",
  },
  {
    scenario: "Cancelled less than 24 hours before check-in",
    refund: "No refund",
    points: "Points forfeited",
    color: "#ffdad6",
  },
  {
    scenario: "No-show (failure to check in without cancellation)",
    refund: "No refund",
    points: "Points forfeited",
    color: "#ffdad6",
  },
  {
    scenario: "Cancellation by Grand Haven Hotel (any reason)",
    refund: "100% refund",
    points: "Full compensation offered",
    color: "#d0e9d4",
  },
];

export default function CancellationPolicyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cancellation Policy"
      lastUpdated="1 January 2025"
    >
      <p>
        We understand that plans can change. Our cancellation policy is designed to be fair to both our guests and our small team, who prepare for each visit well in advance.
      </p>

      <h2>1. Cancellation Tiers</h2>

      {/* Visual policy table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "24px 0" }}>
        {POLICY_TABLE.map(({ scenario, refund, points, color }) => (
          <div
            key={scenario}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              background: color,
              borderRadius: "0.75rem",
              padding: "20px 24px",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1b1c15", marginBottom: 4 }}>
                {scenario}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "#50606f", fontWeight: 300 }}>
                {points}
              </p>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: "#1b1c15",
                whiteSpace: "nowrap",
              }}
            >
              {refund}
            </p>
          </div>
        ))}
      </div>

      <h2>2. How to Cancel</h2>
      <p>To cancel a reservation, please log in to your account and visit <strong>My Bookings</strong>. Select the booking you wish to cancel and click &ldquo;Cancel Booking&rdquo;. Cancellations submitted through your account are processed immediately and automatically.</p>
      <p>
        If you are unable to cancel through your account, please contact us directly at <a href="mailto:reservations@grandhaven.in">reservations@grandhaven.in</a> or call +91 94350 00000, citing your booking reference number.
      </p>

      <h2>3. Refund Processing</h2>
      <p>
        Refunds are processed through Stripe to the original payment method. Please allow 5–10 business days for the refund to appear on your statement, depending on your bank or card issuer.
      </p>
      <p>
        For partial refunds (50% cancellation window), the calculation is based on the total booking amount after any loyalty point discounts applied at checkout.
      </p>

      <h2>4. Loyalty Points on Cancellation</h2>
      <p>
        Points credited to your loyalty account for a booking will be reversed proportionally upon cancellation:
      </p>
      <ul>
        <li>100% cancellation (full refund) — all points credited are reversed.</li>
        <li>50% cancellation — 50% of the earned points are reversed.</li>
        <li>No-refund cancellations — points are forfeited.</li>
      </ul>
      <p>
        If you used loyalty points to discount the booking, those points are returned to your balance in the event of a full refund cancellation.
      </p>

      <h2>5. Special Circumstances</h2>
      <p>
        In the event of documented medical emergencies, natural disasters, or government-mandated travel restrictions, we will consider waiving our standard cancellation policy on a case-by-case basis. Please contact us with supporting documentation as soon as possible.
      </p>

      <h2>6. Non-Refundable Rates</h2>
      <p>
        Certain promotional or discounted rates may be offered as non-refundable. This will be clearly indicated on the booking page before payment. By completing a booking at a non-refundable rate, you agree that no refund will be issued for any cancellation.
      </p>

      <h2>7. Contact</h2>
      <p>
        For cancellation-related questions, please reach us at <a href="mailto:reservations@grandhaven.in">reservations@grandhaven.in</a> or visit our <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
