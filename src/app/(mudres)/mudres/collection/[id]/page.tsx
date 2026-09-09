"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, CheckCircle2, Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

type FurnitureItem = {
  id: string;
  name: string;
  category: string;
  material: string;
  price: number;
  original_price: number | null;
  currency: string;
  description: string;
  dimensions: string | { width?: number; height?: number; depth?: number } | null;
  weight: string;
  colors: string[];
  images: string[];
  tags: string[];
  in_stock: boolean;
  variants: { color: string; price: number; in_stock: boolean }[];
};

const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { has, toggle, signedIn } = useWishlist();
  const { add } = useCart();
  const router = useRouter();

  const [item, setItem] = useState<FurnitureItem | null>(null);
  const [related, setRelated] = useState<FurnitureItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    fetch(`/api/furniture/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: FurnitureItem) => {
        setItem(data);
        setColor(data.colors?.[0] ?? "");
        setLoading(false);
        fetch("/api/furniture")
          .then((r) => r.json())
          .then((all: FurnitureItem[]) =>
            setRelated(all.filter((f) => f.id !== data.id && f.category === data.category).slice(0, 4))
          );
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const activeVariant = item?.variants?.find((v) => v.color === color);
  const effectivePrice = activeVariant ? activeVariant.price : item?.price ?? 0;
  const effectiveInStock = activeVariant ? activeVariant.in_stock : item?.in_stock ?? false;

  const handleAddToCart = () => {
    if (!item) return;
    add({ id: item.id, name: item.name + (color ? ` (${color})` : ""), price: effectivePrice, image: images[0] ?? null, color: color || undefined }, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!item) return;
    add({ id: item.id, name: item.name + (color ? ` (${color})` : ""), price: effectivePrice, image: images[0] ?? null, color: color || undefined }, quantity);
    router.push(signedIn ? "/mudres/checkout" : `/mudres/login?next=${encodeURIComponent("/mudres/checkout")}`);
  };

  if (loading) {
    return (
      <div style={{ background: WHITE, minHeight: "100vh", color: "rgba(42,56,18,0.35)", paddingTop: HEADER_SPACE + 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
        Loading…
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ color: "rgba(42,56,18,0.5)", fontSize: 14 }}>This piece could not be found.</p>
        <Link href="/mudres/collection" style={{ color: SAGE, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
          Back to the collection
        </Link>
      </div>
    );
  }

  const images = item.images?.length ? item.images : [];
  const dimensionsLabel =
    typeof item.dimensions === "string"
      ? item.dimensions
      : item.dimensions
      ? [item.dimensions.width, item.dimensions.depth, item.dimensions.height].filter(Boolean).join(" × ") + "cm (W×D×H)"
      : "";

  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      <div className="px-5 md:px-10" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 32, paddingBottom: 100 }}>
        <Link href="/mudres/collection" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(42,56,18,0.5)", fontSize: 12, textDecoration: "none", marginBottom: 28 }}>
          <ChevronLeft size={14} /> Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-8 md:gap-16">
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: "1", borderRadius: 18, overflow: "hidden", background: "rgba(42,56,18,0.04)", marginBottom: 12 }}>
              {images[activeImage] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[activeImage]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`, gap: 10 }}>
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      aspectRatio: "1", borderRadius: 10, overflow: "hidden", padding: 0, cursor: "pointer",
                      border: activeImage === i ? `2px solid ${SAGE}` : "1px solid rgba(42,56,18,0.1)",
                      background: "rgba(42,56,18,0.04)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 10px" }}>
              {item.category}{item.material ? ` · ${item.material}` : ""}
            </p>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <h1 style={{ color: DARK, fontSize: 32, fontWeight: 700, margin: 0, lineHeight: 1.15, flex: 1 }}>{item.name}</h1>
              <button
                onClick={() => {
                  if (!signedIn) {
                    router.push(`/mudres/login?next=${encodeURIComponent(`/mudres/collection/${item.id}`)}`);
                    return;
                  }
                  toggle(item.id);
                }}
                aria-label={has(item.id) ? "Remove from wishlist" : "Save to wishlist"}
                style={{
                  width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(42,56,18,0.12)", cursor: "pointer",
                  background: has(item.id) ? DARK : WHITE, flex: "0 0 auto",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Heart size={17} color={has(item.id) ? WHITE : DARK} fill={has(item.id) ? WHITE : "none"} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ color: DARK, fontSize: 24, fontWeight: 700 }}>{fmt(effectivePrice)}</span>
              {!activeVariant && item.original_price && (
                <>
                  <span style={{ color: "rgba(42,56,18,0.3)", fontSize: 16, textDecoration: "line-through" }}>{fmt(item.original_price)}</span>
                  <span style={{ background: SAGE, color: DARK, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>SALE</span>
                </>
              )}
            </div>

            {item.description && (
              <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 14, lineHeight: 1.8, margin: "0 0 28px", maxWidth: 460 }}>{item.description}</p>
            )}

            {(dimensionsLabel || item.weight) && (
              <div style={{ display: "flex", gap: 32, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(42,56,18,0.08)" }}>
                {dimensionsLabel && (
                  <div>
                    <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Dimensions</p>
                    <p style={{ color: DARK, fontSize: 13, margin: 0 }}>{dimensionsLabel}</p>
                  </div>
                )}
                {item.weight && (
                  <div>
                    <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Weight</p>
                    <p style={{ color: DARK, fontSize: 13, margin: 0 }}>{item.weight}</p>
                  </div>
                )}
              </div>
            )}

            {item.colors?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Colour — {color}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {item.colors.map((c) => {
                    const v = item.variants?.find((x) => x.color === c);
                    const outOfStock = v ? !v.in_stock : false;
                    return (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        disabled={outOfStock}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                          cursor: outOfStock ? "not-allowed" : "pointer",
                          opacity: outOfStock ? 0.45 : 1,
                          border: color === c ? `1px solid ${SAGE}` : "1px solid rgba(42,56,18,0.12)",
                          background: color === c ? "rgba(150,184,93,0.18)" : "rgba(42,56,18,0.03)",
                          color: color === c ? DARK : "rgba(42,56,18,0.55)",
                        }}
                      >
                        {c}
                        {v && <span style={{ color: "rgba(42,56,18,0.4)", fontSize: 11 }}>{fmt(v.price)}</span>}
                        {outOfStock && <span style={{ fontSize: 10 }}>(out of stock)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!effectiveInStock ? (
              <div style={{ background: "rgba(42,56,18,0.03)", border: "1px solid rgba(42,56,18,0.1)", borderRadius: 12, padding: "16px 18px", color: "rgba(42,56,18,0.5)", fontSize: 13 }}>
                {activeVariant ? `${color} is currently out of stock.` : "This piece is currently out of stock."}
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Qty</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid rgba(42,56,18,0.15)", borderRadius: 10 }}>
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ background: "none", border: "none", color: DARK, padding: "8px 12px", cursor: "pointer" }}>
                      <Minus size={13} />
                    </button>
                    <span style={{ color: DARK, fontSize: 13, fontWeight: 600, width: 24, textAlign: "center" }}>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} style={{ background: "none", border: "none", color: DARK, padding: "8px 12px", cursor: "pointer" }}>
                      <Plus size={13} />
                    </button>
                  </div>
                  <span style={{ color: "rgba(42,56,18,0.45)", fontSize: 13 }}>Total: {fmt(effectivePrice * quantity)}</span>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: justAdded ? "rgba(150,184,93,0.18)" : "rgba(42,56,18,0.04)",
                      border: `1px solid ${justAdded ? SAGE : "rgba(42,56,18,0.15)"}`,
                      color: DARK, fontWeight: 700, fontSize: 13, padding: "14px 20px", borderRadius: 12, cursor: "pointer",
                    }}
                  >
                    {justAdded ? <><CheckCircle2 size={16} /> Added</> : <><ShoppingBag size={16} /> Add to cart</>}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    style={{ flex: 1, background: SAGE, color: DARK, fontWeight: 700, fontSize: 13, padding: "14px 20px", borderRadius: 12, border: "none", cursor: "pointer" }}
                  >
                    Buy now
                  </button>
                </div>
              </>
            )}

            {item.tags?.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 24 }}>
                {item.tags.map((t) => (
                  <span key={t} style={{ color: "rgba(42,56,18,0.45)", fontSize: 11, border: "1px solid rgba(42,56,18,0.12)", borderRadius: 6, padding: "4px 10px" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 100 }}>
            <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>You may also like</p>
            <h2 style={{ color: DARK, fontSize: 24, fontWeight: 700, margin: "0 0 28px" }}>More {item.category.toLowerCase()}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/mudres/collection/${r.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ aspectRatio: "1", borderRadius: 14, overflow: "hidden", background: "rgba(42,56,18,0.04)", marginBottom: 12 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.images?.[0]} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px" }}>{r.name}</h3>
                  <span style={{ color: DARK, fontWeight: 700, fontSize: 13 }}>{fmt(r.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
