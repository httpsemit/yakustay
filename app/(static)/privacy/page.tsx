import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Understand how Chello Yaku Hotel collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="1 January 2025"
    >
      <h2>1. Introduction</h2>
      <p>
        Chello Yaku Hotel (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect when you visit our website or make a booking, how we use it, and your rights in relation to it.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following types of personal information:</p>
      <ul>
        <li><strong>Identity data:</strong> Name, date of birth, government ID details (collected at check-in).</li>
        <li><strong>Contact data:</strong> Email address, phone number, and mailing address.</li>
        <li><strong>Transaction data:</strong> Booking details, payment information (processed by Stripe — we do not store card details), and loyalty point history.</li>
        <li><strong>Usage data:</strong> Information about how you use our website, including IP address, browser type, pages visited, and referral sources (via cookies).</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use your personal information for the following purposes:</p>
      <ul>
        <li>To process and manage your reservations and payments.</li>
        <li>To communicate with you regarding your booking, including confirmation and pre-arrival emails.</li>
        <li>To manage your loyalty rewards account and referral activity.</li>
        <li>To improve our website, products, and services.</li>
        <li>To comply with our legal obligations.</li>
      </ul>

      <h2>4. Third-Party Services</h2>
      <p>
        We share data with trusted third parties only to the extent necessary to provide our services:
      </p>
      <ul>
        <li><strong>Stripe:</strong> For secure payment processing. Stripe&rsquo;s privacy policy is available at stripe.com/privacy.</li>
        <li><strong>SendGrid:</strong> For transactional email delivery (booking confirmations, etc.).</li>
        <li><strong>Firebase / Google:</strong> For authentication, database, and file storage services.</li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We retain your personal information for as long as your account is active or as needed to provide services. Booking records are retained for 7 years to comply with tax and accounting requirements. You may request deletion of your account data at any time.
      </p>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your data (subject to legal obligations).</li>
        <li>Object to or restrict certain types of processing.</li>
        <li>Data portability — receive your data in a structured, machine-readable format.</li>
      </ul>
      <p>
        To exercise any of these rights, please email us at <a href="mailto:hello@yakustay.online">hello@yakustay.online</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        We use cookies and similar tracking technologies. Please refer to our <a href="/cookies">Cookie Policy</a> for full details.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All data is transmitted over HTTPS encryption.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any significant changes via email or a prominent notice on our website. The date of the most recent revision is displayed at the top of this page.
      </p>

      <h2>10. Contact</h2>
      <p>
        For privacy-related enquiries, please contact us at <a href="mailto:hello@yakustay.online">hello@yakustay.online</a>.
      </p>
    </LegalLayout>
  );
}
