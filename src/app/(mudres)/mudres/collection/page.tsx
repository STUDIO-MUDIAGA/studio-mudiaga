"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

type FurnitureItem = {
  id: string; name: string; category: string; material: string;
  price: number; original_price: number | null; images: string[];
  in_stock: boolean; tags: string[];
};

export default function MudresCollectionPage() {
  return (
    <Suspense fallback={null}>
      <CollectionBrowser />
    </Suspense>
  );
}

function CollectionBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const { has, toggle, signedIn } = useWishlist();
  const [all, setAll] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  // Honours ?category= so the header mega menu and the homepage category
  // tiles land on a pre-filtered listing.
  const [category, setCategory] = useState(params.get("category") ?? "All");

  useEffect(() => {
    fetch("/api/furniture")
      .then((r) => r.json())
      .then((data) => { setAll(data); setLoading(false); });
  }, []);

  const categories = ["All", ...Array.from(new Set(all.map((f) => f.category).filter(Boolean))).sort()];

  const filtered = all.filter((f) => {
    if (category !== "All" && f.category !== category) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      {/* Header */}
      <div className="px-5 md:px-10 pt-8 md:pt-10 pb-7" style={{ borderBottom: "1px solid rgba(42,56,18,0.08)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>MUDRES</p>
          <h1 style={{ color: DARK, fontSize: 32, fontWeight: 700, margin: "0 0 24px" }}>The Collection</h1>

          {/* Search */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220, maxWidth: 360 }}>
              <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(42,56,18,0.35)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search furniture…"
                style={{ width: "100%", background: "rgba(42,56,18,0.04)", border: "1px solid rgba(42,56,18,0.1)", borderRadius: 12, padding: "10px 14px 10px 38px", color: DARK, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Category filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "1px solid", cursor: "pointer",
                background: category === c ? SAGE : "rgba(42,56,18,0.03)",
                borderColor: category === c ? SAGE : "rgba(42,56,18,0.1)",
                color: category === c ? DARK : "rgba(42,56,18,0.5)",
              }}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 md:px-10 pt-10 pb-20" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ color: "rgba(42,56,18,0.35)", fontSize: 12, marginBottom: 24 }}>
          {loading ? "Loading…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(42,56,18,0.25)", fontSize: 13 }}>Loading collection…</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <Link key={item.id} href={`/mudres/collection/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ position: "relative", aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "rgba(42,56,18,0.03)", border: "1px solid rgba(42,56,18,0.06)", marginBottom: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.images?.[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {!item.in_stock && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(42,56,18,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "rgba(237,232,208,0.9)", fontSize: 12 }}>Out of Stock</span>
                    </div>
                  )}
                  {item.original_price && (
                    <div style={{ position: "absolute", top: 10, right: 10, background: SAGE, color: DARK, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>SALE</div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!signedIn) {
                        router.push(`/mudres/login?next=${encodeURIComponent(`/mudres/collection/${item.id}`)}`);
                        return;
                      }
                      toggle(item.id);
                    }}
                    aria-label={has(item.id) ? "Remove from wishlist" : "Save to wishlist"}
                    style={{
                      position: "absolute", top: 10, left: 10, zIndex: 1,
                      width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: has(item.id) ? DARK : WHITE,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 12px -4px rgba(42,56,18,0.35)",
                    }}
                  >
                    <Heart size={13} color={has(item.id) ? WHITE : DARK} fill={has(item.id) ? WHITE : "none"} />
                  </button>
                  <div style={{ position: "absolute", bottom: 10, right: 10, opacity: 0, transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = "1"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = "0"}>
                    <div style={{ background: WHITE, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(42,56,18,0.2)" }}>
                      <ShoppingBag size={13} color={DARK} />
                    </div>
                  </div>
                </div>
                <p style={{ color: "rgba(42,56,18,0.35)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{item.category}</p>
                <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: DARK, fontWeight: 700, fontSize: 14 }}>₦{item.price?.toLocaleString()}</span>
                  {item.original_price && <span style={{ color: "rgba(42,56,18,0.3)", fontSize: 12, textDecoration: "line-through" }}>₦{item.original_price.toLocaleString()}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "rgba(42,56,18,0.35)", fontSize: 15, marginBottom: 12 }}>No items found</p>
            <button onClick={() => { setSearch(""); setCategory("All"); }} style={{ background: "rgba(150,184,93,0.15)", border: "1px solid rgba(150,184,93,0.4)", color: DARK, borderRadius: 10, padding: "9px 18px", fontSize: 12, cursor: "pointer" }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
