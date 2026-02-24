"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Users, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  roleType: string;
  bio: string | null;
  linkedInUrl: string | null;
  imageUrl: string | null;
  order: number;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [roleType, setRoleType] = useState("CORE_TEAM");
  const [bio, setBio] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      if (data.success) setMembers(data.data);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => {
    setName(""); setDesignation(""); setRoleType("CORE_TEAM");
    setBio(""); setLinkedInUrl(""); setImageUrl(""); setOrder(0);
    setEditingId(null); setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anagha/team");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, designation, roleType, bio: bio || undefined,
          linkedInUrl: linkedInUrl || "", imageUrl: imageUrl || undefined, order,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? "Member updated" : "Member added");
        resetForm();
        fetchMembers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save team member");
    }
  };

  const handleEdit = (m: TeamMember) => {
    setName(m.name); setDesignation(m.designation); setRoleType(m.roleType);
    setBio(m.bio || ""); setLinkedInUrl(m.linkedInUrl || "");
    setImageUrl(m.imageUrl || ""); setOrder(m.order);
    setEditingId(m.id); setShowForm(true);
  };

  const handleDelete = async (id: string, mName: string) => {
    if (!confirm(`Delete "${mName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Member removed");
        fetchMembers();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Team</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Manage team members</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn btn-primary">
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>{editingId ? "Edit Member" : "New Member"}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="label">Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="label">Designation</label>
                <input className="input" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="label">Role Type</label>
                <select className="input select" value={roleType} onChange={(e) => setRoleType(e.target.value)}>
                  <option value="ADVISOR">Advisor</option>
                  <option value="CORE_TEAM">Core Team</option>
                  <option value="DIRECTOR">Director</option>
                  <option value="MENTOR">Mentor</option>
                  <option value="ENGINEER">Engineer</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Order</label>
                <input className="input" type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Bio</label>
              <textarea className="input textarea" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
            </div>
            <div className="form-group">
              <label className="label">LinkedIn URL</label>
              <input className="input" value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="form-group">
              <label className="label">Profile Image</label>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Preview" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", marginBottom: "0.5rem" }} />
              )}
              <label className="btn btn-outline btn-sm" style={{ cursor: uploading ? "wait" : "pointer" }}>
                <Upload size={14} /> {uploading ? "Uploading..." : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" className="btn btn-primary">{editingId ? "Update" : "Create"}</button>
              <button type="button" onClick={resetForm} className="btn btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: "60px" }} />)}
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>No team members yet</h3>
          <p>Add your first team member.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Member</th><th>Role</th><th>Order</th><th>Actions</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--muted-bg)", overflow: "hidden", flexShrink: 0 }}>
                        {m.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.imageUrl} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{m.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-primary">{m.roleType}</span></td>
                  <td>{m.order}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => handleEdit(m)} className="btn btn-ghost btn-icon btn-sm"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(m.id, m.name)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--destructive)" }}><Trash2 size={14} /></button>
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
