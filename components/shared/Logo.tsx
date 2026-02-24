import Link from "next/link";
import { Leaf } from "lucide-react";

interface LogoProps {
  companyName?: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ companyName = "Anagha Innovation", logoUrl, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 28, text: "text-xl" },
    lg: { icon: 36, text: "text-2xl" },
  };

  const s = sizes[size];

  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt={companyName}
          style={{ height: s.icon, width: "auto" }}
        />
      ) : (
        <Leaf size={s.icon} style={{ color: "var(--primary)" }} />
      )}
      <span
        className={s.text}
        style={{
          fontWeight: 800,
          color: "var(--foreground)",
          letterSpacing: "-0.025em",
        }}
      >
        {companyName}
      </span>
    </Link>
  );
}
