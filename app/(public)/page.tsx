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
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCompanyProfile } from "@/lib/data";
import { getStatusLabel, getStatusColor, truncate } from "@/lib/utils";

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
    // If the database is unreachable (e.g. during local development),
    // log a warning and continue with empty fallback data so the
    // app can render without crashing.
    // eslint-disable-next-line no-console
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
    <>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          minHeight: "min(85vh, 720px)",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, var(--background) 0%, color-mix(in srgb, var(--primary) 6%, var(--background)) 50%, var(--background) 100%)",
          overflow: "hidden",
        }}
      >
        {/* Background video (autoplay, muted, loop) */}
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
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 1,
            // avoid smoothing artifacts where supported
            imageRendering: "auto",
            
          }}
        />

        {/* dark overlay for better text contrast */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.25))",
            zIndex: 0,
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        />
        {/* decorative circles */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-60px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--secondary) 10%, transparent), transparent 70%)",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
              alignItems: "center",
              maxWidth: "720px",
            }}
          >
            <div>
              <span
                className="badge"
                style={{
                  marginBottom: "1rem",
                  background: "color-mix(in srgb, var(--primary) 15%, transparent)",
                  color: "var(--primary)",
                  fontWeight: 600,
                }}
              >
                <Leaf size={14} /> Green Energy & EV Innovation
              </span>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.25rem",
                }}
              >
                {company?.tagline || "Engineering the Future of Sustainable Mobility"}
              </h1>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  maxWidth: "540px",
                  marginBottom: "2rem",
                }}
              >
                {company?.description
                  ? truncate(company.description, 200)
                  : "We design and build advanced EV components, solar charging systems, battery management solutions, and IoT-enabled power electronics for a cleaner tomorrow."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                <Link href="/products" className="btn btn-primary btn-lg">
                  Explore Products <ArrowRight size={18} />
                </Link>
                <Link href="/contact" className="btn btn-outline btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "2.5rem 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
            textAlign: "center",
          }}
        >
          {[
            { value: `${featuredProducts.length}+`, label: "Products" },
            { value: `${categories.length}`, label: "Categories" },
            { value: "100%", label: "Green Energy" },
            { value: "Made in India", label: "Innovation" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: "0.8125rem", color: "var(--muted)", marginTop: "0.25rem" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ─────────────────────────────────────────── */}
      {categories.length > 0 && (
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
                Product Categories
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "1rem",
                  maxWidth: "560px",
                  margin: "0 auto",
                }}
              >
                Explore our range of cutting-edge green energy and EV technology solutions
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="card"
                  style={{
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "0.75rem",
                    transition: "transform var(--transition), box-shadow var(--transition)",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                    }}
                  >
                    {categoryIcons[cat.slug] || <Zap size={28} />}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{cat.name}</h3>
                  {cat.description && (
                    <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.6 }}>
                      {truncate(cat.description, 80)}
                    </p>
                  )}
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}
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
          style={{
            padding: "5rem 0",
            background: "var(--card)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "2.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                    fontWeight: 800,
                    marginBottom: "0.5rem",
                  }}
                >
                  Featured Products
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "1rem" }}>
                  Our latest innovations in green energy technology
                </p>
              </div>
              <Link
                href="/products"
                className="btn btn-outline btn-sm"
                style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="card"
                  style={{ overflow: "hidden", transition: "transform var(--transition)" }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "200px",
                      background:
                        "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--secondary) 8%, var(--background)))",
                    }}
                  >
                    {product.media[0]?.imageUrl ? (
                      <Image
                        src={product.media[0].imageUrl}
                        alt={product.media[0].altText || product.name}
                        fill
                        style={{ objectFit: "cover" }}
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
                        <Cpu size={48} strokeWidth={1} />
                      </div>
                    )}
                    {/* Status Badge */}
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: getStatusColor(product.status),
                        color: "white",
                        fontSize: "0.6875rem",
                      }}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    {product.category && (
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--primary)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {product.category.name}
                      </span>
                    )}
                    <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", margin: "0.375rem 0" }}>
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--muted)",
                          lineHeight: 1.6,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {truncate(product.shortDescription, 100)}
                      </p>
                    )}
                    {/* Quick Specs */}
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
                        <span>
                          <strong>Power:</strong> {product.powerRating}
                        </span>
                      )}
                      {product.efficiency && (
                        <span>
                          <strong>Eff:</strong> {product.efficiency}
                        </span>
                      )}
                    </div>
                    {product.price !== null && (
                      <div
                        style={{
                          marginTop: "0.75rem",
                          fontSize: "1.125rem",
                          fontWeight: 800,
                          color: "var(--primary)",
                        }}
                      >
                        ₹{product.price.toLocaleString("en-IN")}
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
              Why Choose Us
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "1rem",
                maxWidth: "560px",
                margin: "0 auto",
              }}
            >
              We bring together deep engineering expertise and sustainable innovation
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: <Leaf size={28} />,
                title: "100% Sustainable",
                desc: "Every product is designed with sustainability at its core — from materials to energy efficiency.",
              },
              {
                icon: <Zap size={28} />,
                title: "High Performance",
                desc: "Our solutions deliver industrial-grade performance backed by rigorous testing and validation.",
              },
              {
                icon: <Shield size={28} />,
                title: "Quality Assured",
                desc: "Built to international standards with comprehensive quality control at every stage.",
              },
              {
                icon: <Cpu size={28} />,
                title: "IoT-Enabled",
                desc: "Smart monitoring and data-driven insights built into our systems for maximum efficiency.",
              },
            ].map((item) => (
              <div
                key={item.title}
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
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius)",
                    background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.0625rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 0",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, var(--background)), color-mix(in srgb, var(--secondary) 8%, var(--background)))",
          textAlign: "center",
        }}
      >
        <div className="container" style={{ maxWidth: "640px" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: 800,
              marginBottom: "1rem",
            }}
          >
            Ready to Build the Future?
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            Whether you&apos;re looking for EV components, custom power solutions, or partnership
            opportunities, we&apos;d love to hear from you.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Get in Touch <ArrowRight size={18} />
            </Link>
            <Link href="/about" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
