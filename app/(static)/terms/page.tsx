import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions — Chello Yaku Guest House",
  description: "Read the terms and conditions governing your use of the Chello Yaku Guest House website and booking services.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      lastUpdated="1 January 2025"
    >
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using the Chello Yaku Guest House website (<strong>yakustay.online</strong>) or making a reservation through our platform, you agree to be bound by these Terms and Conditions, our Privacy Policy, and our Cancellation Policy. If you do not agree with any part of these terms, please do not use our services.
      </p>

      <h2>2. Reservations & Payment</h2>
      <p>
        All room reservations are subject to availability. A reservation is only confirmed once full payment has been processed successfully through our payment partner, Stripe. You will receive a confirmation email with a booking reference number upon successful payment.
      </p>
      <p>
        Prices displayed on the website are in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. We reserve the right to correct any pricing errors, even after a booking has been made, in which case you will be notified and offered a full refund.
      </p>

      <h2>3. Guest Responsibilities</h2>
      <p>
        Guests are responsible for their behaviour and the behaviour of their accompanying parties during their stay. Chello Yaku Guest House reserves the right to terminate a guest&rsquo;s stay without refund in the event of behaviour that is harmful, disruptive, or in violation of local laws or hotel policies.
      </p>

      <h2>4. Check-in & Check-out</h2>
      <p>
        Standard check-in time is 2:00 PM and standard check-out time is 11:00 AM. Early check-in and late check-out are subject to availability and may be subject to an additional fee. All guests must present a valid government-issued photo ID at check-in.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on this website, including but not limited to text, photography, logos, and design, is the property of Chello Yaku Guest House and is protected by applicable copyright laws. You may not reproduce, distribute, or create derivative works without our express prior written consent.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Chello Yaku Guest House shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services. Our total liability shall not exceed the total amount paid for the relevant booking.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Assam, India.
      </p>

      <h2>8. Amendments</h2>
      <p>
        We reserve the right to update these Terms and Conditions at any time. The date of the most recent revision is shown above. Your continued use of the website following any changes constitutes your acceptance of the revised terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        For any questions regarding these Terms, please contact us at <a href="mailto:hello@yakustay.online">hello@yakustay.online</a> or visit our <a href="/contact">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
