"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

type FurnitureItem = {
  id: string; name: string; category: string;
  price: number; in_stock: boolean; images: string[];
  material: string;
};

export default function AdminFurniturePage() {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/furniture");
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/furniture/${id}`, { method: "DELETE" });
    setItems((p) => p.filter((i) => i.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (item: FurnitureItem) => {
    await fetch(`/api/admin/furniture/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: !item.in_stock }),
    });
    setItems((p) => p.map((i) => i.id === item.id ? { ...i, in_stock: !i.in_stock } : i));
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Inventory</p>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }}>Furniture</h1>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, margin: "4px 0 0" }}>{items.length} items</p>
        </div>
        <Link href="/admin/furniture/new" style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fbbf24", color: "#000", textDecoration: "none",
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
        }}>
          <Plus size={14} /> Add Item
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.2)", fontSize: 13 }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "14px 18px",
            }}>
              {/* Thumbnail */}
              <div style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.05)" }}>
                {item.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>{item.category}{item.material ? ` · ${item.material}` : ""}</p>
              </div>

              {/* Price */}
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0, flexShrink: 0 }}>₦{item.price.toLocaleString()}</p>

              {/* Stock toggle */}
              <button onClick={() => handleToggle(item)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: item.in_stock ? "#4ade80" : "rgba(255,255,255,0.25)", fontSize: 12, flexShrink: 0 }}>
                {item.in_stock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {item.in_stock ? "In Stock" : "Out of Stock"}
              </button>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Link href={`/admin/furniture/${item.id}/edit`} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                  borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)", fontSize: 12, textDecoration: "none",
                }}>
                  <Pencil size={12} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={deleting === item.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
                    borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                    color: "#f87171", fontSize: 12, cursor: "pointer", opacity: deleting === item.id ? 0.5 : 1,
                  }}
                >
                  <Trash2 size={12} /> {deleting === item.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
