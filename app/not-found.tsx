import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFound() {
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
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            color: "var(--accent)",
          }}
        >
          <AlertTriangle size={36} />
        </div>
        <h1
          style={{
            fontSize: "5rem",
            fontWeight: 900,
            color: "var(--primary)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          404
        </h1>
        <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.75rem" }}>
          Page Not Found
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            maxWidth: "400px",
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on
          track.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <Link href="/products" className="btn btn-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
