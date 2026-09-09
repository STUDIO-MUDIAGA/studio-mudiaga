"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const DARK = "#2A3812";
const WHITE = "#FFFFFF";
const SAGE = "#96B85D";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Could not subscribe right now.");
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  };

  if (status === "done") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: WHITE, fontSize: 13.5, fontWeight: 600 }}>
        <CheckCircle2 size={16} color={SAGE} /> You&apos;re on the list.
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        style={{
          width: 260, maxWidth: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 999, padding: "12px 18px", color: WHITE, fontSize: 13.5, outline: "none", boxSizing: "border-box", fontFamily: "inherit",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: WHITE, color: DARK, fontWeight: 600, fontSize: 13,
          padding: "12px 22px", borderRadius: 999, border: "none", cursor: "pointer", opacity: status === "loading" ? 0.6 : 1, fontFamily: "inherit",
        }}
      >
        {status === "loading" ? "..." : "Subscribe"} {status !== "loading" && <ArrowRight size={14} />}
      </button>
      {error && <p style={{ width: "100%", textAlign: "center", color: "#e8a3a3", fontSize: 12, margin: "4px 0 0" }}>{error}</p>}
    </form>
  );
}
