import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { getCompanyProfile } from "@/lib/data";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Anagha Innovation for green energy solutions, EV technology inquiries, partnership opportunities, or custom engineering requests.",
};

export const revalidate = 120;

export default async function ContactPage() {
  const company = await getCompanyProfile();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 0 3rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--background)), var(--background))",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "700px" }}>
          <span
            className="badge"
            style={{
              marginBottom: "1rem",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            Contact
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Get in Touch
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--muted)", lineHeight: 1.7 }}>
            Have a question, partnership inquiry, or custom engineering request? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
            }}
            className="md:grid-cols-2"
          >
            {/* Form */}
            <ContactForm />

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h2
                  style={{
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                  }}
                >
                  Contact Information
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--muted)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  Reach out to us through any of the channels below, or fill out the form and our
                  team will respond within 24-48 hours.
                </p>
              </div>

              {/* Info cards */}
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                      Email
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      {company.email}
                    </div>
                  </div>
                </a>
              )}

              {company?.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--secondary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--secondary)",
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                      Phone
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      {company.phone}
                    </div>
                  </div>
                </a>
              )}

              {company?.address && (
                <div
                  className="card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                      Address
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.6 }}>
                      {company.address}
                    </div>
                  </div>
                </div>
              )}

              <div
                className="card"
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                    Business Hours
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                    Mon – Fri: 9:00 AM – 6:00 PM IST
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {company?.socialLinks && company.socialLinks.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9375rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Connect With Us
                  </h3>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    {company.socialLinks.map((s, i) => (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        {s.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
