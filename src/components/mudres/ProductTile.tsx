"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { FurnitureItem } from "@/lib/furniture";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

export default function ProductTile({ item }: { item: FurnitureItem }) {
  const [hover, setHover] = useState(false);

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
