import type { Metadata } from "next";
import { Target, Eye, Leaf, Zap, Shield, Users, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCompanyProfile } from "@/lib/data";
import PageAnimations from "@/components/animations/PageAnimations";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Anagha Innovation — our mission, vision, and commitment to green energy and EV technology innovation.",
};

export const revalidate = 120;

export default async function AboutPage() {
  const company = await getCompanyProfile();

  return (
    <PageAnimations>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="page-hero noise-bg"
        style={{
          padding: "5rem 0 4rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--background)), var(--background))",
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
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 8%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="container" style={{ maxWidth: "800px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <span
            className="badge"
            style={{
              marginBottom: "1.25rem",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              color: "var(--primary)",
              fontWeight: 600,
              padding: "0.375rem 0.875rem",
            }}
          >
            <Sparkles size={14} /> About Us
          </span>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: "1.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            {company?.companyName || "Anagha Innovation"}
          </h1>
          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--muted)",
              lineHeight: 1.75,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {company?.tagline ||
              "Powering the Future of Green Energy & EV Technology"}
          </p>
          <div className="section-divider" style={{ marginTop: "2rem" }} />
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {company?.description && (
            <div
              className="gsap-reveal"
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.85,
                color: "var(--foreground)",
              }}
            >
              {company.description.split("\n").map((p, i) => (
                <p key={i} style={{ marginBottom: "1.5rem" }}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section
        className="noise-bg"
        style={{
          padding: "5rem 0",
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          position: "relative",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="gsap-stagger-parent"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Mission */}
            {company?.mission && (
              <div
                className="card-interactive gsap-stagger-child"
                style={{
                  padding: "2.75rem",
                  borderLeft: "4px solid var(--primary)",
                  borderTop: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    className="animate-float"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--primary) 5%, transparent))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                    }}
                  >
                    <Target size={24} />
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: "1.375rem" }}>
                    Our Mission
                  </h2>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.85,
                    fontSize: "0.9375rem",
                  }}
                >
                  {company.mission}
                </p>
              </div>
            )}

            {/* Vision */}
            {company?.vision && (
              <div
                className="card-interactive gsap-stagger-child"
                style={{
                  padding: "2.75rem",
                  borderLeft: "4px solid var(--secondary)",
                  borderTop: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div
                    className="animate-float"
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--secondary) 15%, transparent), color-mix(in srgb, var(--secondary) 5%, transparent))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--secondary)",
                      animationDelay: "-2s",
                    }}
                  >
                    <Eye size={24} />
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: "1.375rem" }}>
                    Our Vision
                  </h2>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.85,
                    fontSize: "0.9375rem",
                  }}
                >
                  {company.vision}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section style={{ padding: "6rem 0", position: "relative", overflow: "hidden" }}>
        {/* Decorative blob */}
        <div
          aria-hidden
          className="parallax-blob"
          style={{
            position: "absolute",
            bottom: "0%",
            left: "-8%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--secondary) 5%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="gsap-reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-divider" style={{ marginBottom: "1.25rem" }} />
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Our Core Values
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "1.06rem",
                maxWidth: "520px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              The principles that guide everything we build
            </p>
          </div>
          <div
            className="gsap-stagger-parent"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {[
              {
                icon: <Leaf size={26} />,
                title: "Sustainability First",
                desc: "Every decision we make is driven by our commitment to the environment and future generations.",
                accent: "var(--primary)",
                gradient: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(22,163,74,0.05))",
              },
              {
                icon: <Zap size={26} />,
                title: "Innovation",
                desc: "We push boundaries in EV tech, power electronics, and IoT to deliver breakthrough solutions.",
                accent: "var(--secondary)",
                gradient: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(2,132,199,0.05))",
              },
              {
                icon: <Shield size={26} />,
                title: "Quality & Reliability",
                desc: "Our products are built to international standards, tested rigorously, and engineered for durability.",
                accent: "var(--accent)",
                gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.05))",
              },
              {
                icon: <Users size={26} />,
                title: "Collaboration",
                desc: "We believe in partnerships — with academia, industry, and communities — to amplify impact.",
                accent: "#8b5cf6",
                gradient: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(109,40,217,0.05))",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="card-interactive gsap-stagger-child"
                style={{
                  padding: "2.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  borderTop: `3px solid ${v.accent}`,
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "var(--radius-lg)",
                    background: v.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: v.accent,
                  }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.125rem" }}>
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    lineHeight: 1.75,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        className="gsap-scale-up noise-bg"
        style={{
          padding: "5rem 0",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--secondary) 6%, var(--background)))",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ maxWidth: "620px", position: "relative", zIndex: 1 }}>
          <div className="section-divider" style={{ marginBottom: "1.5rem" }} />
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 800,
              marginBottom: "1rem",
              letterSpacing: "-0.02em",
            }}
          >
            Want to learn more?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.06rem",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}
          >
            Explore our products or get in touch with our team to discuss how we can work together.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/products" className="btn btn-primary btn-lg">
              View Products <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PageAnimations>
  );
}
