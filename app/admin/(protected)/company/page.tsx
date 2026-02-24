"use client";

import { useState, useEffect } from "react";
import { Save, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink {
  platform: string;
  url: string;
}

export default function AdminCompanyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/admin/company")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const p = d.data;
          setCompanyName(p.companyName || "");
          setTagline(p.tagline || "");
          setDescription(p.description || "");
          setMission(p.mission || "");
          setVision(p.vision || "");
          setAddress(p.address || "");
          setPhone(p.phone || "");
          setEmail(p.email || "");
          setLogoUrl(p.logoUrl || "");
          setFaviconUrl(p.faviconUrl || "");
          setSocialLinks(Array.isArray(p.socialLinks) ? p.socialLinks : []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "favicon") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anagha/branding");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (field === "logo") setLogoUrl(data.data.url);
        else setFaviconUrl(data.data.url);
        toast.success("Image uploaded");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName, tagline, description, mission, vision,
          address, phone, email: email || "", logoUrl, faviconUrl,
          socialLinks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Company profile updated");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: "100px" }} />)}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Company Profile</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Update your company information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>General</h2>
              <div className="form-group">
                <label className="label">Company Name</label>
                <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="label">Tagline</label>
                <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Purpose</h2>
              <div className="form-group">
                <label className="label">Mission</label>
                <textarea className="input textarea" value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
              </div>
              <div className="form-group">
                <label className="label">Vision</label>
                <textarea className="input textarea" value={vision} onChange={(e) => setVision(e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Contact</h2>
              <div className="form-group">
                <label className="label">Address</label>
                <textarea className="input textarea" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Email</label>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: "1rem" }}>Branding</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Logo</label>
                  {logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="Logo" style={{ height: "48px", marginBottom: "0.5rem" }} />
                  )}
                  <label className="btn btn-outline btn-sm" style={{ cursor: uploading ? "wait" : "pointer" }}>
                    <Upload size={14} /> Upload
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "logo")} style={{ display: "none" }} />
                  </label>
                </div>
                <div>
                  <label className="label">Favicon</label>
                  {faviconUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={faviconUrl} alt="Favicon" style={{ height: "32px", marginBottom: "0.5rem" }} />
                  )}
                  <label className="btn btn-outline btn-sm" style={{ cursor: uploading ? "wait" : "pointer" }}>
                    <Upload size={14} /> Upload
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, "favicon")} style={{ display: "none" }} />
                  </label>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontWeight: 700 }}>Social Links</h2>
                <button
                  type="button"
                  onClick={() => setSocialLinks([...socialLinks, { platform: "", url: "" }])}
                  className="btn btn-ghost btn-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {socialLinks.map((link, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      className="input"
                      placeholder="Platform"
                      value={link.platform}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[i] = { ...updated[i], platform: e.target.value };
                        setSocialLinks(updated);
                      }}
                      style={{ flex: 1 }}
                    />
                    <input
                      className="input"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...socialLinks];
                        updated[i] = { ...updated[i], url: e.target.value };
                        setSocialLinks(updated);
                      }}
                      style={{ flex: 2 }}
                    />
                    <button
                      type="button"
                      onClick={() => setSocialLinks(socialLinks.filter((_, idx) => idx !== i))}
                      className="btn btn-ghost btn-icon btn-sm"
                      style={{ color: "var(--destructive)" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
