"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  productId?: string;
}

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Product fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<string>("PROTOTYPE");
  const [powerRating, setPowerRating] = useState("");
  const [voltageRange, setVoltageRange] = useState("");
  const [efficiency, setEfficiency] = useState("");
  const [rpm, setRpm] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [price, setPrice] = useState("");

  // Related data
  const [features, setFeatures] = useState<{ id?: string; title: string; description: string; order: number }[]>([]);
  const [specs, setSpecs] = useState<{ id?: string; specKey: string; specValue: string; unit: string; order: number }[]>([]);
  const [media, setMedia] = useState<{ id?: string; imageUrl: string; publicId: string | null; altText: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [architectureImageUrl, setArchitectureImageUrl] = useState("");
  const [architectureDescription, setArchitectureDescription] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => {
      if (d.success) setCategories(d.data);
    });
  }, []);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`);
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        setName(p.name);
        setSlug(p.slug);
        setShortDescription(p.shortDescription || "");
        setFullDescription(p.fullDescription || "");
        setCategoryId(p.categoryId || "");
        setStatus(p.status);
        setPowerRating(p.powerRating || "");
        setVoltageRange(p.voltageRange || "");
        setEfficiency(p.efficiency || "");
        setRpm(p.rpm || "");
        setWeight(p.weight || "");
        setDimensions(p.dimensions || "");
        setPrice(p.price ? String(p.price) : "");
        setFeatures(p.features || []);
        setSpecs(p.specifications || []);
        setMedia(p.media || []);
        setArchitectureImageUrl(p.architecture?.imageUrl || "");
        setArchitectureDescription(p.architecture?.description || "");
      }
    } catch {
      toast.error("Failed to load product");
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) setSlug(generateSlug(val));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        name,
        slug,
        shortDescription: shortDescription || undefined,
        fullDescription: fullDescription || undefined,
        categoryId: categoryId || null,
        status,
        powerRating: powerRating || null,
        voltageRange: voltageRange || null,
        efficiency: efficiency || null,
        rpm: rpm || null,
        weight: weight || null,
        dimensions: dimensions || null,
        price: price ? parseFloat(price) : null,
        architecture: architectureImageUrl || architectureDescription ? { imageUrl: architectureImageUrl || undefined, description: architectureDescription || undefined } : undefined,
      };

      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      const data = await res.json();

      if (!data.success) {
        toast.error(data.error);
        return;
      }

      const pid = data.data.id;

      // Save features (only new ones without id)
      for (const feature of features.filter((f) => !f.id)) {
        await fetch(`/api/admin/products/${pid}/features`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feature),
        });
      }

      // Save specs (only new ones without id)
      for (const spec of specs.filter((s) => !s.id)) {
        await fetch(`/api/admin/products/${pid}/specifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(spec),
        });
      }

      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anagha/products");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        const newMedia = { imageUrl: data.data.url, publicId: data.data.publicId, altText: name };

        if (productId) {
          // Save to DB immediately if editing
          await fetch(`/api/admin/products/${productId}/media`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMedia),
          });
          loadProduct();
        } else {
          setMedia([...media, newMedia]);
        }
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

  const handleArchitectureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "anagha/product-architecture");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        const url = data.data.url;
        setArchitectureImageUrl(url);
        toast.success("Architecture image uploaded");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async (index: number) => {
    const m = media[index];
    if (m.id && productId) {
      await fetch(`/api/admin/products/${productId}/media?mediaId=${m.id}`, { method: "DELETE" });
    }
    setMedia(media.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const removeFeature = async (index: number) => {
    const f = features[index];
    if (f.id && productId) {
      await fetch(`/api/admin/products/${productId}/features?featureId=${f.id}`, { method: "DELETE" });
    }
    setFeatures(features.filter((_, i) => i !== index));
  };

  const removeSpec = async (index: number) => {
    const s = specs[index];
    if (s.id && productId) {
      await fetch(`/api/admin/products/${productId}/specifications?specId=${s.id}`, { method: "DELETE" });
    }
    setSpecs(specs.filter((_, i) => i !== index));
  };

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: "1.5rem" }}>
        <Link href="/admin/products" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>
          {isEdit ? "Edit Product" : "New Product"}
        </h1>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Basic Info */}
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Basic Information</h2>
              <div className="form-group">
                <label className="label">Product Name</label>
                <input className="input" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="label">Slug</label>
                <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="label">Short Description</label>
                <textarea className="input textarea" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
              </div>
              <div className="form-group">
                <label className="label">Full Description</label>
                <textarea className="input textarea" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} rows={5} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="label">Category</label>
                  <select className="input select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select className="input select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="PROTOTYPE">Prototype</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="UNDER_DEVELOPMENT">Under Development</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="label">Price (₹)</label>
                <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            {/* Technical Specs Quick Fields */}
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Quick Technical Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="label">Power Rating</label>
                  <input className="input" value={powerRating} onChange={(e) => setPowerRating(e.target.value)} placeholder="e.g., 3000W" />
                </div>
                <div className="form-group">
                  <label className="label">Voltage Range</label>
                  <input className="input" value={voltageRange} onChange={(e) => setVoltageRange(e.target.value)} placeholder="e.g., 48V-72V" />
                </div>
                <div className="form-group">
                  <label className="label">Efficiency</label>
                  <input className="input" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} placeholder="e.g., 92%" />
                </div>
                <div className="form-group">
                  <label className="label">RPM</label>
                  <input className="input" value={rpm} onChange={(e) => setRpm(e.target.value)} placeholder="e.g., 800-1200" />
                </div>
                <div className="form-group">
                  <label className="label">Weight</label>
                  <input className="input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 12 kg" />
                </div>
                <div className="form-group">
                  <label className="label">Dimensions</label>
                  <input className="input" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="e.g., 280x120mm" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Media */}
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Product Images</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1rem" }}>
                {media.map((m, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.imageUrl} alt={m.altText || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      style={{
                        position: "absolute", top: "4px", right: "4px", background: "var(--destructive)", color: "white",
                        border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <label
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  padding: "2rem", border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)",
                  cursor: uploading ? "wait" : "pointer", color: "var(--muted)", fontSize: "0.875rem",
                }}
              >
                <Upload size={18} />
                {uploading ? "Uploading..." : "Click to upload image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} disabled={uploading} />
              </label>
            </div>

            {/* Architecture */}
            <div className="card">
              <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Product Architecture</h2>
              <div style={{ marginBottom: "0.75rem" }}>
                {architectureImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={architectureImageUrl} alt="Architecture" style={{ width: "100%", borderRadius: "var(--radius)", marginBottom: "0.5rem" }} />
                )}
                <label
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                >
                  <Upload size={16} />
                  <span style={{ color: "var(--muted)" }}>{uploading ? "Uploading..." : "Upload architecture image"}</span>
                  <input type="file" accept="image/*" onChange={handleArchitectureUpload} style={{ display: "none" }} disabled={uploading} />
                </label>
              </div>
              <div className="form-group">
                <label className="label">Architecture Description</label>
                <textarea className="input textarea" value={architectureDescription} onChange={(e) => setArchitectureDescription(e.target.value)} rows={4} />
              </div>
            </div>

            {/* Features */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Features</h2>
                <button
                  type="button"
                  onClick={() => setFeatures([...features, { title: "", description: "", order: features.length }])}
                  className="btn btn-ghost btn-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {features.map((feature, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "start" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      <input
                        className="input"
                        placeholder="Feature title"
                        value={feature.title}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[i] = { ...updated[i], title: e.target.value };
                          setFeatures(updated);
                        }}
                      />
                      <input
                        className="input"
                        placeholder="Description (optional)"
                        value={feature.description}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[i] = { ...updated[i], description: e.target.value };
                          setFeatures(updated);
                        }}
                      />
                    </div>
                    <button type="button" onClick={() => removeFeature(i)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--destructive)", marginTop: "0.25rem" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Specifications</h2>
                <button
                  type="button"
                  onClick={() => setSpecs([...specs, { specKey: "", specValue: "", unit: "", order: specs.length }])}
                  className="btn btn-ghost btn-sm"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {specs.map((spec, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      className="input"
                      placeholder="Key (e.g., Voltage)"
                      value={spec.specKey}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[i] = { ...updated[i], specKey: e.target.value };
                        setSpecs(updated);
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      className="input"
                      placeholder="Value"
                      value={spec.specValue}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[i] = { ...updated[i], specValue: e.target.value };
                        setSpecs(updated);
                      }}
                      style={{ flex: 2 }}
                    />
                    <input
                      className="input"
                      placeholder="Unit"
                      value={spec.unit}
                      onChange={(e) => {
                        const updated = [...specs];
                        updated[i] = { ...updated[i], unit: e.target.value };
                        setSpecs(updated);
                      }}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => removeSpec(i)} className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--destructive)" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
