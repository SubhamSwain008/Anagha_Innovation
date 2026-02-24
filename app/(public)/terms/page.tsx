import type { Metadata } from "next";
import { getCompanyProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Anagha Innovation — the rules governing your use of our website and services.",
};

export const revalidate = 3600;

export default async function TermsPage() {
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
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the {name} website, you agree to be bound by these Terms
              of Service. If you do not agree, please refrain from using our website.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              2. Services
            </h2>
            <p>
              {name} provides information about our green energy and EV technology products and
              services. Product listings, specifications, and pricing displayed on this website
              are for informational purposes and may change without notice.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              3. Inquiry & Quotation System
            </h2>
            <p>
              Our website uses an inquiry-based system (Request for Quotation). Adding products to
              the cart and submitting an inquiry does not constitute a purchase order. Final
              pricing, availability, and terms will be confirmed by our team via direct
              communication.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              4. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, images, designs, logos, and product
              specifications — is the intellectual property of {name} and is protected by
              applicable copyright and trademark laws. You may not reproduce, distribute, or
              modify any content without prior written consent.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              5. Product Information
            </h2>
            <p>
              We strive to keep product information accurate and up-to-date. However, we do not
              warrant that product descriptions, technical specifications, pricing, or images are
              complete, current, or error-free. Final product specifications will be confirmed
              during the quotation process.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              6. Limitation of Liability
            </h2>
            <p>
              {name} shall not be liable for any indirect, incidental, or consequential damages
              arising from your use of this website or reliance on any information provided
              herein. Our total liability shall not exceed the amount paid by you (if any) for the
              services in question.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              7. External Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for
              the content, privacy practices, or availability of these external sites.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              8. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. Any
              disputes arising under these terms shall be subject to the exclusive jurisdiction of
              the courts in Bihar, India.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the website constitutes acceptance
              of the updated terms.
            </p>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              10. Contact
            </h2>
            <p>
              For questions regarding these Terms of Service, please contact us at{" "}
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
