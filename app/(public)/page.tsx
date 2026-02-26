import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Zap,
  Shield,
  Leaf,
  ChevronRight,
  Battery,
  Sun,
  Cpu,
  Sparkles,
  Award,
  Globe,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanyProfile } from "@/lib/data";
import { getStatusLabel, getStatusColor, truncate } from "@/lib/utils";
import HomeAnimations from "@/components/animations/HomeAnimations";
import FloatingParticles from "@/components/animations/FloatingParticles";
import CountUp from "@/components/animations/CountUp";
import MagneticButton from "@/components/animations/MagneticButton";

export const revalidate = 60;

export default async function HomePage() {
  let company = null;
  let categories: any[] = [];
  let featuredProducts: any[] = [];

  try {
    [company, categories, featuredProducts] = await Promise.all([
      getCompanyProfile(),
      prisma.productCategory.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true, slug: true } },
          media: { take: 1, orderBy: { order: "asc" } },
        },
      }),
    ]);
  } catch (err) {
    console.warn("HomePage: database queries failed, falling back to empty data:", (err as any)?.message ?? err);
    company = await getCompanyProfile().catch(() => null);
    categories = [];
    featuredProducts = [];
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    "ev-charging": <Zap size={28} />,
    "solar-energy": <Sun size={28} />,
    "motor-technology": <Cpu size={28} />,
    "battery-systems": <Battery size={28} />,
    "power-electronics": <Zap size={28} />,
  };

  return (
    <HomeAnimations>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "min(90vh, 800px)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Background video */}
        <video
          src="/landing.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Gradient overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.40) 40%, rgba(0,0,0,0.65) 100%)",
            zIndex: 1,
          }}
        />

        {/* Green accent gradient */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 20% 80%, rgba(22,163,74,0.15) 0%, transparent 60%)",
            zIndex: 1,
          }}
        />

        {/* Floating particles */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
          <FloatingParticles count={25} color="rgba(34,197,94,0.6)" />
        </div>

        {/* Decorative morphing blobs */}
        <div
          aria-hidden
          className="parallax-blob animate-morph-blob"
          style={{
            position: "absolute",
            top: "-10%",
            right: "-8%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)",
            zIndex: 1,
          }}
        />
        <div
          aria-hidden
          className="parallax-blob animate-morph-blob"
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
            animationDelay: "-4s",
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 3 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
              alignItems: "center",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                padding: "3rem 2.5rem",
                borderRadius: "var(--radius-xl)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 12px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10)",
                background: "rgba(4, 10, 22, 0.55)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              }}
            >
              <span
                className="badge hero-animate-badge animate-pulse-glow"
                style={{
                  marginBottom: "1.25rem",
                  background: "rgba(22, 163, 74, 0.90)",
                  color: "#ffffff",
                  fontWeight: 600,
                  padding: "0.375rem 0.875rem",
                  fontSize: "0.8125rem",
                }}
              >
                <Sparkles size={14} /> Green Energy & EV Innovation
              </span>
              <h1
                style={{
                  fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  marginBottom: "1.5rem",
                }}
                className="hero-animate-title"
              >
                {company?.tagline || "Engineering the Future of Sustainable Mobility"}
              </h1>
              <p
                className="hero-animate-sub"
                style={{
                  fontSize: "1.15rem",
                  color: "rgba(255,255,255,0.88)",
                  lineHeight: 1.75,
                  maxWidth: "560px",
                  marginBottom: "2.25rem",
                  textShadow: "0 1px 6px rgba(0,0,0,0.55)",
                }}
              >
                {company?.description
                  ? truncate(company.description, 200)
                  : "We design and build advanced EV components, solar charging systems, battery management solutions, and IoT-enabled power electronics for a cleaner tomorrow."}
              </p>
              <div className="hero-animate-cta" style={{ display: "flex", flexWrap: "wrap", gap: "0.875rem" }}>
                <MagneticButton>
                  <Link href="/products" className="btn btn-primary btn-lg">
                    Explore Products <ArrowRight size={18} />
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/contact" className="btn btn-outline btn-lg" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white" }}>
                    Contact Us
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(to top, var(--background), transparent)",
            zIndex: 2,
          }}
        />
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section
        className="noise-bg"
        style={{
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "3rem 0",
          position: "relative",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {[
            { value: featuredProducts.length, suffix: "+", label: "Products", icon: <Cpu size={22} /> },
            { value: categories.length, suffix: "", label: "Categories", icon: <Award size={22} /> },
            { value: 100, suffix: "%", label: "Green Energy", icon: <Leaf size={22} /> },
            { value: 0, suffix: "", label: "Made in India", icon: <Globe size={22} />, isText: true, text: "\u{1f1ee}\u{1f1f3}" },
          ].map((stat) => (
            <div key={stat.label} className="stat-value" style={{ padding: "0.5rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius)",
                  background: "color-mix(in srgb, var(--primary) 10%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  margin: "0 auto 0.75rem",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {stat.isText ? (
                  <span>{stat.text}</span>
                ) : (
                  <CountUp end={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted)",
                  marginTop: "0.375rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section
          style={{
            padding: "6rem 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            className="parallax-blob"
            style={{
              position: "absolute",
              top: "10%",
              right: "-5%",
              width: "350px",
              height: "350px",
              borderRadius: "50%",
              background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 6%, transparent), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="container">
            <div className="gsap-section-title" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div className="section-divider" style={{ marginBottom: "1.25rem" }} />
              <h2
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 800,
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Product Categories
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "1.06rem",
                  maxWidth: "580px",
                  margin: "0 auto",
                  lineHeight: 1.7,
                }}
              >
                Explore our range of cutting-edge green energy and EV technology solutions
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="card-interactive cat-card tilt-card"
                  style={{
                    padding: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "0.875rem",
                    textDecoration: "none",
                  }}
                >
                  <div
                    className="animate-float"
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--secondary) 10%, transparent))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                    }}
                  >
                    {categoryIcons[cat.slug] || <Zap size={28} />}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: "1.06rem" }}>{cat.name}</h3>
                  {cat.description && (
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.65 }}>
                      {truncate(cat.description, 80)}
                    </p>
                  )}
                  <span
                    className="badge"
                    style={{
                      background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                      color: "var(--primary)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {cat._count.products} product{cat._count.products !== 1 ? "s" : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ──────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section
          className="noise-bg"
          style={{
            padding: "6rem 0",
            background: "var(--card)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            position: "relative",
          }}
        >
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="gsap-section-title"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "3rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div className="section-divider section-divider-left" style={{ marginBottom: "1rem" }} />
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Featured Products
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "1.06rem" }}>
                  Our latest innovations in green energy technology
                </p>
              </div>
              <MagneticButton>
                <Link
                  href="/products"
                  className="btn btn-outline btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
                >
                  View All <ChevronRight size={16} />
                </Link>
              </MagneticButton>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="card prod-card tilt-card"
                  style={{
                    overflow: "hidden",
                    padding: 0,
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "220px",
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--secondary) 8%, var(--background)))",
                      overflow: "hidden",
                    }}
                  >
                    {product.media[0]?.imageUrl ? (
                      <Image
                        src={product.media[0].imageUrl}
                        alt={product.media[0].altText || product.name}
                        fill
                        style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                        <Cpu size={52} strokeWidth={1} />
                      </div>
                    )}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60%",
                        background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: getStatusColor(product.status),
                        color: "white",
                        fontSize: "0.6875rem",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>
                  <div style={{ padding: "1.5rem" }}>
                    {product.category && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--primary)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {product.category.name}
                      </span>
                    )}
                    <h3 style={{ fontWeight: 700, fontSize: "1.125rem", margin: "0.5rem 0", lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--muted)",
                          lineHeight: 1.65,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {truncate(product.shortDescription, 100)}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                      }}
                    >
                      {product.powerRating && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Zap size={12} /> {product.powerRating}
                        </span>
                      )}
                      {product.efficiency && (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Shield size={12} /> {product.efficiency}
                        </span>
                      )}
                    </div>
                    {product.price !== null && (
                      <div
                        style={{
                          marginTop: "1rem",
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "baseline",
                          gap: "0.25rem",
                        }}
                      >
                        <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>₹</span>
                        {product.price.toLocaleString("en-IN")}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="parallax-blob"
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-8%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--secondary) 5%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="gsap-section-title" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="section-divider" style={{ marginBottom: "1.25rem" }} />
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: "0.75rem",
                letterSpacing: "-0.02em",
              }}
            >
              Why Choose Us
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "1.06rem",
                maxWidth: "580px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              We bring together deep engineering expertise and sustainable innovation
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.75rem",
            }}
          >
            {[
              {
                icon: <Leaf size={28} />,
                title: "100% Sustainable",
                desc: "Every product is designed with sustainability at its core — from materials to energy efficiency.",
                gradient: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(22,163,74,0.05))",
                accentColor: "var(--primary)",
              },
              {
                icon: <Zap size={28} />,
                title: "High Performance",
                desc: "Our solutions deliver industrial-grade performance backed by rigorous testing and validation.",
                gradient: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(2,132,199,0.05))",
                accentColor: "var(--secondary)",
              },
              {
                icon: <Shield size={28} />,
                title: "Quality Assured",
                desc: "Built to international standards with comprehensive quality control at every stage.",
                gradient: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.05))",
                accentColor: "var(--accent)",
              },
              {
                icon: <Cpu size={28} />,
                title: "IoT-Enabled",
                desc: "Smart monitoring and data-driven insights built into our systems for maximum efficiency.",
                gradient: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.05))",
                accentColor: "#6366f1",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-interactive why-card"
                style={{
                  padding: "2.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  borderTop: `3px solid ${item.accentColor}`,
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--radius-lg)",
                    background: item.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.accentColor,
                    transition: "transform 0.3s ease",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.125rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        className="cta-section noise-bg"
        style={{
          padding: "6rem 0",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--secondary) 6%, var(--background)))",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="animate-morph-blob"
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          aria-hidden
          className="animate-morph-blob"
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--secondary) 8%, transparent), transparent 70%)",
            filter: "blur(40px)",
            animationDelay: "-6s",
          }}
        />

        <div className="container" style={{ maxWidth: "680px", position: "relative", zIndex: 1 }}>
          <div className="section-divider" style={{ marginBottom: "1.5rem" }} />
          <h2
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 800,
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Build the Future?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.1rem",
              lineHeight: 1.75,
              marginBottom: "2.5rem",
            }}
          >
            Whether you&apos;re looking for EV components, custom power solutions, or partnership
            opportunities, we&apos;d love to hear from you.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}>
            <MagneticButton>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get in Touch <ArrowRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </MagneticButton>
          </div>
        </div>
      </section>
    </HomeAnimations>
  );
}
