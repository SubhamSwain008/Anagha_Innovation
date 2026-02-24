"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  category: { name: string } | null;
  media: { imageUrl: string }[];
  _count: { features: number; specifications: number };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "10" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data.items);
        setTotalPages(data.data.totalPages);
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Products</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
          <input
            className="input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.25rem" }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "60px", width: "100%" }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No products found</h3>
          <p>Add your first product to get started.</p>
          <Link href="/admin/products/new" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Specs</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "var(--radius)",
                            background: "var(--muted-bg)",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {product.media[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.media[0].imageUrl}
                              alt={product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.category?.name || "—"}</td>
                    <td>
                      <span className={`badge ${product.status === "AVAILABLE" ? "badge-primary" : product.status === "PROTOTYPE" ? "badge-accent" : "badge-secondary"}`}>
                        {product.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8125rem", color: "var(--muted)" }}>
                      {product._count.specifications} specs, {product._count.features} features
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <Link href={`/admin/products/${product.id}/edit`} className="btn btn-ghost btn-icon btn-sm">
                          <Edit size={14} />
                        </Link>
                        <button onClick={() => handleDelete(product.id, product.name)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--destructive)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
