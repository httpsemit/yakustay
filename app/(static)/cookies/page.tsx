import type { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how Chello Yaku Hotel uses cookies and tracking technologies on its website.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookie Policy"
      lastUpdated="1 January 2025"
    >
      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, remember your preferences, and provide information to the website owner about how the site is being used.
      </p>

      <h2>2. How We Use Cookies</h2>
      <p>Chello Yaku Hotel uses cookies for the following purposes:</p>

      <h3>Essential Cookies</h3>
      <p>
        These cookies are strictly necessary for the website to function. They include session authentication cookies that keep you logged in during your visit. Without these cookies, certain features (such as completing a booking) would not work.
      </p>

      <table>
        <thead>
          <tr>
            <th>Cookie Name</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>session</code></td>
            <td>Maintains your authenticated session after login</td>
            <td>Session / 7 days</td>
          </tr>
        </tbody>
      </table>

      <h3>Analytical Cookies</h3>
      <p>
        We may use analytical cookies to understand how visitors interact with our website (e.g., which pages are most visited, how long users stay). This data is aggregated and anonymous. At present, we do not use any third-party analytics platform; this is planned for a future update.
      </p>

      <h3>Functional Cookies</h3>
      <p>
        These cookies remember your preferences — for example, your language choice or preferred currency — to provide a more personalised experience.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        Our payment provider, Stripe, may set cookies on your device when you proceed to checkout. These cookies are necessary to complete secure payment processing and are governed by Stripe&rsquo;s own cookie and privacy policies.
      </p>
      <p>
        Google Maps, embedded on our Contact page, may set cookies from Google&rsquo;s domains. These are governed by Google&rsquo;s privacy policy.
      </p>

      <h2>4. Managing Cookies</h2>
      <p>
        Most web browsers allow you to control cookies through their settings. You can typically:
      </p>
      <ul>
        <li>View cookies that are currently set on your device.</li>
        <li>Allow or block cookies — either for all websites or for specific sites.</li>
        <li>Delete cookies that have already been set.</li>
      </ul>
      <p>
        Please note that disabling essential cookies will prevent certain features of our website from working correctly, including the ability to complete a booking or stay logged in.
      </p>
      <p>
        For guidance on how to manage cookies in your browser, please visit your browser&rsquo;s help documentation.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. The revised policy will be published on this page with an updated &ldquo;Last Updated&rdquo; date.
      </p>

      <h2>6. Contact</h2>
      <p>
        If you have any questions about how we use cookies, please contact us at <a href="mailto:hello@yakustay.online">hello@yakustay.online</a>.
      </p>
    </LegalLayout>
  );
}
