import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";
import type { CompanyProfileData, SocialLink } from "@/types";

interface FooterProps {
  company: CompanyProfileData | null;
}

export default function Footer({ company }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const socialLinks: SocialLink[] = company?.socialLinks || [];

  return (
    <footer
      style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        paddingTop: "4rem",
        paddingBottom: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient accent line */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--primary))",
          backgroundSize: "300% 100%",
          animation: "gradient-shift 6s linear infinite",
        }}
      />

      {/* Decorative blob */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 4%, transparent), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Leaf size={20} style={{ color: "white" }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>
                {company?.companyName || "Anagha Innovation"}
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, maxWidth: "320px" }}>
              {company?.tagline || "Powering the Future of Green Energy & EV Technology"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9375rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { href: "/about", label: "About Us" },
                { href: "/products", label: "Products" },
                { href: "/team", label: "Our Team" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover-underline"
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    transition: "color 0.2s ease",
                    width: "fit-content",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9375rem" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {company?.address && (
                <div style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--primary)" }} />
                  <span>{company.address}</span>
                </div>
              )}
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "var(--muted)", transition: "color 0.2s ease" }}
                >
                  <Mail size={16} style={{ flexShrink: 0, color: "var(--primary)" }} />
                  <span>{company.email}</span>
                </a>
              )}
              {company?.phone && (
                <a
                  href={`tel:${company.phone}`}
                  style={{ display: "flex", gap: "0.625rem", fontSize: "0.875rem", color: "var(--muted)", transition: "color 0.2s ease" }}
                >
                  <Phone size={16} style={{ flexShrink: 0, color: "var(--primary)" }} />
                  <span>{company.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1.25rem", fontSize: "0.9375rem" }}>Follow Us</h4>
            <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "9999px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                >
                  {social.platform}
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.375rem",
            fontSize: "0.8125rem",
            color: "var(--muted)",
            flexWrap: "wrap",
          }}
        >
          <span>© {currentYear} {company?.companyName || "Anagha Innovation"}. All rights reserved.</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            Built with <Heart size={12} style={{ color: "var(--primary)" }} /> in India
          </span>
        </div>
      </div>
    </footer>
  );
}
