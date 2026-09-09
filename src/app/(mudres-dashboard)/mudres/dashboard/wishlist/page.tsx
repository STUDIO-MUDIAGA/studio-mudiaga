"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import DashboardShell from "@/components/mudres/DashboardShell";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const MUTED = "#6F7A5E";
const LINE = "#E7E8E0";

type WishItem = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  original_price: number | null;
  images: string[] | null;
  in_stock: boolean;
};

const naira = (n: number | null) => `₦${(n ?? 0).toLocaleString()}`;

export default function MudresWishlistPage() {
  const [items, setItems] = useState<WishItem[] | null>(null);
  const { toggle } = useWishlist();
  const { add } = useCart();

  const load = () => {
    fetch("/api/wishlist")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: WishItem[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    setItems((current) => (current ?? []).filter((i) => i.id !== id));
    await toggle(id);
  };

  return (
    <DashboardShell>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.6vw, 34px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
        Wishlist
      </h1>
      <p style={{ color: MUTED, fontSize: 13.5, margin: "0 0 28px" }}>
        Pieces you have saved for later.
      </p>

      {items === null && <p style={{ color: MUTED, fontSize: 13 }}>Loading…</p>}

      {items?.length === 0 && (
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 18, padding: "56px 24px", textAlign: "center" }}>
          <Heart size={26} color="#A9B199" strokeWidth={1.5} />
          <p style={{ color: MUTED, fontSize: 13.5, margin: "14px 0 20px" }}>
            Nothing saved yet. Tap the heart on any piece to keep it here.
          </p>
          <Link
            href="/mudres/collection"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: DARK, color: WHITE, fontSize: 13, fontWeight: 600, padding: "11px 20px", borderRadius: 999, textDecoration: "none" }}
          >
            Browse the collection <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} style={{ border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden" }}>
              <Link href={`/mudres/collection/${item.id}`} style={{ display: "block", textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "1", background: "#F5F5F1" }}>
                  {item.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  {!item.in_stock && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(42,56,18,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: WHITE, fontSize: 11.5 }}>Out of stock</span>
                    </div>
                  )}
                </div>
              </Link>
              <div style={{ padding: 12 }}>
                <p style={{ color: MUTED, fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{item.category}</p>
                <Link href={`/mudres/collection/${item.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </h3>
                </Link>
                <p style={{ color: DARK, fontSize: 13.5, fontWeight: 700, margin: "0 0 10px" }}>{naira(item.price)}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() =>
                      item.in_stock &&
                      add({ id: item.id, name: item.name, price: item.price ?? 0, image: item.images?.[0] ?? null })
                    }
                    disabled={!item.in_stock}
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      background: item.in_stock ? DARK : "#D8DAD0", color: item.in_stock ? WHITE : MUTED,
                      border: "none", borderRadius: 999, padding: "8px 10px",
                      fontSize: 11.5, fontWeight: 600, cursor: item.in_stock ? "pointer" : "default",
                    }}
                  >
                    <ShoppingBag size={12} /> Add
                  </button>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove from wishlist"
                    style={{
                      width: 32, height: 32, borderRadius: 999, border: `1px solid ${LINE}`,
                      background: WHITE, color: DARK, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                    }}
                  >
                    <Heart size={13} fill={DARK} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
