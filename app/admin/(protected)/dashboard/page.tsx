import { prisma } from "@/lib/prisma";
import { Package, FolderOpen, Users, MessageSquare, Zap, TrendingUp } from "lucide-react";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, teamCount, contactCount, unreviewedCount] =
    await Promise.all([
      prisma.product.count(),
      prisma.productCategory.count(),
      prisma.teamMember.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { isReviewed: false } }),
    ]);

  const recentContacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true },
  });

  const stats = [
    { label: "Products", value: productCount, icon: Package, color: "var(--primary)" },
    { label: "Categories", value: categoryCount, icon: FolderOpen, color: "var(--secondary)" },
    { label: "Team Members", value: teamCount, icon: Users, color: "var(--accent)" },
    { label: "Contact Queries", value: contactCount, icon: MessageSquare, color: "var(--info)" },
    { label: "Unreviewed", value: unreviewedCount, icon: Zap, color: "var(--warning)" },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          Overview of your website data
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  background: stat.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={22} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Recent Products */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <TrendingUp size={18} style={{ color: "var(--primary)" }} />
            <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Recent Products</h2>
          </div>
          {recentProducts.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No products yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem" }}>{product.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                      {product.category?.name || "Uncategorized"}
                    </div>
                  </div>
                  <span className={`badge ${product.status === "AVAILABLE" ? "badge-primary" : product.status === "PROTOTYPE" ? "badge-accent" : "badge-secondary"}`}>
                    {product.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <MessageSquare size={18} style={{ color: "var(--secondary)" }} />
            <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Recent Inquiries</h2>
          </div>
          {recentContacts.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No contacts yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  style={{
                    padding: "0.5rem 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{contact.name}</span>
                    {!contact.isReviewed && (
                      <span className="badge badge-accent" style={{ fontSize: "0.625rem" }}>NEW</span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.125rem" }}>
                    {contact.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
