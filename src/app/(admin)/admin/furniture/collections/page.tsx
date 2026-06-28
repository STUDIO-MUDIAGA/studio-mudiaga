"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Pencil, Trash2, X, Check } from "lucide-react";

type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image?: string;
  active: boolean;
  created_at: string;
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function FurnitureCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", cover_image: "", active: true });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/furniture/collections");
    const data = await res.json();
    setCollections(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", cover_image: "", active: true });
    setShowForm(true);
  };

  const openEdit = (c: Collection) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? "", cover_image: c.cover_image ?? "", active: c.active });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      await fetch(`/api/admin/furniture/collections/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/furniture/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/admin/furniture/collections/${id}`, { method: "DELETE" });
    setDeletingId(null);
    load();
  };

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#1e156d", margin: 0 }}>Collections</p>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>{collections.length} collection{collections.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "#c46442", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <Plus size={15} /> New Collection
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>Loading collections…</div>
      ) : collections.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "#aaa" }}>
          <Tag size={40} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
          <p style={{ margin: 0 }}>No collections yet. Create your first one.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {collections.map((c) => (
            <div key={c.id} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
              {c.cover_image ? (
                <div style={{ height: 140, overflow: "hidden" }}>
                  <img src={c.cover_image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ height: 140, background: "#eeedf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Tag size={32} color="#1e156d" style={{ opacity: 0.3 }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontWeight: 700, fontSize: 15, color: "#1e156d" }}>{c.name}</p>
                    <p style={{ margin: "0 0 6px", fontSize: 11, color: "#aaa", fontFamily: "monospace" }}>/{c.slug}</p>
                    {c.description && <p style={{ margin: "0 0 10px", fontSize: 12, color: "#666", lineHeight: 1.5 }}>{c.description}</p>}
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: c.active ? "#e8f5e9" : "#f5f5f5", color: c.active ? "#059669" : "#888" }}>
                      {c.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid #f5f5f5" }}>
                  <button
                    onClick={() => openEdit(c)}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px", border: "1px solid #eee", borderRadius: 8, background: "#fff", fontSize: 12, color: "#555", cursor: "pointer" }}
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "7px", border: "1px solid #fee2e2", borderRadius: 8, background: "#fff", fontSize: 12, color: "#ef4444", cursor: "pointer" }}
                  >
                    <Trash2 size={13} /> {deletingId === c.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 460, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e156d" }}>{editing ? "Edit Collection" : "New Collection"}</p>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} color="#888" /></button>
            </div>

            {[
              { label: "Name", key: "name", placeholder: "e.g. Living Room" },
              { label: "Slug", key: "slug", placeholder: "auto-generated from name" },
              { label: "Cover Image URL", key: "cover_image", placeholder: "https://..." },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
                <input
                  value={(form as unknown as Record<string, string>)[key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((f) => ({ ...f, [key]: v, ...(key === "name" && !f.slug ? { slug: slugify(v) } : {}) }));
                  }}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6 }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Short description of the collection…"
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <input type="checkbox" id="col-active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
              <label htmlFor="col-active" style={{ fontSize: 13, color: "#444" }}>Active (visible on site)</label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: "11px", border: "1px solid #eee", borderRadius: 10, fontSize: 13, background: "#fff", color: "#555", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || saving}
                style={{ flex: 2, padding: "11px", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, background: !form.name || saving ? "#eee" : "#c46442", color: !form.name || saving ? "#aaa" : "#fff", cursor: !form.name || saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Check size={14} /> {saving ? "Saving…" : editing ? "Save Changes" : "Create Collection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
