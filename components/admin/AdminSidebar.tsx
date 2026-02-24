"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Users,
  Building2,
  MessageSquare,
  LogOut,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/company", label: "Company", icon: Building2 },
  { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <aside
      style={{
        width: collapsed ? "64px" : "256px",
        background: "var(--card)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width var(--transition)",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "1rem 0.5rem" : "1.5rem 1rem",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <Leaf size={24} style={{ color: "var(--primary)", flexShrink: 0 }} />
        {!collapsed && (
          <span style={{ fontWeight: 800, fontSize: "0.9375rem", whiteSpace: "nowrap" }}>
            Admin Panel
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: collapsed ? "0.75rem" : "0.75rem 1rem",
                borderRadius: "var(--radius)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--primary)" : "var(--foreground)",
                background: isActive ? "var(--primary-light)" : "transparent",
                transition: "all var(--transition)",
                justifyContent: collapsed ? "center" : "flex-start",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0.5rem", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost"
          style={{
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "0.75rem",
            marginBottom: "0.25rem",
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && "Collapse"}
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{
            width: "100%",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "0.75rem",
            color: "var(--destructive)",
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
