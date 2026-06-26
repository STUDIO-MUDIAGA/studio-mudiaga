"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Star, ChevronRight, BedDouble } from "lucide-react";

const ORANGE = "#c46442";
const CITIES = ["Lagos", "Abuja", "Port Harcourt"];
const HERO_BG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80";

type Shortlet = {
  id: string; title: string; location: string; city: string;
  price: number; bedrooms: number; guests: number; rating: number;
  review_count: number; images: string[]; available: boolean;
};

export default function AbodeLanding() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Lagos");
  const [featured, setFeatured] = useState<Shortlet[]>([]);

  useEffect(() => {
    fetch("/api/admin/shortlets")
      .then((r) => r.json())
      .then((data: Shortlet[]) => setFeatured(data.filter((s) => s.available).slice(0, 6)));
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_BG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.38)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, #fff 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 860, margin: "0 auto" }}>
          <p style={{ color: ORANGE, fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", margin: "0 0 20px" }}>ABODE by Studio Mudiaga</p>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 800, lineHeight: 1.05, margin: "0 0 20px", letterSpacing: "-0.02em", color: "#fff" }}>
            Find your perfect<br /><span style={{ color: ORANGE }}>shortlet in Nigeria</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.7, margin: "0 0 48px", maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            Hand-verified apartments in Lagos and Abuja. Book by the night, week, or month.
          </p>

          {/* Search bar */}
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 18, padding: "6px 6px 6px 20px", display: "flex", alignItems: "center", gap: 8, maxWidth: 600, margin: "0 auto" }}>
            <Search size={16} color="rgba(255,255,255,0.45)" style={{ flexShrink: 0 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location or property name..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, padding: "8px 0" }}
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none" }}
            >
              {CITIES.map((c) => <option key={c} style={{ background: "#2a2a2a" }}>{c}</option>)}
            </select>
            <Link
              href={`/abode/properties?q=${search}&city=${city}`}
              style={{ background: ORANGE, color: "#fff", fontWeight: 700, fontSize: 13, padding: "12px 22px", borderRadius: 12, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              Search
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>Scroll to explore</p>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)" }} />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ borderTop: "1px solid #ebebeb", borderBottom: "1px solid #ebebeb", padding: "32px 40px", background: "#fafaf9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, textAlign: "center" }}>
          {[
            { value: "50+", label: "Verified properties" },
            { value: "2",   label: "Cities" },
            { value: "4.9★", label: "Average rating" },
            { value: "24/7", label: "Guest support" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p style={{ color: ORANGE, fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>{value}</p>
              <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured properties ── */}
      <section style={{ padding: "72px 40px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>Handpicked</p>
              <h2 style={{ color: "#0a0a0a", fontSize: 30, fontWeight: 700, margin: 0 }}>Featured Properties</h2>
            </div>
            <Link href="/abode/properties" style={{ display: "flex", alignItems: "center", gap: 4, color: ORANGE, fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {featured.map((item) => (
              <Link
                key={item.id}
                href={`/abode/properties/${item.id}`}
                style={{ textDecoration: "none", display: "block", borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid #ebebeb" }}
                onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)")}
                onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}
              >
                <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#f0f0ee" }}>
                  {item.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BedDouble size={32} color="#ddd" />
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#555", fontWeight: 600 }}>
                    {item.city}
                  </div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 5 }}>
                    <h3 style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 600, margin: 0, lineHeight: 1.3, flex: 1, paddingRight: 8 }}>{item.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <Star size={11} fill={ORANGE} color={ORANGE} />
                      <span style={{ color: "#888", fontSize: 11 }}>{item.rating || "New"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#bbb", fontSize: 12, marginBottom: 12 }}>
                    <MapPin size={11} /> {item.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f0f0ee" }}>
                    <div>
                      <span style={{ color: "#0a0a0a", fontWeight: 700, fontSize: 15 }}>₦{item.price?.toLocaleString()}</span>
                      <span style={{ color: "#bbb", fontSize: 11 }}> / night</span>
                    </div>
                    <span style={{ color: "#ccc", fontSize: 11 }}>{item.bedrooms}bd · {item.guests} guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {featured.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading properties…</div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "72px 40px 80px", background: "#fafaf9", borderTop: "1px solid #ebebeb" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: ORANGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 14px" }}>Ready to book?</p>
          <h2 style={{ color: "#0a0a0a", fontSize: 34, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2 }}>Book your perfect stay</h2>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, margin: "0 0 32px" }}>
            Create an account to save properties, track your bookings, and get exclusive rates.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/abode/properties" style={{ background: ORANGE, color: "#fff", fontWeight: 700, fontSize: 13, padding: "13px 28px", borderRadius: 12, textDecoration: "none" }}>
              Browse all properties
            </Link>
            <Link href="/signup" style={{ background: "#fff", border: "1px solid #ebebeb", color: "#555", fontSize: 13, padding: "13px 24px", borderRadius: 12, textDecoration: "none" }}>
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
