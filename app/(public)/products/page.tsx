import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStatusLabel, getStatusColor, truncate } from "@/lib/utils";

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

  const [products, total, categories] = await Promise.all([
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
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "3rem 0 2rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--background)), var(--background))",
        }}
      >
        <div className="container">
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900,
              marginBottom: "0.5rem",
            }}
          >
            Our Products
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.0625rem" }}>
            Cutting-edge solutions in green energy and EV technology
          </p>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────── */}
      <section
        style={{
          padding: "1.5rem 0",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "var(--header-height)",
          background: "var(--background)",
          zIndex: 10,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Filter size={16} style={{ color: "var(--muted)" }} />

          {/* Category pills */}
          <Link
            href={buildUrl({ category: "", page: "" })}
            className={`btn btn-sm ${!categorySlug ? "btn-primary" : "btn-ghost"}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={buildUrl({ category: cat.slug, page: "" })}
              className={`btn btn-sm ${categorySlug === cat.slug ? "btn-primary" : "btn-ghost"}`}
            >
              {cat.name}
            </Link>
          ))}

          {/* Search + Status filter (GET form) */}
          <form
            method="get"
            action="/products"
            style={{ display: "flex", gap: "0.5rem", marginLeft: "auto", alignItems: "center" }}
          >
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}

            <select
              name="status"
              defaultValue={statusFilter}
              style={{
                padding: "0.375rem 0.75rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--background)",
                color: "var(--foreground)",
                fontSize: "0.8125rem",
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
              style={{ width: "200px", height: "34px", fontSize: "0.8125rem" }}
            />
          </form>

          <span style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
            {total} product{total !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* ── PRODUCT GRID ─────────────────────────────────── */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          {products.length === 0 ? (
            <div className="empty-state">
              <Cpu size={48} strokeWidth={1} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query.</p>
              <Link href="/products" className="btn btn-primary btn-sm">
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="card"
                    style={{
                      overflow: "hidden",
                      transition: "transform var(--transition)",
                    }}
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
                          <Cpu size={48} strokeWidth={1} />
                        </div>
                      )}
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
                      <h3
                        style={{
                          fontWeight: 700,
                          fontSize: "1.0625rem",
                          margin: "0.375rem 0",
                        }}
                      >
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
                          <span>
                            <strong>Power:</strong> {product.powerRating}
                          </span>
                        )}
                        {product.efficiency && (
                          <span>
                            <strong>Eff:</strong> {product.efficiency}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination" style={{ marginTop: "3rem" }}>
                  {currentPage > 1 && (
                    <Link
                      href={buildUrl({ page: String(currentPage - 1) })}
                      className="btn btn-ghost btn-sm"
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
                      >
                        {page}
                      </Link>
                    )
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={buildUrl({ page: String(currentPage + 1) })}
                      className="btn btn-ghost btn-sm"
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
    </>
  );
}
