"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

const CATEGORIES = ["All", "Sofa", "Chair", "Table", "Bed", "Storage", "Lighting", "Décor", "Outdoor", "Office", "Dining"];

type FurnitureItem = {
  id: string; name: string; category: string; material: string;
  price: number; original_price: number | null; images: string[];
  in_stock: boolean; tags: string[];
};

export default function MudresCollectionPage() {
  const [all, setAll] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/admin/furniture")
      .then((r) => r.json())
      .then((data) => { setAll(data); setLoading(false); });
  }, []);

  const filtered = all.filter((f) => {
    if (category !== "All" && f.category !== category) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: "#0d0a08", minHeight: "100vh", color: "#fff", paddingTop: 68 }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 40px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: "#8b5e3c", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>MUDRES</p>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 24px" }}>The Collection</h1>

          {/* Search */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 360 }}>
              <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search furniture…"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px 10px 38px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
                background: category === c ? "#8b5e3c" : "rgba(255,255,255,0.03)",
                borderColor: category === c ? "#8b5e3c" : "rgba(255,255,255,0.07)",
                color: category === c ? "#fff" : "rgba(255,255,255,0.35)",
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 80px" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginBottom: 24 }}>
          {loading ? "Loading…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.15)", fontSize: 13 }}>Loading collection…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {filtered.map((item) => (
              <Link key={item.id} href={`/mudres/collection/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images?.[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {!item.in_stock && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Out of Stock</span>
                    </div>
                  )}
                  {item.original_price && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#8b5e3c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>SALE</div>
                  )}
                  <div style={{ position: "absolute", bottom: 10, right: 10, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = "0"}>
                    <div style={{ background: "#fff", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                      <ShoppingBag size={13} color="#000" />
                    </div>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{item.category}</p>
                <h3 style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>₦{item.price?.toLocaleString()}</span>
                  {item.original_price && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textDecoration: "line-through" }}>₦{item.original_price.toLocaleString()}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 15, marginBottom: 12 }}>No items found</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} style={{ background: "rgba(139,94,60,0.1)", border: "1px solid rgba(139,94,60,0.2)", color: "#8b5e3c", borderRadius: 10, padding: "9px 18px", fontSize: 12, cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
