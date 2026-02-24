import type { Metadata } from "next";
import { Target, Eye, Leaf, Zap, Shield, Users } from "lucide-react";
import { getCompanyProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Anagha Innovation — our mission, vision, and commitment to green energy and EV technology innovation.",
};

export const revalidate = 120;

export default async function AboutPage() {
  const company = await getCompanyProfile();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 0 3rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--background)), var(--background))",
        }}
      >
        <div className="container" style={{ maxWidth: "800px", textAlign: "center" }}>
          <span
            className="badge"
            style={{
              marginBottom: "1rem",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            About Us
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            {company?.companyName || "Anagha Innovation"}
          </h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            {company?.tagline ||
              "Powering the Future of Green Energy & EV Technology"}
          </p>
        </div>
      </section>

      {/* ── DESCRIPTION ──────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {company?.description && (
            <div
              style={{
                fontSize: "1.0625rem",
                lineHeight: 1.8,
                color: "var(--foreground)",
              }}
            >
              {company.description.split("\n").map((p, i) => (
                <p key={i} style={{ marginBottom: "1.25rem" }}>
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section
        style={{
          padding: "4rem 0",
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Mission */}
            {company?.mission && (
              <div
                className="card"
                style={{
                  padding: "2.5rem",
                  borderLeft: "4px solid var(--primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background:
                        "color-mix(in srgb, var(--primary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                    }}
                  >
                    <Target size={22} />
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: "1.25rem" }}>
                    Our Mission
                  </h2>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.8,
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
                className="card"
                style={{
                  padding: "2.5rem",
                  borderLeft: "4px solid var(--secondary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background:
                        "color-mix(in srgb, var(--secondary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--secondary)",
                    }}
                  >
                    <Eye size={22} />
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: "1.25rem" }}>
                    Our Vision
                  </h2>
                </div>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: 1.8,
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
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                fontWeight: 800,
                marginBottom: "0.75rem",
              }}
            >
              Our Core Values
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "1rem",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              The principles that guide everything we build
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: <Leaf size={24} />,
                title: "Sustainability First",
                desc: "Every decision we make is driven by our commitment to the environment and future generations.",
              },
              {
                icon: <Zap size={24} />,
                title: "Innovation",
                desc: "We push boundaries in EV tech, power electronics, and IoT to deliver breakthrough solutions.",
              },
              {
                icon: <Shield size={24} />,
                title: "Quality & Reliability",
                desc: "Our products are built to international standards, tested rigorously, and engineered for durability.",
              },
              {
                icon: <Users size={24} />,
                title: "Collaboration",
                desc: "We believe in partnerships — with academia, industry, and communities — to amplify impact.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="card"
                style={{
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--radius)",
                    background:
                      "color-mix(in srgb, var(--primary) 12%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  {v.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.0625rem" }}>
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
