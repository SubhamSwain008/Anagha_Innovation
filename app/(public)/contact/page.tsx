import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Sparkles, ArrowRight } from "lucide-react";
import { getCompanyProfile } from "@/lib/data";
import ContactForm from "./ContactForm";
import PageAnimations from "@/components/animations/PageAnimations";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Anagha Innovation for green energy solutions, EV technology inquiries, partnership opportunities, or custom engineering requests.",
};

export const revalidate = 120;

export default async function ContactPage() {
  const company = await getCompanyProfile();

  return (
    <PageAnimations>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="page-hero noise-bg"
        style={{
          padding: "4rem 0 3rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--background)), var(--background))",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="parallax-blob animate-morph-blob"
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 8%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          aria-hidden
          className="parallax-blob animate-morph-blob"
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-5%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--secondary) 6%, transparent), transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "2s",
          }}
        />

        <div className="container" style={{ maxWidth: "700px", position: "relative", zIndex: 1 }}>
          <span
            className="badge"
            style={{
              marginBottom: "1rem",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              color: "var(--primary)",
              fontWeight: 600,
              padding: "0.375rem 0.875rem",
            }}
          >
            <Sparkles size={14} /> Contact
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Get in Touch
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.7 }}>
            Have a question, partnership inquiry, or custom engineering request? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── CONTENT ──────────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gap: "3rem",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Form */}
            <div className="gsap-slide-left">
              <ContactForm />
            </div>

            {/* Info */}
            <div className="gsap-slide-right" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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

              {/* Info cards — stagger reveal */}
              <div className="gsap-stagger-parent" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {company?.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="card card-interactive gsap-stagger-child"
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      className="animate-float"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--primary)",
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                        Email
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                        {company.email}
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  </a>
                )}

                {company?.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="card card-interactive gsap-stagger-child"
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      className="animate-float"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "color-mix(in srgb, var(--secondary) 12%, transparent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--secondary)",
                        flexShrink: 0,
                        animationDelay: "0.5s",
                      }}
                    >
                      <Phone size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.125rem" }}>
                        Phone
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                        {company.phone}
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  </a>
                )}

                {company?.address && (
                  <div
                    className="card card-interactive gsap-stagger-child"
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      className="animate-float"
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent)",
                        flexShrink: 0,
                        animationDelay: "1s",
                      }}
                    >
                      <MapPin size={22} />
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
                  className="card card-interactive gsap-stagger-child"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="animate-float"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      flexShrink: 0,
                      animationDelay: "1.5s",
                    }}
                  >
                    <Clock size={22} />
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
              </div>

              {/* Social Links */}
              {company?.socialLinks && company.socialLinks.length > 0 && (
                <div className="gsap-fade-in" style={{ marginTop: "0.5rem" }}>
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
                        style={{ border: "1px solid var(--border)", borderRadius: "9999px" }}
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
    </PageAnimations>
  );
}
