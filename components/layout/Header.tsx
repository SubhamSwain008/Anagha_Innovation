"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, Sun, Moon, Home, Info, Box, Users, Mail } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { CompanyProfileData } from "@/types";

interface HeaderProps {
  company: CompanyProfileData | null;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/products", label: "Products", icon: Box },
  { href: "/team", label: "Team", icon: Users },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Header({ company }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onResize = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "var(--background)",
        borderBottom: "1px solid var(--border)",
        height: "var(--header-height)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <Logo
          companyName={company?.companyName || "Anagha Innovation"}
          logoUrl={company?.logoUrl}
        />

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            {navLinks.map((link) => {
            const Icon = link.icon as any;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  transition: "color var(--transition)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
            })}
          </nav>
        )}

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={toggleCart}
            className="btn btn-ghost btn-icon"
            style={{ position: "relative" }}
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.625rem",
                  fontWeight: 700,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-icon"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          style={{
            position: "absolute",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            background: "var(--background)",
            borderBottom: "1px solid var(--border)",
            padding: "1rem",
            zIndex: 29,
          }}
          className="md:hidden animate-fadeIn"
        >
          {navLinks.map((link) => {
            const Icon = link.icon as any;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  borderRadius: "var(--radius)",
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
