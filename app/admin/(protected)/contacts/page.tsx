"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
  isReviewed: boolean;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchContacts = async () => {
    try {
      const params = new URLSearchParams({ pageSize: "50" });
      if (filter) params.set("reviewed", filter);

      const res = await fetch(`/api/admin/contacts?${params}`);
      const data = await res.json();
      if (data.success) setContacts(data.data.items);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const markReviewed = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        toast.success("Marked as reviewed");
        fetchContacts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted");
        fetchContacts();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Contact Submissions</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>View and manage contact inquiries</p>
        </div>
        <select
          className="input select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: "auto" }}
        >
          <option value="">All</option>
          <option value="false">Unreviewed</option>
          <option value="true">Reviewed</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: "100px" }} />)}
        </div>
      ) : contacts.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={48} />
          <h3>No contact submissions</h3>
          <p>Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="card"
              style={{
                borderLeft: contact.isReviewed
                  ? "3px solid var(--success)"
                  : "3px solid var(--accent)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{contact.name}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.8125rem", marginLeft: "0.75rem" }}>{contact.email}</span>
                  {contact.phone && (
                    <span style={{ color: "var(--muted)", fontSize: "0.8125rem", marginLeft: "0.75rem" }}>{contact.phone}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                  {!contact.isReviewed && (
                    <span className="badge badge-accent" style={{ marginRight: "0.5rem" }}>NEW</span>
                  )}
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                {contact.message}
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {!contact.isReviewed && (
                  <button onClick={() => markReviewed(contact.id)} className="btn btn-ghost btn-sm" style={{ color: "var(--success)" }}>
                    <Check size={14} /> Mark Reviewed
                  </button>
                )}
                <button onClick={() => deleteContact(contact.id)} className="btn btn-ghost btn-sm" style={{ color: "var(--destructive)" }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
