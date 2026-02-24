import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
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
        paddingTop: "3rem",
        paddingBottom: "1.5rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Leaf size={24} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 800, fontSize: "1.125rem" }}>
                {company?.companyName || "Anagha Innovation"}
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7 }}>
              {company?.tagline || "Powering the Future of Green Energy & EV Technology"}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9375rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                  style={{ fontSize: "0.875rem", color: "var(--muted)", transition: "color var(--transition)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9375rem" }}>Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {company?.address && (
                <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{company.address}</span>
                </div>
              )}
              {company?.email && (
                <a
                  href={`mailto:${company.email}`}
                  style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}
                >
                  <Mail size={16} style={{ flexShrink: 0 }} />
                  <span>{company.email}</span>
                </a>
              )}
              {company?.phone && (
                <a
                  href={`tel:${company.phone}`}
                  style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}
                >
                  <Phone size={16} style={{ flexShrink: 0 }} />
                  <span>{company.phone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9375rem" }}>Follow Us</h4>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm"
                  style={{ border: "1px solid var(--border)" }}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.8125rem",
            color: "var(--muted)",
          }}
        >
          © {currentYear} {company?.companyName || "Anagha Innovation"}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
