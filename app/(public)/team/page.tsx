import type { Metadata } from "next";
import Image from "next/image";
import { Linkedin, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getRoleLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the passionate engineers, advisors, and mentors behind Anagha Innovation's green energy and EV technology solutions.",
};

export const revalidate = 120;

const ROLE_ORDER = ["DIRECTOR", "ADVISOR", "MENTOR", "CORE_TEAM", "ENGINEER"] as const;

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  // Group by role
  const grouped = ROLE_ORDER.map((role) => ({
    role,
    label: getRoleLabel(role),
    members: members.filter((m) => m.roleType === role),
  })).filter((g) => g.members.length > 0);

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
            Our Team
          </span>
          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            The People Behind the Innovation
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--muted)",
              lineHeight: 1.7,
            }}
          >
            Our team brings together expertise in power electronics, embedded systems, IoT, and
            sustainable engineering to create world-class green energy solutions.
          </p>
        </div>
      </section>

      {/* ── TEAM GROUPS ──────────────────────────────────── */}
      <section style={{ padding: "4rem 0" }}>
        <div className="container">
          {grouped.length === 0 ? (
            <div className="empty-state">
              <User size={48} strokeWidth={1} />
              <h3>Team members coming soon</h3>
              <p>Check back later to meet our team.</p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.role} style={{ marginBottom: "4rem" }}>
                <h2
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                    color: "var(--primary)",
                  }}
                >
                  {group.label}s
                </h2>
                <div
                  style={{
                    height: "3px",
                    width: "48px",
                    background: "var(--primary)",
                    borderRadius: "2px",
                    marginBottom: "2rem",
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="card"
                      style={{
                        textAlign: "center",
                        overflow: "hidden",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "240px",
                          background:
                            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, var(--background)), color-mix(in srgb, var(--secondary) 10%, var(--background)))",
                        }}
                      >
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 250px"
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
                      </div>

                      <div style={{ padding: "1.25rem" }}>
                        <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "0.25rem" }}>
                          {member.name}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.8125rem",
                            color: "var(--primary)",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                          }}
                        >
                          {member.designation}
                        </p>
                        {member.bio && (
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--muted)",
                              lineHeight: 1.6,
                              marginBottom: "0.75rem",
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
                            }}
                          >
                            <Linkedin size={14} /> LinkedIn
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
    </>
  );
}
