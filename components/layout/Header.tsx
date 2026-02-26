"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, Sun, Moon, Home, Info, Box, Users, Mail } from "lucide-react";
import gsap from "gsap";
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
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    const onResize = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Scroll-based header styling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate mobile nav open/close
  useEffect(() => {
    if (mobileNavRef.current) {
      if (mobileOpen) {
        gsap.fromTo(
          mobileNavRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
        // Stagger links
        const links = mobileNavRef.current.querySelectorAll("a");
        gsap.fromTo(
          links,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out", delay: 0.1 }
        );
      }
    }
  }, [mobileOpen]);

  // Animate cart badge bounce on change
  useEffect(() => {
    if (totalItems !== prevTotalItems.current && cartBadgeRef.current && totalItems > 0) {
      gsap.fromTo(
        cartBadgeRef.current,
        { scale: 1.6 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }
      );
    }
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <header
      ref={headerRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: "var(--header-height)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: scrolled
          ? "color-mix(in srgb, var(--background) 85%, transparent)"
          : "var(--background)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
        <Logo
          companyName={company?.companyName || "Anagha Innovation"}
          logoUrl={company?.logoUrl}
        />

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {navLinks.map((link) => {
            const Icon = link.icon as any;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="hover-underline"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  transition: "color 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius)",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--foreground)")}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
            })}
          </nav>
        )}

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label="Toggle theme"
            style={{ borderRadius: "50%" }}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={toggleCart}
            className="btn btn-ghost btn-icon"
            style={{ position: "relative", borderRadius: "50%" }}
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span
                ref={cartBadgeRef}
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                  color: "white",
                  fontSize: "0.5625rem",
                  fontWeight: 700,
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
              style={{ borderRadius: "50%" }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div
          ref={mobileNavRef}
          style={{
            position: "absolute",
            top: "var(--header-height)",
            left: 0,
            right: 0,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "color-mix(in srgb, var(--background) 92%, transparent)",
            borderBottom: "1px solid var(--border)",
            padding: "0.75rem",
            zIndex: 29,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
          className="md:hidden"
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
                  padding: "0.875rem 1rem",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  borderRadius: "var(--radius)",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 8%, transparent)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
