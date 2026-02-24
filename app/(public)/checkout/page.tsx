"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Send, Loader2, CheckCircle, ArrowLeft, Cpu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { items, totalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      message: `[INQUIRY / RFQ]\n\nProducts:\n${items
        .map(
          (i) =>
            `• ${i.name} (Qty: ${i.quantity})${
              i.price !== null ? ` — ₹${i.price.toLocaleString("en-IN")} each` : ""
            }`
        )
        .join("\n")}\n\nAdditional Notes:\n${fd.get("notes") || "None"}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      toast.success("Inquiry submitted successfully!");
      clearCart();
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section style={{ padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "color-mix(in srgb, var(--primary) 15%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "var(--primary)",
            }}
          >
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontWeight: 900, fontSize: "2rem", marginBottom: "0.75rem" }}>
            Inquiry Submitted!
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Thank you for your interest. Our team will review your request and get back to you
            within 24-48 business hours with confirmed pricing and availability.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/products" className="btn btn-outline">
              Browse More Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section style={{ padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "500px", textAlign: "center" }}>
          <div className="empty-state">
            <Send size={48} strokeWidth={1} />
            <h3>No items in cart</h3>
            <p>Add products to your cart before proceeding to checkout.</p>
            <Link href="/products" className="btn btn-primary btn-sm">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        style={{
          padding: "3rem 0 2rem",
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--primary) 5%, var(--background)), var(--background))",
        }}
      >
        <div className="container">
          <Link
            href="/cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.875rem",
              color: "var(--primary)",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={14} /> Back to Cart
          </Link>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 900,
            }}
          >
            Checkout
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>
            Submit your inquiry to receive a formal quote
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "2.5rem",
            }}
            className="md:grid-cols-2"
          >
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
                padding: "2rem",
                background: "var(--card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "0.25rem" }}>
                Your Details
              </h2>

              <div>
                <label
                  htmlFor="name"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.375rem",
                    display: "block",
                  }}
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="input"
                  placeholder="Your full name"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.375rem",
                      display: "block",
                    }}
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="input"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      marginBottom: "0.375rem",
                      display: "block",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="input"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.375rem",
                    display: "block",
                  }}
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  className="input"
                  rows={4}
                  placeholder="Any specific requirements, customization needs, or questions..."
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ justifyContent: "center" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Submit Inquiry
                  </>
                )}
              </button>
            </form>

            {/* Order Summary */}
            <div>
              <div
                className="card"
                style={{ padding: "1.5rem" }}
              >
                <h2 style={{ fontWeight: 800, fontSize: "1.125rem", marginBottom: "1.25rem" }}>
                  Order Summary
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "48px",
                          height: "48px",
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
                            sizes="48px"
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
                            <Cpu size={20} strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.8125rem" }}>{item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                          Qty: {item.quantity}
                          {item.price !== null && ` — ₹${(item.price * item.quantity).toLocaleString("en-IN")}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Total Items</span>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{totalItems}</span>
                </div>
                {items.some((i) => i.price !== null) && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Est. Total</span>
                    <span style={{ fontWeight: 900, color: "var(--primary)", fontSize: "1.125rem" }}>
                      ₹
                      {items
                        .reduce((s, i) => s + (i.price || 0) * i.quantity, 0)
                        .toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                    marginTop: "1rem",
                    padding: "0.75rem",
                    background: "var(--background)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  This is a Request for Quotation (RFQ). No payment is collected at this stage.
                  Our team will verify availability and provide final pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
