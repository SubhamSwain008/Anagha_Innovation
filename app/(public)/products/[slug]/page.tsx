import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStatusLabel, getStatusColor } from "@/lib/utils";
import AddToCartButton, { MediaGallery } from "./ProductClient";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true, media: { take: 1, orderBy: { order: "asc" } } },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription || `Explore ${product.name} by Anagha Innovation`,
    openGraph: {
      title: product.name,
      description: product.shortDescription || undefined,
      images: product.media[0]?.imageUrl ? [product.media[0].imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      architecture: true,
      features: { orderBy: { order: "asc" } },
      specifications: { orderBy: { order: "asc" } },
      media: { orderBy: { order: "asc" } },
    },
  });

  if (!product) return notFound();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.fullDescription || "",
    image: product.media.map((m) => m.imageUrl),
    brand: {
      "@type": "Organization",
      name: "Anagha Innovation",
    },
    category: product.category?.name,
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability:
          product.status === "AVAILABLE"
            ? "https://schema.org/InStock"
            : "https://schema.org/PreOrder",
      },
    }),
  };

  const quickSpecs = [
    { label: "Power Rating", value: product.powerRating },
    { label: "Voltage Range", value: product.voltageRange },
    { label: "Efficiency", value: product.efficiency },
    { label: "RPM", value: product.rpm },
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
  ].filter((s) => s.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ padding: "2rem 0 4rem" }}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8125rem",
              color: "var(--muted)",
              marginBottom: "2rem",
            }}
          >
            <Link
              href="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                color: "var(--primary)",
              }}
            >
              <ArrowLeft size={14} /> Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  style={{ color: "var(--primary)" }}
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span style={{ color: "var(--foreground)" }}>{product.name}</span>
          </nav>

          {/* Product Layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "3rem",
            }}
            className="md:grid-cols-2"
          >
            {/* Gallery */}
            <MediaGallery media={product.media} productName={product.name} />

            {/* Info */}
            <div>
              <div style={{ marginBottom: "1rem" }}>
                {product.category && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--primary)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {product.category.name}
                  </Link>
                )}
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: "0.75rem",
                }}
              >
                {product.name}
              </h1>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}
              >
                <span
                  className="badge"
                  style={{
                    background: getStatusColor(product.status),
                    color: "white",
                  }}
                >
                  {getStatusLabel(product.status)}
                </span>
                {product.price !== null && (
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 900,
                      color: "var(--primary)",
                    }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {product.shortDescription && (
                <p
                  style={{
                    fontSize: "1rem",
                    color: "var(--muted)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  {product.shortDescription}
                </p>
              )}

              {/* Quick Specs inline */}
              {quickSpecs.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {quickSpecs.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        padding: "0.75rem",
                        background: "var(--card)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.6875rem",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <AddToCartButton product={product} />

              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  marginTop: "0.75rem",
                  textAlign: "center",
                }}
              >
                <Tag size={12} style={{ display: "inline", verticalAlign: "middle" }} /> This is
                an inquiry-based system. We&apos;ll review your cart as an RFQ.
              </p>
            </div>
          </div>

          {/* ── Full Description ──────────────────────────── */}
          {product.fullDescription && (
            <div
              style={{
                marginTop: "3rem",
                padding: "2rem",
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Product Description
              </h2>
              <div
                style={{
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  color: "var(--foreground)",
                }}
              >
                {product.fullDescription.split("\n").map((p, i) => (
                  <p key={i} style={{ marginBottom: "1rem" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* ── Architecture ─────────────────────────────── */}
          {product.architecture && (product.architecture.imageUrl || product.architecture.description) && (
            <div
              style={{
                marginTop: "2rem",
                padding: "2rem",
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h2 style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: "1.25rem" }}>Product Architecture</h2>
              {product.architecture.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.architecture.imageUrl} alt={`${product.name} architecture`} style={{ width: "100%", borderRadius: "var(--radius)", marginBottom: "1rem" }} />
              )}
              {product.architecture.description && (
                <div style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--foreground)" }}>
                  {product.architecture.description.split("\n").map((p, i) => (
                    <p key={i} style={{ marginBottom: "1rem" }}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Features ─────────────────────────────────── */}
          {product.features.length > 0 && (
            <div
              style={{
                marginTop: "2rem",
                padding: "2rem",
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Key Features
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {product.features.map((feat) => (
                  <div
                    key={feat.id}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      padding: "1rem",
                      borderRadius: "var(--radius)",
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }}
                    />
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                        {feat.title}
                      </h4>
                      {feat.description && (
                        <p style={{ fontSize: "0.8125rem", color: "var(--muted)", lineHeight: 1.6 }}>
                          {feat.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Specifications Table ─────────────────────── */}
          {product.specifications.length > 0 && (
            <div
              style={{
                marginTop: "2rem",
                padding: "2rem",
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  marginBottom: "1.25rem",
                }}
              >
                Technical Specifications
              </h2>
              <table className="spec-table" style={{ width: "100%" }}>
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr
                      key={spec.id}
                      style={{
                        background: i % 2 === 0 ? "var(--background)" : "transparent",
                      }}
                    >
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          width: "40%",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {spec.specKey}
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.875rem",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        {spec.specValue}
                        {spec.unit && (
                          <span style={{ color: "var(--muted)", marginLeft: "0.25rem" }}>
                            {spec.unit}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
