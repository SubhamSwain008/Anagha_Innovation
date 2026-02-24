"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, Check, ChevronLeft, ChevronRight, Cpu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { ProductWithRelations } from "@/types";

interface AddToCartButtonProps {
  product: ProductWithRelations;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      price: product.price,
      imageUrl: product.media[0]?.imageUrl || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className="btn btn-primary btn-lg"
      style={{ width: "100%", justifyContent: "center" }}
    >
      {added || inCart ? (
        <>
          <Check size={18} /> {inCart ? "In Cart" : "Added!"}
        </>
      ) : (
        <>
          <ShoppingCart size={18} /> Add to Inquiry Cart
        </>
      )}
    </button>
  );
}

interface MediaGalleryProps {
  media: ProductWithRelations["media"];
  productName: string;
}

export function MediaGallery({ media, productName }: MediaGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (media.length === 0) {
    return (
      <div
        style={{
          height: "400px",
          borderRadius: "var(--radius)",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--background)), color-mix(in srgb, var(--secondary) 8%, var(--background)))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
          border: "1px solid var(--border)",
        }}
      >
        <Cpu size={80} strokeWidth={1} />
      </div>
    );
  }

  return (
    <div>
      {/* Main Image */}
      <div
        style={{
          position: "relative",
          height: "400px",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          marginBottom: "0.75rem",
        }}
      >
        <Image
          src={media[current].imageUrl}
          alt={media[current].altText || productName}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {media.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((p) => (p === 0 ? media.length - 1 : p - 1))}
              className="btn btn-ghost btn-icon"
              style={{
                position: "absolute",
                left: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "color-mix(in srgb, var(--background) 80%, transparent)",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrent((p) => (p === media.length - 1 ? 0 : p + 1))}
              className="btn btn-ghost btn-icon"
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "color-mix(in srgb, var(--background) 80%, transparent)",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {media.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setCurrent(i)}
              style={{
                position: "relative",
                width: "72px",
                height: "72px",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: i === current ? "2px solid var(--primary)" : "1px solid var(--border)",
                cursor: "pointer",
                flexShrink: 0,
                opacity: i === current ? 1 : 0.6,
                transition: "opacity var(--transition)",
              }}
            >
              <Image
                src={m.imageUrl}
                alt={m.altText || `${productName} ${i + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="72px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
