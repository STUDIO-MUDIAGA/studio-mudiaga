"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, MapPin, BedDouble, Users, Eye, EyeOff } from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

type Shortlet = {
  id: string; title: string; location: string; city: string;
  price: number; bedrooms: number; bathrooms: number; guests: number;
  available: boolean; images: string[]; amenities: string[];
};

export default function AdminShortlets() {
  const [items, setItems] = useState<Shortlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");

  useEffect(() => {
    fetch("/api/admin/shortlets").then((r) => r.json()).then((data) => {
      setItems(data); setLoading(false);
    });
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

  const cities = ["All", ...Array.from(new Set(items.map((i) => i.city)))];
  const filtered = items.filter((i) => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === "All" || i.city === cityFilter;
    return matchSearch && matchCity;
  });

  const totalAvailable = items.filter((i) => i.available).length;
  const totalHidden = items.filter((i) => !i.available).length;

  return (
    <div>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ color: "#bbb", fontSize: 12, margin: "0 0 4px" }}>Properties</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>Shortlets</h1>
        </div>
        <Link href="/admin/shortlets/new" style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
          <Plus size={14} /> Add Shortlet
        </Link>
      </div>

      {/* Stat pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total",     value: items.length,    bg: "#f7f7f5",  color: "#555",    border: "#ebebeb" },
          { label: "Live",      value: totalAvailable,  bg: "#f0fdf4",  color: "#15803d", border: "#bbf7d0" },
          { label: "Hidden",    value: totalHidden,     bg: "#fafafa",  color: "#aaa",    border: "#ebebeb" },
        ].map(({ label, value, bg, color, border }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "8px 14px" }}>
            <span style={{ color, fontSize: 14, fontWeight: 700 }}>{value}</span>
            <span style={{ color: "#aaa", fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, padding: "8px 14px", flex: 1, maxWidth: 320 }}>
          <Search size={13} color="#ccc" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location…"
            style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#555", flex: 1 }}
          />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {cities.map((c) => (
            <button key={c} onClick={() => setCityFilter(c)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid", fontSize: 12, fontWeight: 500, cursor: "pointer", background: cityFilter === c ? NAVY_BG : "#fff", borderColor: cityFilter === c ? NAVY : "#ebebeb", color: cityFilter === c ? NAVY : "#888" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, overflow: "hidden" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>
            {items.length === 0 ? "No shortlets yet. Add your first one." : "No results match your search."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                {["Property", "Location", "Details", "Price / Night", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ color: "#bbb", fontSize: 11, fontWeight: 600, textAlign: "left", padding: "14px 18px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f8f8f8" : "none" }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#fafaf9")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* Property */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 52, height: 40, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                        {item.images?.[0]
                          ? <img src={item.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><BedDouble size={14} color="#ccc" /></div>
                        }
                      </div>
                      <div>
                        <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                        <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{item.amenities?.length ?? 0} amenities</p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={11} color="#ccc" />
                      <div>
                        <p style={{ color: "#555", fontSize: 12, margin: "0 0 1px" }}>{item.location}</p>
                        <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{item.city}</p>
                      </div>
                    </div>
                  </td>

                  {/* Details */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 12 }}>
                        <BedDouble size={11} color="#ccc" /> {item.bedrooms} bed
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 12 }}>
                        <Users size={11} color="#ccc" /> {item.guests} guests
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: "14px 18px" }}>
                    <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 700, margin: 0 }}>₦{item.price.toLocaleString()}</p>
                  </td>

                  {/* Status */}
                  <td style={{ padding: "14px 18px" }}>
                    <button
                      onClick={() => handleToggle(item)}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, border: "1px solid", cursor: "pointer", fontSize: 11, fontWeight: 600, background: item.available ? "#f0fdf4" : "#fafafa", borderColor: item.available ? "#bbf7d0" : "#ebebeb", color: item.available ? "#15803d" : "#aaa" }}
                    >
                      {item.available ? <Eye size={11} /> : <EyeOff size={11} />}
                      {item.available ? "Live" : "Hidden"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "14px 18px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link href={`/admin/shortlets/${item.id}/edit`} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: NAVY_BG, border: `1px solid #d8d6f0`, color: NAVY, fontSize: 12, fontWeight: 500, textDecoration: "none" }}>
                        <Pencil size={11} /> Edit
                      </Link>
                      <button onClick={() => handleDelete(item.id, item.title)} disabled={deleting === item.id} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer", opacity: deleting === item.id ? 0.5 : 1 }}>
                        <Trash2 size={11} /> {deleting === item.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <p style={{ color: "#bbb", fontSize: 12, margin: "12px 0 0", textAlign: "right" }}>
          Showing {filtered.length} of {items.length} shortlets
        </p>
      )}
    </div>
  );
}
