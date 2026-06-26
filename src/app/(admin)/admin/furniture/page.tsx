"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const NAVY = "#1e156d";

type FurnitureItem = {
  id: string; name: string; category: string;
  price: number; in_stock: boolean; images: string[]; material: string;
};

export default function AdminFurniturePage() {
  const [items, setItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/furniture").then((r) => r.json()).then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/furniture/${id}`, { method: "DELETE" });
    setItems((p) => p.filter((i) => i.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (item: FurnitureItem) => {
    await fetch(`/api/admin/furniture/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ in_stock: !item.in_stock }) });
    setItems((p) => p.map((i) => i.id === item.id ? { ...i, in_stock: !i.in_stock } : i));
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Inventory</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 24, fontWeight: 700, margin: 0 }}>Furniture</h1>
          <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0 0" }}>{items.length} items</p>
        </div>
        <Link href="/admin/furniture/new" style={{ display: "flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Add Item
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: "14px 18px" }}>
              <div style={{ width: 64, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f5f5f3" }}>
                {item.images?.[0] && <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 500, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{item.category}{item.material ? ` · ${item.material}` : ""}</p>
              </div>
              <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0, flexShrink: 0 }}>₦{item.price.toLocaleString()}</p>
              <button onClick={() => handleToggle(item)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: item.in_stock ? "#16a34a" : "#aaa", fontSize: 12, flexShrink: 0 }}>
                {item.in_stock ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {item.in_stock ? "In Stock" : "Out of Stock"}
              </button>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Link href={`/admin/furniture/${item.id}/edit`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#555", fontSize: 12, textDecoration: "none" }}>
                  <Pencil size={12} /> Edit
                </Link>
                <button onClick={() => handleDelete(item.id, item.name)} disabled={deleting === item.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12, cursor: "pointer", opacity: deleting === item.id ? 0.5 : 1 }}>
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
