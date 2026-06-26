"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80";

type FurnitureItem = {
  id: string; name: string; category: string; price: number;
  original_price: number | null; images: string[]; in_stock: boolean; featured: boolean;
};

export default function MudresLanding() {
  const [featured, setFeatured] = useState<FurnitureItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/furniture")
      .then((r) => r.json())
      .then((data: FurnitureItem[]) => setFeatured(data.filter((f) => f.in_stock).slice(0, 8)));
  }, []);

  return (
    <div style={{ background: "#0d0a08", color: "#fff", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_BG} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,10,8,0.9) 0%, rgba(13,10,8,0.2) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #0d0a08 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 40px", width: "100%" }}>
          <p style={{ color: "#8b5e3c", fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", margin: "0 0 20px" }}>MUDRES by Studio Mudiaga</p>
          <h1 style={{ fontSize: "clamp(44px, 6vw, 88px)", fontWeight: 800, lineHeight: 1.0, margin: "0 0 20px", letterSpacing: "-0.03em", maxWidth: 700 }}>
            Furniture designed<br />for <span style={{ color: "#8b5e3c", fontStyle: "italic" }}>considered</span><br />living.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.8, margin: "0 0 40px", maxWidth: 420 }}>
            Each piece is handcrafted with intention — built to bring character, warmth, and longevity to your space.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/mudres/collection" style={{ background: "#8b5e3c", color: "#fff", fontWeight: 700, fontSize: 13, padding: "14px 28px", borderRadius: 12, textDecoration: "none" }}>
              Browse collection
            </Link>
            <Link href="/about" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 13, padding: "14px 24px", borderRadius: 12, textDecoration: "none" }}>
              Our story
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brand statement ── */}
      <section style={{ padding: "80px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ color: "#8b5e3c", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 16px" }}>Our philosophy</p>
            <h2 style={{ color: "#fff", fontSize: 36, fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>Craft rooted in culture, designed for today</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
              MUDRES draws from the richness of Nigerian craftsmanship — bold textures, warm tones, and forms that ground a space without overwhelming it. Every piece is a collaboration between maker and material.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
              "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
            ].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: i === 0 ? "16px 4px 4px 4px" : i === 3 ? "4px 4px 16px 4px" : 4 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection preview ── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p style={{ color: "#8b5e3c", fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>The Collection</p>
              <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: 0 }}>Handpicked pieces</h2>
            </div>
            <Link href="/mudres/collection" style={{ display: "flex", alignItems: "center", gap: 4, color: "#8b5e3c", fontSize: 13, textDecoration: "none" }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {featured.map((item) => (
              <Link key={item.id} href={`/mudres/collection/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "rgba(255,255,255,0.03)", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images?.[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {item.original_price && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: "#8b5e3c", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>SALE</div>
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 10, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0"; (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; }}>
                    <div style={{ background: "#fff", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShoppingBag size={14} color="#000" />
                    </div>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{item.category}</p>
                <h3 style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: "0 0 6px" }}>{item.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>₦{item.price?.toLocaleString()}</span>
                  {item.original_price && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, textDecoration: "line-through" }}>₦{item.original_price.toLocaleString()}</span>}
                </div>
              </Link>
            ))}
          </div>

          {featured.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.15)", fontSize: 13 }}>Loading collection…</div>
          )}
        </div>
      </section>
    </div>
  );
}
