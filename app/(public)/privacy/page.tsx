import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Anagha Innovation — how we collect, use, and protect your data.",
};

export const revalidate = 3600;

export default async function PrivacyPage() {
  const company = await getCompanyProfile();
  const name = company?.companyName || "Anagha Innovation";
  const email = company?.email || "contact@anaghainnovation.com";

  return (
    <section style={{ padding: "4rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 900,
            marginBottom: "0.75rem",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: "2.5rem", fontSize: "0.875rem" }}>
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            fontSize: "0.9375rem",
            lineHeight: 1.8,
            color: "var(--foreground)",
          }}
        >
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              1. Information We Collect
            </h2>
            <p>
              {name} collects information you provide directly, including your name, email
              address, phone number, and any messages submitted through our contact or inquiry
              forms. We also collect standard server logs and analytics data to improve our
              services.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              2. How We Use Your Information
            </h2>
            <p>We use your information to:</p>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              <li>Respond to your inquiries and requests for quotation</li>
              <li>Provide customer support and communication</li>
              <li>Improve our products and services</li>
              <li>Send relevant updates about our offerings (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              3. Data Storage & Security
            </h2>
            <p>
              Your data is stored on secure, encrypted servers. We implement industry-standard
              security measures to protect against unauthorized access, alteration, or
              destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              4. Cookies
            </h2>
            <p>
              We use essential cookies to maintain your preferences (such as theme and cart data).
              These cookies are stored locally in your browser and are not transmitted to external
              servers. You can disable cookies in your browser settings at any time.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              5. Third-Party Services
            </h2>
            <p>
              We may use third-party services such as Cloudinary (for image hosting) and analytics
              platforms. These services have their own privacy policies governing your data.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data held by us. To
              exercise these rights, please contact us at{" "}
              <a href={`mailto:${email}`} style={{ color: "var(--primary)", fontWeight: 600 }}>
                {email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be posted on this page
              with an updated revision date.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              8. Contact Us
            </h2>
            <p>
              For questions about this Privacy Policy, please contact us at{" "}
              <a href={`mailto:${email}`} style={{ color: "var(--primary)", fontWeight: 600 }}>
                {email}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
