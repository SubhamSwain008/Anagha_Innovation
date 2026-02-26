import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin, User, Sparkles, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getRoleLabel } from "@/lib/utils";
import PageAnimations from "@/components/animations/PageAnimations";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the passionate engineers, advisors, and mentors behind Anagha Innovation's green energy and EV technology solutions.",
};

export const revalidate = 120;

const ROLE_ORDER = ["DIRECTOR", "ADVISOR", "MENTOR", "CORE_TEAM", "ENGINEER"] as const;

export default async function TeamPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let members: any[] = [];
  try {
    members = await prisma.teamMember.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
  } catch (err) {
    console.warn("TeamPage: database unavailable:", (err as any)?.message ?? err);
  }

  // Group by role
  const grouped = ROLE_ORDER.map((role) => ({
    role,
    label: getRoleLabel(role),
    members: members.filter((m) => m.roleType === role),
  })).filter((g) => g.members.length > 0);

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
            top: "-30%",
            right: "-10%",
            width: "400px",
            height: "400px",
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
            left: "-8%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--secondary) 6%, transparent), transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "3s",
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
            <Sparkles size={14} /> Our Team
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
            The People Behind the Innovation
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            Our team brings together expertise in power electronics, embedded systems, IoT, and
            sustainable engineering to create world-class green energy solutions.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── TEAM GROUPS ──────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          {grouped.length === 0 ? (
            <div className="empty-state gsap-fade-in">
              <User size={48} strokeWidth={1} />
              <h3>Team members coming soon</h3>
              <p>Check back later to meet our team.</p>
            </div>
          ) : (
            grouped.map((group, gi) => (
              <div key={group.role} className="gsap-reveal" style={{ marginBottom: "4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                  <h2
                    style={{
                      fontSize: "1.375rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    {group.label}s
                  </h2>
                  <div
                    style={{
                      height: "3px",
                      flex: 1,
                      maxWidth: "80px",
                      background: "linear-gradient(90deg, var(--primary), transparent)",
                      borderRadius: "2px",
                    }}
                  />
                  <span
                    className="badge"
                    style={{
                      background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                      color: "var(--primary)",
                      fontSize: "0.6875rem",
                    }}
                  >
                    {group.members.length}
                  </span>
                </div>
                <div
                  className="gsap-stagger-parent"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "1.75rem",
                  }}
                >
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="card tilt-card gsap-stagger-child"
                      style={{
                        textAlign: "center",
                        overflow: "hidden",
                        padding: 0,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "260px",
                          background:
                            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, var(--background)), color-mix(in srgb, var(--secondary) 10%, var(--background)))",
                          overflow: "hidden",
                        }}
                      >
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                            sizes="(max-width: 768px) 100vw, 260px"
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              color: "var(--muted)",
                            }}
                          >
                            <User size={64} strokeWidth={1} />
                          </div>
                        )}
                        {/* Image overlay gradient */}
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "50%",
                            background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                            pointerEvents: "none",
                          }}
                        />
                        {/* Role badge */}
                        <span
                          className="badge"
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            background: "color-mix(in srgb, var(--primary) 85%, white)",
                            color: "white",
                            fontSize: "0.625rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {getRoleLabel(member.roleType)}
                        </span>
                      </div>

                      <div style={{ padding: "1.5rem" }}>
                        <h3 style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                          {member.name}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--primary)",
                            fontWeight: 600,
                            marginBottom: "0.75rem",
                          }}
                        >
                          {member.designation}
                        </p>
                        {member.bio && (
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--muted)",
                              lineHeight: 1.65,
                              marginBottom: "1rem",
                            }}
                          >
                            {member.bio.length > 150 ? member.bio.slice(0, 150) + "..." : member.bio}
                          </p>
                        )}
                        {member.linkedInUrl && (
                          <a
                            href={member.linkedInUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.375rem",
                              color: "var(--secondary)",
                              borderRadius: "9999px",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <Linkedin size={14} /> LinkedIn <ArrowUpRight size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </PageAnimations>
  );
}
