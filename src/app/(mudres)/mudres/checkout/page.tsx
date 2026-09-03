"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/context/AuthContext";
import { HEADER_SPACE } from "@/components/mudres/MudresHeader";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const LINE = "#E7E8E0";
const SURFACE = "#F5F5F1";

const naira = (n: number) => `₦${n.toLocaleString()}`;

const inputStyle: React.CSSProperties = {
  width: "100%", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 12,
  padding: "12px 14px", color: DARK, fontSize: 13.5, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const { user, profile, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "", state: "", notes: "",
  });
  const [payment, setPayment] = useState<"transfer" | "on_delivery">("transfer");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        payment_method: payment,
        items: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not place the order. Please try again.");
      setSubmitting(false);
      return;
    }

    clear();
    setPlaced(data.id);
    setSubmitting(false);
  };

  const shell = (children: React.ReactNode) => (
    <div style={{ background: WHITE, minHeight: "100vh", color: DARK, paddingTop: HEADER_SPACE + 16 }}>
      <div className="px-5 md:px-10 pt-8 pb-20" style={{ maxWidth: 1000, margin: "0 auto" }}>{children}</div>
    </div>
  );

  if (placed) {
    return shell(
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: "56px 28px", textAlign: "center" }}>
        <CheckCircle2 size={32} color="#5F8F3C" strokeWidth={1.6} />
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "16px 0 8px" }}>Order placed</h1>
        <p style={{ color: "#6F7A5E", fontSize: 14, lineHeight: 1.7, margin: "0 0 6px" }}>
          Your reference is <strong style={{ color: DARK }}>{placed}</strong>.
        </p>
        <p style={{ color: "#6F7A5E", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          The studio will confirm delivery cost and payment details by email.
        </p>
        <Link href="/mudres/orders" style={primaryButton}>
          View my orders <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  if (authLoading) {
    return shell(<p style={{ color: "#8A9276", fontSize: 13 }}>Loading…</p>);
  }

  // Signed out: the order cannot be attributed to anyone, so ask first.
  if (!user) {
    return shell(
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: "56px 28px", textAlign: "center", maxWidth: 460, margin: "0 auto" }}>
        <Lock size={26} color="#A9B199" strokeWidth={1.6} />
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "16px 0 8px" }}>Sign in to checkout</h1>
        <p style={{ color: "#6F7A5E", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          Your cart is saved. Sign in and you will come straight back here.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/mudres/login?next=/mudres/checkout" style={primaryButton}>
            Sign in <ArrowRight size={15} />
          </Link>
          <Link href="/mudres/signup?next=/mudres/checkout" style={secondaryButton}>
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return shell(
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: "56px 28px", textAlign: "center" }}>
        <p style={{ color: "#6F7A5E", fontSize: 14, margin: "0 0 20px" }}>Your cart is empty.</p>
        <Link href="/mudres/collection" style={primaryButton}>
          Browse the collection <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return shell(
    <>
      <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
        Checkout
      </h1>
      <p style={{ color: "#6F7A5E", fontSize: 14, margin: "0 0 32px" }}>
        Signed in as {profile?.email ?? user.email}
      </p>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-8 items-start">
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px" }}>Delivery details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full name" required>
              <input value={form.full_name} onChange={set("full_name")} required style={inputStyle} />
            </Field>
            <Field label="Phone" required>
              <input value={form.phone} onChange={set("phone")} required inputMode="tel" style={inputStyle} />
            </Field>
          </div>

          <Field label="Delivery address" required>
            <input value={form.address} onChange={set("address")} required style={inputStyle} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="City" required>
              <input value={form.city} onChange={set("city")} required style={inputStyle} />
            </Field>
            <Field label="State" required>
              <input value={form.state} onChange={set("state")} required style={inputStyle} />
            </Field>
          </div>

          <Field label="Delivery notes">
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="Landmarks, access instructions, preferred delivery window."
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </Field>

          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "24px 0 12px" }}>Payment</h2>
          <div style={{ display: "grid", gap: 8 }}>
            <PayOption
              checked={payment === "transfer"}
              onSelect={() => setPayment("transfer")}
              title="Bank transfer"
              copy="The studio sends account details and confirms once payment lands."
            />
            <PayOption
              checked={payment === "on_delivery"}
              onSelect={() => setPayment("on_delivery")}
              title="Pay on delivery"
              copy="Settle the balance when the piece arrives."
            />
          </div>
        </div>

        <div style={{ border: `1px solid ${LINE}`, borderRadius: 20, padding: 22, background: SURFACE }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Order</h2>

          {lines.map((line) => (
            <div key={line.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <span style={{ color: "#6F7A5E", fontSize: 13, minWidth: 0 }}>
                {line.name} <span style={{ color: "#9AA388" }}>x{line.quantity}</span>
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                {naira(line.price * line.quantity)}
              </span>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${LINE}`, margin: "14px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ color: "#6F7A5E", fontSize: 13 }}>Total</span>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{naira(subtotal)}</span>
          </div>
          <p style={{ color: "#8A9276", fontSize: 11.5, lineHeight: 1.6, margin: "8px 0 0" }}>
            Delivery is quoted separately once the studio reviews your address.
          </p>

          {error && (
            <p style={{ color: "#A33", fontSize: 12.5, lineHeight: 1.6, margin: "14px 0 0" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...primaryButton, width: "100%", justifyContent: "center", marginTop: 16,
              border: "none", cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Placing order…" : "Place order"} {!submitting && <ArrowRight size={15} />}
          </button>
          <button
            type="button"
            onClick={() => router.push("/mudres/cart")}
            style={{
              width: "100%", marginTop: 8, background: "transparent", border: "none",
              color: "#6F7A5E", fontSize: 12.5, cursor: "pointer", padding: 8, fontFamily: "inherit",
            }}
          >
            Back to cart
          </button>
        </div>
      </form>
    </>
  );
}

const primaryButton: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: DARK, color: WHITE, fontWeight: 600, fontSize: 13,
  padding: "13px 24px", borderRadius: 999, textDecoration: "none",
};

const secondaryButton: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: WHITE, color: DARK, fontWeight: 600, fontSize: 13,
  padding: "13px 24px", borderRadius: 999, textDecoration: "none",
  border: `1px solid ${LINE}`,
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", color: "#6F7A5E", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#A33" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function PayOption({
  checked, onSelect, title, copy,
}: { checked: boolean; onSelect: () => void; title: string; copy: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "flex-start", gap: 11, textAlign: "left",
        padding: "13px 15px", borderRadius: 14, cursor: "pointer", width: "100%",
        border: `1px solid ${checked ? DARK : LINE}`,
        background: checked ? SURFACE : WHITE,
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: 16, height: 16, borderRadius: "50%", flex: "0 0 auto", marginTop: 2,
          border: `1px solid ${checked ? DARK : "#C3C9B6"}`,
          background: checked ? DARK : "transparent",
          boxShadow: checked ? `inset 0 0 0 3px ${SURFACE}` : "none",
        }}
      />
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", color: DARK, fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{title}</span>
        <span style={{ display: "block", color: "#6F7A5E", fontSize: 12.5, lineHeight: 1.5 }}>{copy}</span>
      </span>
    </button>
  );
}
