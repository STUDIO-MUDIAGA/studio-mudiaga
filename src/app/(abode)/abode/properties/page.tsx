"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, SlidersHorizontal, BedDouble } from "lucide-react";

const ORANGE = "#c46442";
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
    <div style={{ background: "#f8f8f6", minHeight: "100vh", paddingTop: 64 }}>
      {/* Page header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "36px 40px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 6px" }}>ABODE</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 700, margin: "0 0 22px" }}>All Properties</h1>

          {/* Search + filters row */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search size={13} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#ccc" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location or title…"
                style={{ width: "100%", background: "#fafaf9", border: "1px solid #e8e8e4", borderRadius: 12, padding: "10px 14px 10px 38px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {/* City filter */}
            <div style={{ display: "flex", gap: 6 }}>
              {CITIES.map((c) => (
                <button key={c} onClick={() => setCity(c)} style={{
                  padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer",
                  background: city === c ? "#fdf0eb" : "#fff",
                  borderColor: city === c ? ORANGE : "#e8e8e4",
                  color: city === c ? ORANGE : "#888",
                }}>{c}</button>
              ))}
            </div>

            {/* Beds filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fafaf9", border: "1px solid #e8e8e4", borderRadius: 12, padding: "8px 14px" }}>
              <SlidersHorizontal size={13} color="#ccc" />
              <span style={{ color: "#aaa", fontSize: 12 }}>Beds</span>
              <select value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))} style={{ background: "none", border: "none", color: "#555", fontSize: 12, outline: "none" }}>
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 40px 80px" }}>
        <p style={{ color: "#bbb", fontSize: 12, marginBottom: 20 }}>
          {loading ? "Loading…" : `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#ccc", fontSize: 13 }}>Loading properties…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/abode/properties/${item.id}`}
                style={{ textDecoration: "none", display: "block", borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid #ebebeb", transition: "box-shadow 0.2s" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
              >
                {/* Image */}
                <div style={{ position: "relative", height: 210, overflow: "hidden", background: "#f0f0ee" }}>
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BedDouble size={32} color="#ddd" />
                    </div>
                  )}
                  {/* City badge */}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#555", fontWeight: 600 }}>
                    {item.city}
                  </div>
                  {item.tags?.includes("Superhost") && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "#fdf0eb", border: `1px solid ${ORANGE}33`, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: ORANGE, fontWeight: 600 }}>
                      Superhost
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                    <h3 style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3, flex: 1, paddingRight: 8 }}>{item.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <Star size={11} fill={ORANGE} color={ORANGE} />
                      <span style={{ color: "#888", fontSize: 11 }}>{item.rating || "New"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#bbb", fontSize: 12, marginBottom: 14 }}>
                    <MapPin size={11} /> {item.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f0f0ee" }}>
                    <div>
                      <span style={{ color: "#0a0a0a", fontWeight: 700, fontSize: 15 }}>₦{item.price?.toLocaleString()}</span>
                      <span style={{ color: "#bbb", fontSize: 11 }}> / night</span>
                    </div>
                    <span style={{ color: "#ccc", fontSize: 11 }}>{item.bedrooms}bd · {item.bathrooms}ba · {item.guests} guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#bbb", fontSize: 15, marginBottom: 14 }}>No properties found</p>
            <button
              onClick={() => { setSearch(""); setCity("All"); setMinBeds(0); }}
              style={{ background: "#fdf0eb", border: `1px solid ${ORANGE}33`, color: ORANGE, borderRadius: 10, padding: "9px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
