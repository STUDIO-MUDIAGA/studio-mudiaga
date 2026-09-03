"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove } = useCart();

  return (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      <div className="px-5 md:px-10 pt-8 pb-20" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
          Your cart
        </h1>
        <p style={{ color: "#6F7A5E", fontSize: 14, margin: "0 0 32px" }}>
          {lines.length === 0
            ? "Nothing here yet."
            : `${lines.length} ${lines.length === 1 ? "piece" : "pieces"} ready for checkout.`}
        </p>

        {lines.length === 0 ? (
          <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: "64px 24px", textAlign: "center" }}>
            <ShoppingBag size={28} color="#A9B199" strokeWidth={1.5} />
            <p style={{ color: "#6F7A5E", fontSize: 14, margin: "14px 0 20px" }}>
              Your cart is empty.
            </p>
            <Link href="/mudres/collection" style={primaryButton}>
              Browse the collection <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-8 items-start">
            {/* Lines */}
            <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, overflow: "hidden" }}>
              {lines.map((line, i) => (
                <div
                  key={line.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 16, padding: 16,
                    borderTop: i === 0 ? "none" : `1px solid ${LINE}`,
                  }}
                >
                  <Link
                    href={`/mudres/collection/${line.id}`}
                    style={{
                      width: 84, height: 84, borderRadius: 14, overflow: "hidden",
                      background: SURFACE, flex: "0 0 auto", display: "block",
                    }}
                  >
                    {line.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.image} alt={line.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </Link>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Link
                      href={`/mudres/collection/${line.id}`}
                      style={{ color: DARK, fontSize: 15, fontWeight: 600, textDecoration: "none", display: "block", marginBottom: 4 }}
                    >
                      {line.name}
                    </Link>
                    <p style={{ color: "#6F7A5E", fontSize: 13, margin: 0 }}>{naira(line.price)} each</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 4, border: `1px solid ${LINE}`, borderRadius: 999, padding: 3 }}>
                    <StepButton label="Decrease quantity" onClick={() => setQuantity(line.id, line.quantity - 1)}>
                      <Minus size={14} />
                    </StepButton>
                    <span style={{ minWidth: 24, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                      {line.quantity}
                    </span>
                    <StepButton label="Increase quantity" onClick={() => setQuantity(line.id, line.quantity + 1)}>
                      <Plus size={14} />
                    </StepButton>
                  </div>

                  <p style={{ minWidth: 110, textAlign: "right", fontSize: 15, fontWeight: 700, margin: 0 }}>
                    {naira(line.price * line.quantity)}
                  </p>

                  <button
                    aria-label={`Remove ${line.name}`}
                    onClick={() => remove(line.id)}
                    style={{
                      width: 34, height: 34, borderRadius: 999, cursor: "pointer",
                      border: `1px solid ${LINE}`, background: "transparent", color: "#8A9276",
                      display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: 22, background: SURFACE }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Summary</h2>
              <Row label="Subtotal" value={naira(subtotal)} />
              <Row label="Delivery" value="Quoted after review" muted />
              <div style={{ borderTop: `1px solid ${LINE}`, margin: "14px 0" }} />
              <Row label="Total" value={naira(subtotal)} strong />
              <Link href="/mudres/checkout" style={{ ...primaryButton, width: "100%", justifyContent: "center", marginTop: 18 }}>
                Checkout <ArrowRight size={15} />
              </Link>
              <p style={{ color: "#8A9276", fontSize: 11.5, lineHeight: 1.6, margin: "12px 0 0", textAlign: "center" }}>
                You will be asked to sign in before placing the order.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: DARK, color: WHITE, fontWeight: 600, fontSize: 13,
  padding: "13px 24px", borderRadius: 999, textDecoration: "none",
};

function StepButton({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: 999, cursor: "pointer",
        border: "none", background: "transparent", color: DARK,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function Row({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
      <span style={{ color: "#6F7A5E", fontSize: 13 }}>{label}</span>
      <span style={{ color: muted ? "#8A9276" : DARK, fontSize: strong ? 17 : 13.5, fontWeight: strong ? 700 : 600 }}>
        {value}
      </span>
    </div>
  );
}
