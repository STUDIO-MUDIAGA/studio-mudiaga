"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CREAM = "#EDE8D0";
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
};

const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { profile } = useAuth();

  const [item, setItem] = useState<FurnitureItem | null>(null);
  const [related, setRelated] = useState<FurnitureItem[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [ordering, setOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    setLoading(true);
    setOrderPlaced(false);
    setActiveImage(0);
    setQuantity(1);
    fetch(`/api/admin/furniture/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: FurnitureItem) => {
        setItem(data);
        setColor(data.colors?.[0] ?? "");
        setLoading(false);
        fetch("/api/admin/furniture")
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

  useEffect(() => {
    if (profile) {
      setForm((f) => ({ ...f, name: f.name || profile.full_name || "", email: f.email || profile.email || "" }));
    }
  }, [profile]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setOrdering(true);
    setOrderError("");
    const res = await fetch("/api/admin/orders/furniture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        item_name: item.name + (color ? ` (${color})` : ""),
        item_id: item.id,
        quantity,
        total_price: item.price * quantity,
        delivery_address: form.address,
        notes: form.notes,
      }),
    });
    setOrdering(false);
    if (!res.ok) {
      const d = await res.json();
      setOrderError(d.error ?? "Failed to place order");
      return;
    }
    setOrderPlaced(true);
  };

  if (loading) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: "rgba(42,56,18,0.35)", paddingTop: 68, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
        Loading…
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: DARK, paddingTop: 68, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
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
    <div style={{ background: CREAM, minHeight: "100vh", color: DARK, paddingTop: 68 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 40px 100px" }}>
        <Link href="/mudres/collection" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(42,56,18,0.5)", fontSize: 12, textDecoration: "none", marginBottom: 28 }}>
          <ChevronLeft size={14} /> Collection
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64 }}>
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
            <h1 style={{ color: DARK, fontSize: 32, fontWeight: 700, margin: "0 0 16px", lineHeight: 1.15 }}>{item.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ color: DARK, fontSize: 24, fontWeight: 700 }}>{fmt(item.price)}</span>
              {item.original_price && (
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
                  {item.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer",
                        border: color === c ? `1px solid ${SAGE}` : "1px solid rgba(42,56,18,0.12)",
                        background: color === c ? "rgba(150,184,93,0.18)" : "rgba(42,56,18,0.03)",
                        color: color === c ? DARK : "rgba(42,56,18,0.55)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!item.in_stock ? (
              <div style={{ background: "rgba(42,56,18,0.03)", border: "1px solid rgba(42,56,18,0.1)", borderRadius: 12, padding: "16px 18px", color: "rgba(42,56,18,0.5)", fontSize: 13 }}>
                This piece is currently out of stock.
              </div>
            ) : orderPlaced ? (
              <div style={{ background: "rgba(150,184,93,0.15)", border: `1px solid ${SAGE}`, borderRadius: 14, padding: "22px 20px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color={DARK} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ color: DARK, fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>Order placed</p>
                  <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    Thanks — we&rsquo;ve received your order for {item.name}. Our team will reach out at {form.email} to confirm delivery.
                  </p>
                </div>
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
                  <span style={{ color: "rgba(42,56,18,0.45)", fontSize: 13 }}>Total: {fmt(item.price * quantity)}</span>
                </div>

                <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" style={inputStyle} />
                    <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" style={inputStyle} />
                  </div>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone number" style={inputStyle} />
                  <input required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Delivery address" style={inputStyle} />
                  <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Notes (optional)" style={{ ...inputStyle, minHeight: 60, resize: "vertical" as const }} />
                  {orderError && <p style={{ color: "#b3261e", fontSize: 12, margin: 0 }}>{orderError}</p>}
                  <button type="submit" disabled={ordering} style={{ background: SAGE, color: DARK, fontWeight: 700, fontSize: 13, padding: "14px 24px", borderRadius: 12, border: "none", cursor: ordering ? "not-allowed" : "pointer", opacity: ordering ? 0.6 : 1, marginTop: 4 }}>
                    {ordering ? "Placing order…" : "Place order"}
                  </button>
                </form>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
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

const inputStyle = {
  width: "100%",
  background: "#ffffff",
  border: "1px solid rgba(42,56,18,0.12)",
  borderRadius: 10,
  padding: "11px 14px",
  color: DARK,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box" as const,
};
