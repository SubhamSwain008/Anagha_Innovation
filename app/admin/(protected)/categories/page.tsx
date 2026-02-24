"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description: description || undefined }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(editingId ? "Category updated" : "Category created");
        resetForm();
        fetchCategories();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save category");
    }
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete "${catName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Categories</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Manage product categories</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  className="input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(generateSlug(e.target.value));
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Slug</label>
                <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: "60px" }} />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={48} />
          <h3>No categories yet</h3>
          <p>Create your first product category.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ color: "var(--muted)" }}>/{cat.slug}</td>
                  <td>{cat._count.products}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => handleEdit(cat)} className="btn btn-ghost btn-icon btn-sm">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--destructive)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
