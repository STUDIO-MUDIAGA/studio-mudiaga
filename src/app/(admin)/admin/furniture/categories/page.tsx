"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { CATEGORY_ICON_NAMES, resolveCategoryIcon } from "@/lib/category-icons";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

type CategoryMeta = { category: string; icon: string; blurb: string; itemCount: number };

export default function AdminFurnitureCategoriesPage() {
  const [categories, setCategories] = useState<CategoryMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [icon, setIcon] = useState("");
  const [blurb, setBlurb] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/furniture/categories")
      .then((r) => r.json())
      .then((data: CategoryMeta[]) => { setCategories(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(load, []);

  const startEdit = (c: CategoryMeta) => {
    setEditing(c.category);
    setIcon(c.icon);
    setBlurb(c.blurb);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/admin/furniture/categories/${encodeURIComponent(editing)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon, blurb }),
    });
    setSaving(false);
    setEditing(null);
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <p style={{ color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Furniture</p>
        <h1 style={{ color: "#0a0a0a", fontSize: 24, fontWeight: 700, margin: 0 }}>Categories</h1>
        <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0 0" }}>
          Set the icon and description each category shows in the MUDRES mega menu.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading…</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 13 }}>
          No categories yet — add a furniture item to create one.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map((c) => {
            const Icon = resolveCategoryIcon(c.icon);
            const isEditing = editing === c.category;
            return (
              <div key={c.category} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={NAVY} strokeWidth={1.7} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: "0 0 2px" }}>{c.category}</p>
                    <p style={{ color: "#aaa", fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.blurb || "No description set"} · {c.itemCount} item{c.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(c)}
                      style={{ background: "#f5f5f3", border: "1px solid #e8e8e4", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: "#555", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditing && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
                    <p style={{ color: "#888", fontSize: 11, fontWeight: 600, margin: "0 0 8px" }}>Icon</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                      {CATEGORY_ICON_NAMES.map((name) => {
                        const OptIcon = resolveCategoryIcon(name);
                        const selected = icon === name;
                        return (
                          <button
                            key={name}
                            onClick={() => setIcon(name)}
                            aria-label={name}
                            style={{
                              width: 40, height: 40, borderRadius: 10, cursor: "pointer",
                              border: `1.5px solid ${selected ? NAVY : "#e8e8e4"}`,
                              background: selected ? NAVY_BG : "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <OptIcon size={17} color={selected ? NAVY : "#888"} strokeWidth={1.7} />
                          </button>
                        );
                      })}
                    </div>

                    <p style={{ color: "#888", fontSize: 11, fontWeight: 600, margin: "0 0 8px" }}>Description</p>
                    <input
                      value={blurb}
                      onChange={(e) => setBlurb(e.target.value)}
                      placeholder="One line shown under the category in the menu"
                      style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "10px 13px", color: "#0a0a0a", fontSize: 13, outline: "none", marginBottom: 14 }}
                    />

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={save}
                        disabled={saving || !icon}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: NAVY, color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}
                      >
                        <Check size={13} /> {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "#f5f5f3", border: "1px solid #e8e8e4", borderRadius: 9, padding: "9px 16px", fontSize: 12.5, fontWeight: 600, color: "#888", cursor: "pointer" }}
                      >
                        <X size={13} /> Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
