"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart } from "lucide-react";
import type { FurnitureItem } from "@/lib/furniture";
import { useWishlist } from "@/lib/wishlist";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

export default function ProductTile({ item }: { item: FurnitureItem }) {
  const [hover, setHover] = useState(false);
  const { has, toggle, signedIn } = useWishlist();
  const router = useRouter();
  const saved = has(item.id);

  const onWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!signedIn) {
      router.push(`/mudres/login?next=${encodeURIComponent(`/mudres/collection/${item.id}`)}`);
      return;
    }
    toggle(item.id);
  };

  return (
    <Link
      href={`/mudres/collection/${item.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1",
          borderRadius: 14,
          overflow: "hidden",
          background: "rgba(42,56,18,0.04)",
          marginBottom: 12,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images?.[0]}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hover ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
        {item.original_price && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: SAGE,
              color: DARK,
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            SALE
          </div>
        )}
        <button
          onClick={onWishlist}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          style={{
            position: "absolute", top: 10, left: 10, zIndex: 1,
            width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
            background: saved ? DARK : WHITE,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px -4px rgba(28,38,12,0.4)",
          }}
        >
          <Heart size={13} color={saved ? WHITE : DARK} fill={saved ? WHITE : "none"} />
        </button>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: hover ? "rgba(42,56,18,0.12)" : "transparent",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: 10,
            opacity: hover ? 1 : 0,
            transition: "opacity 0.2s ease, background 0.2s ease",
          }}
        >
          <div
            style={{
              background: WHITE,
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShoppingBag size={14} color={DARK} />
          </div>
        </div>
      </div>
      <p
        style={{
          color: "rgba(42,56,18,0.4)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          margin: "0 0 4px",
        }}
      >
        {item.category}
      </p>
      <h3 style={{ color: DARK, fontSize: 13, fontWeight: 600, margin: "0 0 6px" }}>
        {item.name}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: DARK, fontWeight: 700, fontSize: 14 }}>
          ₦{item.price?.toLocaleString()}
        </span>
        {item.original_price && (
          <span
            style={{
              color: "rgba(42,56,18,0.3)",
              fontSize: 12,
              textDecoration: "line-through",
            }}
          >
            ₦{item.original_price.toLocaleString()}
          </span>
        )}
      </div>
    </Link>
  );
}
