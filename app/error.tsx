"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--destructive) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "var(--destructive)",
          }}
        >
          <AlertOctagon size={36} />
        </div>
        <h1 style={{ fontWeight: 900, fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          Something Went Wrong
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            maxWidth: "400px",
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          An unexpected error occurred. Please try again or return to the home page.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button onClick={reset} className="btn btn-primary">
            <RefreshCw size={16} /> Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            <Home size={16} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
