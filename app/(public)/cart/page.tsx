"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Cpu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <section
          style={{
            padding: "4rem 0 3rem",
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--background)), var(--background))",
          }}
        >
          <div className="container">
            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 900,
              }}
            >
              Inquiry Cart
            </h1>
          </div>
        </section>
        <section style={{ padding: "4rem 0" }}>
          <div className="container">
            <div className="empty-state">
              <ShoppingCart size={56} strokeWidth={1} />
              <h3>Your cart is empty</h3>
              <p>Browse our products and add items to your inquiry cart.</p>
              <Link href="/products" className="btn btn-primary btn-sm">
                View Products
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

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
            Inquiry Cart
          </h1>
          <p style={{ color: "var(--muted)" }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </section>

      {/* ── CART TABLE ────────────────────────────────────── */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2rem",
            }}
            className="lg:grid-cols-3"
          >
            {/* Items */}
            <div style={{ gridColumn: "span 2" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      gap: "1.25rem",
                      alignItems: "center",
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        borderRadius: "var(--radius)",
                        overflow: "hidden",
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        flexShrink: 0,
                      }}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="80px"
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
                          <Cpu size={28} strokeWidth={1} />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/products/${item.slug}`}
                        style={{ fontWeight: 700, fontSize: "0.9375rem" }}
                      >
                        {item.name}
                      </Link>
                      {item.shortDescription && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                            marginTop: "0.25rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.shortDescription}
                        </p>
                      )}
                      {item.price !== null && (
                        <p
                          style={{
                            fontSize: "0.9375rem",
                            fontWeight: 800,
                            color: "var(--primary)",
                            marginTop: "0.375rem",
                          }}
                        >
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "0.25rem",
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-ghost btn-icon"
                        style={{ width: "28px", height: "28px" }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        style={{
                          width: "32px",
                          textAlign: "center",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-ghost btn-icon"
                        style={{ width: "28px", height: "28px" }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn btn-ghost btn-icon"
                      style={{ color: "var(--destructive)" }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
                <Link href="/products" className="btn btn-ghost btn-sm">
                  Continue Browsing
                </Link>
                <button onClick={clearCart} className="btn btn-ghost btn-sm" style={{ color: "var(--destructive)" }}>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div
                className="card"
                style={{
                  padding: "1.5rem",
                  position: "sticky",
                  top: "calc(var(--header-height) + 2rem)",
                }}
              >
                <h3 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                  Cart Summary
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                    <span style={{ color: "var(--muted)" }}>Items</span>
                    <span style={{ fontWeight: 600 }}>{totalItems}</span>
                  </div>
                  {items.some((i) => i.price !== null) && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--muted)" }}>Estimated Total</span>
                      <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                        ₹
                        {items
                          .reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)
                          .toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                    marginBottom: "1rem",
                  }}
                >
                  This is an inquiry-based system. Pricing is indicative. Our team will confirm
                  final pricing and availability after review.
                </p>
                <Link
                  href="/checkout"
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
