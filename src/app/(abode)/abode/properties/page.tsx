"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react";

const CITIES = ["All", "Lagos", "Abuja", "Port Harcourt"];

type Shortlet = {
  id: string; title: string; location: string; city: string;
  price: number; bedrooms: number; bathrooms: number; guests: number;
  rating: number; review_count: number; images: string[]; available: boolean; tags: string[];
};

export default function AbodePropertiesPage() {
  const [all, setAll] = useState<Shortlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [minBeds, setMinBeds] = useState(0);

  useEffect(() => {
    fetch("/api/admin/shortlets")
      .then((r) => r.json())
      .then((data) => { setAll(data); setLoading(false); });
  }, []);

  const filtered = all.filter((s) => {
    if (!s.available) return false;
    if (city !== "All" && s.city !== city) return false;
    if (s.bedrooms < minBeds) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: "#080c10", minHeight: "100vh", color: "#fff", paddingTop: 68 }}>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: "#c49a3c", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>ABODE</p>
          <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 700, margin: "0 0 24px" }}>All Properties</h1>

          {/* Search + filters row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location or title…"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px 10px 38px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* City filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {CITIES.map((c) => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer",
                  background: city === c ? "#c49a3c" : "rgba(255,255,255,0.03)",
                  borderColor: city === c ? "#c49a3c" : "rgba(255,255,255,0.08)",
                  color: city === c ? "#000" : "rgba(255,255,255,0.4)",
                }}>{c}</button>
              ))}
            </div>

            {/* Beds filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 14px" }}>
              <SlidersHorizontal size={13} color="rgba(255,255,255,0.3)" />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>Beds</span>
              <select value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))} style={{ background: "none", border: "none", color: "#fff", fontSize: 12, outline: "none" }}>
                <option value={0} style={{ background: "#111" }}>Any</option>
                <option value={1} style={{ background: "#111" }}>1+</option>
                <option value={2} style={{ background: "#111" }}>2+</option>
                <option value={3} style={{ background: "#111" }}>3+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 40px 80px" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginBottom: 24 }}>
          {loading ? "Loading…" : `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.15)", fontSize: 13 }}>Loading properties…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map((item) => (
              <Link key={item.id} href={`/abode/properties/${item.id}`} style={{ textDecoration: "none", display: "block", borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.2s" }}>
                <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images?.[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(8,12,16,0.75)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#c49a3c", fontWeight: 600 }}>
                    {item.city}
                  </div>
                  {item.tags?.includes("Superhost") && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(196,154,60,0.15)", border: "1px solid rgba(196,154,60,0.3)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#c49a3c" }}>
                      Superhost
                    </div>
                  )}
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                    <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>{item.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, marginLeft: 8 }}>
                      <Star size={11} fill="#c49a3c" color="#c49a3c" />
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11 }}>{item.rating || "New"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 14 }}>
                    <MapPin size={11} /> {item.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>₦{item.price?.toLocaleString()}</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}> / night</span>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>{item.bedrooms}bd · {item.bathrooms}ba · {item.guests} guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 15, marginBottom: 12 }}>No properties found</p>
            <button onClick={() => { setSearch(""); setCity("All"); setMinBeds(0); }} style={{ background: "rgba(196,154,60,0.1)", border: "1px solid rgba(196,154,60,0.2)", color: "#c49a3c", borderRadius: 10, padding: "9px 18px", fontSize: 12, cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
