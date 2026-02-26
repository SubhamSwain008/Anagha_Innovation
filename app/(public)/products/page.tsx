import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Filter, Zap, Shield, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStatusLabel, getStatusColor, truncate } from "@/lib/utils";
import PageAnimations from "@/components/animations/PageAnimations";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our portfolio of green energy and EV technology products — from BLDC motors and solar chargers to battery management systems.",
};

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; status?: string; page?: string; q?: string }>;
}

const PAGE_SIZE = 12;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categorySlug = params.category || "";
  const statusFilter = params.status || "";
  const query = params.q || "";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (statusFilter) {
    where.status = statusFilter;
  }
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { shortDescription: { contains: query, mode: "insensitive" } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let products: any[] = [];
  let total = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = [];

  try {
    [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          media: { take: 1, orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
      prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch (err) {
    console.warn("ProductsPage: database unavailable:", (err as any)?.message ?? err);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams();
    if (categorySlug) p.set("category", categorySlug);
    if (statusFilter) p.set("status", statusFilter);
    if (query) p.set("q", query);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v);
      else p.delete(k);
    });
    const qs = p.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <PageAnimations>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="page-hero noise-bg"
        style={{
          padding: "4rem 0 3rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 6%, var(--background)), var(--background))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          className="parallax-blob animate-morph-blob"
          style={{
            position: "absolute",
            top: "-25%",
            right: "-8%",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 8%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
            <Sparkles size={14} /> Catalog
          </span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Our Products
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            Cutting-edge solutions in green energy and EV technology
          </p>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────── */}
      <section
        className="glass-strong"
        style={{
          padding: "1.25rem 0",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "var(--header-height)",
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <Filter size={16} style={{ color: "var(--muted)" }} />

          {/* Category pills */}
          <Link
            href={buildUrl({ category: "", page: "" })}
            className={`btn btn-sm ${!categorySlug ? "btn-primary" : "btn-ghost"}`}
            style={{ borderRadius: "9999px" }}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.slug, page: "" })}
              className={`btn btn-sm ${categorySlug === cat.slug ? "btn-primary" : "btn-ghost"}`}
              style={{ borderRadius: "9999px" }}
            >
              {cat.name}
            </Link>
          ))}

          {/* Search + Status filter */}
          <form
            method="get"
            action="/products"
            style={{ display: "flex", gap: "0.5rem", marginLeft: "auto", alignItems: "center" }}
          >
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

            <select
              name="status"
              defaultValue={statusFilter}
              className="input"
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.8125rem",
                width: "auto",
              }}
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="PROTOTYPE">Prototype</option>
              <option value="UNDER_DEVELOPMENT">Under Development</option>
            </select>

            <input
              name="q"
              type="search"
              placeholder="Search products..."
              defaultValue={query}
              className="input"
              style={{ width: "200px", height: "34px", fontSize: "0.8125rem", borderRadius: "9999px" }}
            />
          </form>

          <span
            className="badge"
            style={{
              background: "color-mix(in srgb, var(--primary) 10%, transparent)",
              color: "var(--primary)",
              fontSize: "0.75rem",
            }}
          >
            {total} product{total !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID ─────────────────────────────────── */}
      <section style={{ padding: "3.5rem 0" }}>
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state gsap-fade-in">
              <Cpu size={48} strokeWidth={1} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query.</p>
              <Link href="/products" className="btn btn-primary btn-sm" style={{ marginTop: "1rem" }}>
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div
                className="gsap-stagger-parent"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "1.75rem",
                }}
              >
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="card tilt-card gsap-stagger-child"
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "1.125rem",
                          margin: "0.5rem 0",
                          lineHeight: 1.3,
                        }}
                      >
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
                          {truncate(product.shortDescription, 120)}
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
                        {product.voltageRange && (
                          <span>
                            <strong>Voltage:</strong> {product.voltageRange}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination gsap-fade-in" style={{ marginTop: "3rem" }}>
                  {currentPage > 1 && (
                    <Link
                      href={buildUrl({ page: String(currentPage - 1) })}
                      className="btn btn-ghost btn-sm"
                      style={{ borderRadius: "9999px" }}
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={buildUrl({ page: String(page) })}
                        className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-ghost"}`}
                        style={{ borderRadius: "9999px" }}
                      >
                        {page}
                      </Link>
                    )
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={buildUrl({ page: String(currentPage + 1) })}
                      className="btn btn-ghost btn-sm"
                      style={{ borderRadius: "9999px" }}
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageAnimations>
  );
}
