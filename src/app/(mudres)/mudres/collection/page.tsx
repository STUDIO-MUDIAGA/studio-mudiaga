"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ShoppingBag, Heart, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";
const LINE = "rgba(42,56,18,0.1)";
const FAINT = "rgba(42,56,18,0.35)";

type FurnitureItem = {
  id: string; name: string; category: string; material: string;
  price: number; original_price: number | null; images: string[];
  in_stock: boolean; tags: string[];
};

const PRICE_TIERS = [
  { label: "Under ₦100k", min: 0, max: 100000 },
  { label: "₦100k – ₦300k", min: 100000, max: 300000 },
  { label: "₦300k – ₦700k", min: 300000, max: 700000 },
  { label: "Over ₦700k", min: 700000, max: Infinity },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

const PAGE_SIZE = 12;

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
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "All");
  const [materials, setMaterials] = useState<Set<string>>(new Set());
  const [priceTier, setPriceTier] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetch("/api/furniture")
      .then((r) => r.json())
      .then((data) => { setAll(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, category, materials, priceTier, inStockOnly, sort]);

  const categories = ["All", ...Array.from(new Set(all.map((f) => f.category).filter(Boolean))).sort()];
  const materialOptions = Array.from(new Set(all.map((f) => f.material).filter(Boolean))).sort();

  const toggleMaterial = (m: string) =>
    setMaterials((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });

  const clearFilters = () => {
    setSearch(""); setCategory("All"); setMaterials(new Set()); setPriceTier("All"); setInStockOnly(false); setSort("featured");
  };

  const activeFilterCount =
    (category !== "All" ? 1 : 0) + materials.size + (priceTier !== "All" ? 1 : 0) + (inStockOnly ? 1 : 0);

  const filtered = all.filter((f) => {
    if (category !== "All" && f.category !== category) return false;
    if (materials.size > 0 && !materials.has(f.material)) return false;
    if (priceTier !== "All") {
      const tier = PRICE_TIERS.find((t) => t.label === priceTier);
      if (tier && !(f.price >= tier.min && f.price < tier.max)) return false;
    }
    if (inStockOnly && !f.in_stock) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const filterPanel = (
    <>
      {/* Category */}
      <FilterGroup title="Category">
        {categories.map((c) => {
          const count = c === "All" ? all.length : all.filter((f) => f.category === c).length;
          return (
            <RadioRow key={c} label={c} count={count} checked={category === c} onChange={() => setCategory(c)} />
          );
        })}
      </FilterGroup>

      {/* Material */}
      {materialOptions.length > 0 && (
        <FilterGroup title="Material">
          {materialOptions.map((m) => {
            const count = all.filter((f) => f.material === m).length;
            return (
              <CheckRow key={m} label={m} count={count} checked={materials.has(m)} onChange={() => toggleMaterial(m)} />
            );
          })}
        </FilterGroup>
      )}

      {/* Price */}
      <FilterGroup title="Price">
        <RadioRow label="All prices" checked={priceTier === "All"} onChange={() => setPriceTier("All")} />
        {PRICE_TIERS.map((t) => (
          <RadioRow key={t.label} label={t.label} checked={priceTier === t.label} onChange={() => setPriceTier(t.label)} />
        ))}
      </FilterGroup>

      {/* Availability */}
      <FilterGroup title="Availability">
        <CheckRow label="In stock only" checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} />
      </FilterGroup>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: DARK, fontSize: 12.5, fontWeight: 600, cursor: "pointer", padding: 0 }}
        >
          <X size={13} /> Clear all filters
        </button>
      )}
    </>
  );

  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      {/* Header */}
      <div className="px-5 md:px-10 pt-8 md:pt-10 pb-7" style={{ borderBottom: `1px solid ${LINE}`, position: "sticky", top: HEADER_SPACE, zIndex: 20, background: WHITE }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>MUDRES</p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
            <h1 style={{ color: DARK, fontSize: 32, fontWeight: 700, margin: 0 }}>Shop</h1>

            <div style={{ position: "relative", width: 320, maxWidth: "100%" }}>
              <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: FAINT }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search furniture…"
                style={{ width: "100%", background: "rgba(42,56,18,0.04)", border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px 10px 38px", color: DARK, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 md:px-10 pt-8 pb-24" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 items-start">
          {/* Sidebar — desktop */}
          <aside className="hidden md:block" style={{ position: "sticky", top: HEADER_SPACE + 24 }}>
            {filterPanel}
          </aside>

          <div style={{ minWidth: 0 }}>
            {/* Mobile filter toggle */}
            <button
              className="flex md:hidden"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              style={{ alignItems: "center", gap: 8, background: "rgba(42,56,18,0.04)", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, color: DARK, cursor: "pointer", marginBottom: 16 }}
            >
              <SlidersHorizontal size={13} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            {mobileFiltersOpen && (
              <div className="md:hidden" style={{ border: `1px solid ${LINE}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                {filterPanel}
              </div>
            )}

            {/* Results bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <p style={{ color: FAINT, fontSize: 12, margin: 0 }}>
                {loading ? "Loading…" : `${sorted.length} item${sorted.length === 1 ? "" : "s"}`}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ background: "rgba(42,56,18,0.04)", border: `1px solid ${LINE}`, borderRadius: 8, padding: "7px 28px 7px 12px", fontSize: 12, color: DARK, outline: "none", cursor: "pointer" }}
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(42,56,18,0.25)", fontSize: 13 }}>Loading collection…</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {pageItems.map((item) => (
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
                    <p style={{ color: FAINT, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>{item.category}</p>
                    <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: DARK, fontWeight: 700, fontSize: 14 }}>₦{item.price?.toLocaleString()}</span>
                      {item.original_price && <span style={{ color: "rgba(42,56,18,0.3)", fontSize: 12, textDecoration: "line-through" }}>₦{item.original_price.toLocaleString()}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!loading && sorted.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ color: FAINT, fontSize: 15, marginBottom: 12 }}>No items found</p>
                <button onClick={clearFilters} style={{ background: "rgba(150,184,93,0.15)", border: "1px solid rgba(150,184,93,0.4)", color: DARK, borderRadius: 10, padding: "9px 18px", fontSize: 12, cursor: "pointer" }}>
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && sorted.length > 0 && totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 40 }}>
                <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} aria-label="Previous page">
                  <ChevronLeft size={14} />
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    style={{
                      width: 34, height: 34, borderRadius: 9, border: "1px solid", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                      background: n === currentPage ? DARK : "transparent",
                      borderColor: n === currentPage ? DARK : LINE,
                      color: n === currentPage ? WHITE : DARK,
                    }}
                  >
                    {n}
                  </button>
                ))}
                <PageButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} aria-label="Next page">
                  <ChevronRight size={14} />
                </PageButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <p style={{ color: DARK, fontSize: 12.5, fontWeight: 700, margin: "0 0 12px" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{children}</div>
    </div>
  );
}

function RadioRow({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      <span style={{
        width: 15, height: 15, borderRadius: "50%", flex: "0 0 auto", border: `1.5px solid ${checked ? DARK : "#C3C9B6"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <span style={{ width: 7, height: 7, borderRadius: "50%", background: DARK }} />}
      </span>
      <span style={{ fontSize: 12.5, color: checked ? DARK : "rgba(42,56,18,0.6)", fontWeight: checked ? 600 : 400, flex: 1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: FAINT }}>{count}</span>}
    </button>
  );
}

function CheckRow({ label, count, checked, onChange }: { label: string; count?: number; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
    >
      <span style={{
        width: 15, height: 15, borderRadius: 4, flex: "0 0 auto", border: `1.5px solid ${checked ? DARK : "#C3C9B6"}`,
        background: checked ? DARK : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <span style={{ width: 6, height: 6, borderRadius: 1, background: WHITE }} />}
      </span>
      <span style={{ fontSize: 12.5, color: checked ? DARK : "rgba(42,56,18,0.6)", fontWeight: checked ? 600 : 400, flex: 1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 11, color: FAINT }}>{count}</span>}
    </button>
  );
}

function PageButton({ children, onClick, disabled, "aria-label": ariaLabel }: { children: React.ReactNode; onClick: () => void; disabled: boolean; "aria-label": string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: 34, height: 34, borderRadius: 9, border: `1px solid ${LINE}`, background: "transparent",
        color: disabled ? "#C3C9B6" : DARK, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
