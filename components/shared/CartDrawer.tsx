"use client";

import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={closeCart} />
      <div className="drawer">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h2 style={{ fontWeight: 700, fontSize: "1.125rem" }}>
            Cart ({totalItems})
          </h2>
          <button onClick={closeCart} className="btn btn-ghost btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflow: "auto", padding: "1rem 1.5rem" }}>
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: "3rem 1rem" }}>
              <ShoppingBag size={48} />
              <h3>Your cart is empty</h3>
              <p>Browse our products and add items to get started.</p>
              <Link href="/products" onClick={closeCart} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                >
                  {/* Image placeholder */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      background: "var(--muted-bg)",
                      borderRadius: "var(--radius)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius)" }}
                      />
                    ) : (
                      <ShoppingBag size={24} style={{ color: "var(--muted)" }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      style={{ fontWeight: 600, fontSize: "0.875rem", display: "block", marginBottom: "0.25rem" }}
                    >
                      {item.name}
                    </Link>
                    <div style={{ fontSize: "0.8125rem", color: "var(--muted)", marginBottom: "0.5rem" }}>
                      {item.price ? `₹${item.price.toLocaleString()}` : "Price on request"}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ width: "28px", height: "28px", border: "1px solid var(--border)" }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", minWidth: "24px", textAlign: "center" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ width: "28px", height: "28px", border: "1px solid var(--border)" }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ width: "28px", height: "28px", marginLeft: "auto", color: "var(--destructive)" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontWeight: 700,
                fontSize: "1.0625rem",
              }}
            >
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn btn-outline"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
