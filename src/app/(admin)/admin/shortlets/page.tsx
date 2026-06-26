"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const NAVY = "#1e156d";

type Shortlet = {
  id: string; title: string; location: string; city: string;
  price: number; bedrooms: number; guests: number;
  available: boolean; images: string[];
};

export default function AdminShortlets() {
  const [items, setItems] = useState<Shortlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/shortlets").then((r) => r.json()).then((data) => { setItems(data); setLoading(false); });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/shortlets/${id}`, { method: "DELETE" });
    setItems((p) => p.filter((i) => i.id !== id));
    setDeleting(null);
  };

  const handleToggle = async (item: Shortlet) => {
    await fetch(`/api/admin/shortlets/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ available: !item.available }) });
    setItems((p) => p.map((i) => i.id === item.id ? { ...i, available: !i.available } : i));
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Properties</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 24, fontWeight: 700, margin: 0 }}>Shortlets</h1>
          <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0 0" }}>{items.length} listings</p>
        </div>
        <Link href="/admin/shortlets/new" style={{ display: "flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Add Shortlet
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
                <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 500, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{item.location} · {item.bedrooms}bd · {item.guests} guests</p>
              </div>
              <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0, flexShrink: 0 }}>₦{item.price.toLocaleString()}<span style={{ color: "#aaa", fontWeight: 400 }}>/night</span></p>
              <button onClick={() => handleToggle(item)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: item.available ? "#16a34a" : "#aaa", fontSize: 12, flexShrink: 0 }}>
                {item.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {item.available ? "Live" : "Hidden"}
              </button>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Link href={`/admin/shortlets/${item.id}/edit`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#555", fontSize: 12, textDecoration: "none" }}>
                  <Pencil size={12} /> Edit
                </Link>
                <button onClick={() => handleDelete(item.id, item.title)} disabled={deleting === item.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12, cursor: "pointer", opacity: deleting === item.id ? 0.5 : 1 }}>
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
