"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Tag, Plus, Pencil, Trash2, X, Check,
  Loader2, Building2, GripVertical, AlertCircle, Search,
} from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const ORANGE = "#c46442";

const PRESET_COLORS = [
  "#1e156d", "#c46442", "#15803d", "#0e6595",
  "#be185d", "#6b21a8", "#b45309", "#0e7a3d",
  "#dc2626", "#0f766e",
];

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  sort_order: number;
  property_count: number;
};

type Shortlet = {
  id: string; title: string; city: string; price: number; images: string[];
};

const inp: React.CSSProperties = {
  width: "100%", background: "#fafaf9", border: "1px solid #e8e8e4",
  borderRadius: 10, padding: "10px 14px", color: "#0a0a0a",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block", color: "#555", fontSize: 11, fontWeight: 600, marginBottom: 6,
};

function CategoryDot({ color }: { color: string }) {
  return <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

export default function CategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allShortlets, setAllShortlets] = useState<Shortlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Panel state
  const [panel, setPanel] = useState<"none" | "create" | "edit" | "assign">("none");
  const [selected, setSelected] = useState<Category | null>(null);

  // Form state
  const [fname, setFname] = useState("");
  const [fdesc, setFdesc] = useState("");
  const [fcolor, setFcolor] = useState("#1e156d");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Assignment state
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [assignSearch, setAssignSearch] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const loadCategories = useCallback(async () => {
    const token = await getToken();
    const res = await fetch("/api/admin/shortlets/categories", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { setError("Failed to load categories"); setLoading(false); return; }
    setCategories(await res.json());
    setLoading(false);
  }, [getToken]);

  const loadShortlets = useCallback(async () => {
    const res = await fetch("/api/admin/shortlets");
    if (res.ok) setAllShortlets(await res.json());
  }, []);

  useEffect(() => { loadCategories(); loadShortlets(); }, [loadCategories, loadShortlets]);

  function openCreate() {
    setFname(""); setFdesc(""); setFcolor("#1e156d"); setFormError("");
    setPanel("create"); setSelected(null);
  }

  function openEdit(cat: Category) {
    setFname(cat.name); setFdesc(cat.description); setFcolor(cat.color); setFormError("");
    setSelected(cat); setPanel("edit");
  }

  async function openAssign(cat: Category) {
    setSelected(cat); setAssignSearch("");
    const token = await getToken();
    const res = await fetch(`/api/admin/shortlets/categories/${cat.id}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setAssignedIds(new Set((data.shortlets ?? []).map((s: Shortlet) => s.id)));
    }
    setPanel("assign");
  }

  async function handleSave() {
    if (!fname.trim()) { setFormError("Name is required"); return; }
    setSaving(true); setFormError("");
    const token = await getToken();

    if (panel === "create") {
      const res = await fetch("/api/admin/shortlets/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: fname, description: fdesc, color: fcolor }),
      });
      if (!res.ok) { const d = await res.json(); setFormError(d.error); setSaving(false); return; }
    } else if (panel === "edit" && selected) {
      const res = await fetch(`/api/admin/shortlets/categories/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: fname, description: fdesc, color: fcolor }),
      });
      if (!res.ok) { const d = await res.json(); setFormError(d.error); setSaving(false); return; }
    }

    setSaving(false); setPanel("none"); setSelected(null);
    loadCategories();
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? This will remove it from all properties.`)) return;
    setDeleting(cat.id);
    const token = await getToken();
    await fetch(`/api/admin/shortlets/categories/${cat.id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    setDeleting(null); loadCategories();
  }

  async function saveAssignments() {
    if (!selected) return;
    setAssignSaving(true);
    const token = await getToken();
    await fetch(`/api/admin/shortlets/categories/${selected.id}/assignments`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ shortlet_ids: [...assignedIds] }),
    });
    setAssignSaving(false); setPanel("none"); setSelected(null);
    loadCategories();
  }

  const filteredShortlets = allShortlets.filter((s) =>
    !assignSearch || s.title.toLowerCase().includes(assignSearch.toLowerCase()) || s.city.toLowerCase().includes(assignSearch.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* ── Left: categories list ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", gap: 5, color: "#aaa", fontSize: 12, textDecoration: "none" }}>
            <ArrowLeft size={12} /> Shortlets
          </Link>
          <div style={{ width: 1, height: 16, background: "#e8e8e4" }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "#0a0a0a", fontSize: 20, fontWeight: 700, margin: 0 }}>Categories</h1>
            <p style={{ color: "#aaa", fontSize: 12, margin: "2px 0 0" }}>{categories.length} categories · organise properties for guests</p>
          </div>
          <button
            onClick={openCreate}
            style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={14} /> New Category
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
            <Loader2 size={20} color="#ddd" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "60px 0", textAlign: "center" }}>
            <Tag size={32} color="#e0e0e0" style={{ margin: "0 auto 12px", display: "block" }} />
            <p style={{ color: "#bbb", fontSize: 14, marginBottom: 16 }}>No categories yet</p>
            <button onClick={openCreate} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Create first category
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{ background: "#fff", border: `1px solid ${selected?.id === cat.id && panel !== "none" ? cat.color + "55" : "#e8e8e4"}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s" }}
              >
                {/* Drag handle placeholder */}
                <GripVertical size={14} color="#d0d0d0" style={{ flexShrink: 0, cursor: "grab" }} />

                {/* Color dot */}
                <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${cat.color}33` }}>
                  <CategoryDot color={cat.color} />
                </div>

                {/* Name + desc */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0 }}>{cat.name}</p>
                    <span style={{ background: "#f2f2f4", color: "#888", fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5 }}>/{cat.slug}</span>
                  </div>
                  {cat.description && <p style={{ color: "#aaa", fontSize: 12, margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cat.description}</p>}
                </div>

                {/* Property count */}
                <button
                  onClick={() => openAssign(cat)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: cat.property_count > 0 ? cat.color + "14" : "#f2f2f4", border: `1px solid ${cat.property_count > 0 ? cat.color + "33" : "#e8e8e4"}`, borderRadius: 8, padding: "5px 12px", cursor: "pointer", textDecoration: "none" }}
                >
                  <Building2 size={12} color={cat.property_count > 0 ? cat.color : "#bbb"} />
                  <span style={{ color: cat.property_count > 0 ? cat.color : "#bbb", fontSize: 12, fontWeight: 600 }}>{cat.property_count} {cat.property_count === 1 ? "property" : "properties"}</span>
                </button>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => openEdit(cat)}
                    style={{ width: 32, height: 32, borderRadius: 8, background: "#f2f2f4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Pencil size={13} color="#888" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    disabled={deleting === cat.id}
                    style={{ width: 32, height: 32, borderRadius: 8, background: "#fff5f5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {deleting === cat.id ? <Loader2 size={13} color="#dc2626" style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={13} color="#dc2626" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right panel ── */}
      {panel !== "none" && (
        <div style={{ width: 360, flexShrink: 0, position: "sticky", top: 24 }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 18, overflow: "hidden" }}>
            {/* Panel header */}
            <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: 0 }}>
                {panel === "create" ? "New Category" : panel === "edit" ? "Edit Category" : `Assign: ${selected?.name}`}
              </p>
              <button onClick={() => { setPanel("none"); setSelected(null); }} style={{ background: "#f2f2f4", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={13} color="#666" />
              </button>
            </div>

            {/* Create / Edit form */}
            {(panel === "create" || panel === "edit") && (
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={lbl}>Category Name *</label>
                  <input style={inp} value={fname} onChange={(e) => setFname(e.target.value)} placeholder="e.g. Pet Friendly" />
                </div>
                <div>
                  <label style={lbl}>Description</label>
                  <textarea
                    style={{ ...inp, minHeight: 72, resize: "vertical", lineHeight: 1.6 }}
                    value={fdesc}
                    onChange={(e) => setFdesc(e.target.value)}
                    placeholder="What makes this category special…"
                  />
                </div>
                <div>
                  <label style={lbl}>Colour</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFcolor(c)}
                        style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: `3px solid ${fcolor === c ? "#0a0a0a" : "transparent"}`, cursor: "pointer", transition: "border 0.1s" }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: fcolor, flexShrink: 0 }} />
                    <input
                      style={{ ...inp, fontFamily: "monospace" }}
                      value={fcolor}
                      onChange={(e) => setFcolor(e.target.value)}
                      placeholder="#1e156d"
                      maxLength={7}
                    />
                  </div>
                </div>

                {/* Preview */}
                {fname && (
                  <div style={{ background: "#f8f8f6", borderRadius: 10, padding: "12px 14px" }}>
                    <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Preview</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: fcolor + "18", border: `1px solid ${fcolor}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CategoryDot color={fcolor} />
                      </div>
                      <div>
                        <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0 }}>{fname}</p>
                        <p style={{ color: "#bbb", fontSize: 11, margin: "2px 0 0" }}>{fname.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</p>
                      </div>
                    </div>
                  </div>
                )}

                {formError && <p style={{ color: "#dc2626", fontSize: 12, margin: 0 }}>{formError}</p>}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : <><Check size={14} /> {panel === "create" ? "Create Category" : "Save Changes"}</>}
                </button>
              </div>
            )}

            {/* Assign properties panel */}
            {panel === "assign" && selected && (
              <div style={{ display: "flex", flexDirection: "column", maxHeight: "72vh" }}>
                {/* Search */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f2f2f4", borderRadius: 10, padding: "8px 12px" }}>
                    <Search size={12} color="#bbb" />
                    <input
                      value={assignSearch}
                      onChange={(e) => setAssignSearch(e.target.value)}
                      placeholder="Search properties…"
                      style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#555", flex: 1 }}
                    />
                  </div>
                  <p style={{ color: "#aaa", fontSize: 11, margin: "8px 0 0" }}>
                    {assignedIds.size} of {allShortlets.length} properties selected
                  </p>
                </div>

                {/* Property list */}
                <div style={{ overflowY: "auto", flex: 1, padding: "8px 12px" }}>
                  {filteredShortlets.map((s) => {
                    const on = assignedIds.has(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setAssignedIds((prev) => {
                          const next = new Set(prev);
                          on ? next.delete(s.id) : next.add(s.id);
                          return next;
                        })}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, background: on ? selected.color + "0d" : "transparent", border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "background 0.1s" }}
                      >
                        {/* Thumbnail */}
                        <div style={{ width: 40, height: 30, borderRadius: 7, overflow: "hidden", background: "#f0f0ee", flexShrink: 0 }}>
                          {s.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={s.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</p>
                          <p style={{ color: "#bbb", fontSize: 11, margin: "1px 0 0" }}>{s.city} · ₦{s.price.toLocaleString()}/night</p>
                        </div>
                        {/* Checkbox */}
                        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${on ? selected.color : "#d0d0d0"}`, background: on ? selected.color : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.1s" }}>
                          {on && <Check size={11} color="#fff" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Save footer */}
                <div style={{ padding: "14px 20px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8 }}>
                  <button
                    onClick={saveAssignments}
                    disabled={assignSaving}
                    style={{ flex: 1, background: selected.color, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: assignSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                  >
                    {assignSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    Save {assignedIds.size} properties
                  </button>
                  <button
                    onClick={() => { setPanel("none"); setSelected(null); }}
                    style={{ padding: "11px 16px", background: "#f2f2f4", border: "none", borderRadius: 10, fontSize: 13, color: "#888", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
