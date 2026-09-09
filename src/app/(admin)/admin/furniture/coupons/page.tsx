"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, X } from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

type Coupon = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  active: boolean;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10,
  padding: "10px 14px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box",
};

const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ code: "", type: "percent" as "percent" | "fixed", value: "", max_uses: "", expires_at: "" });

  const load = () => {
    fetch("/api/admin/coupons").then((r) => r.json()).then((d) => { setCoupons(Array.isArray(d) ? d : []); setLoading(false); });
  };
  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, value: Number(form.value) }),
    });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to create"); return; }
    setForm({ code: "", type: "percent", value: "", max_uses: "", expires_at: "" });
    setShowForm(false);
    load();
  };

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c.code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    load();
  };

  const remove = async (code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await fetch(`/api/admin/coupons/${code}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ color: NAVY, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 6px" }}>Furniture</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 24, fontWeight: 700, margin: 0 }}>Coupons</h1>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Cancel" : "New Coupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Code *</label>
              <input style={{ ...inputStyle, textTransform: "uppercase" }} value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="LAUNCH10" required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Type</label>
              <select style={inputStyle} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as "percent" | "fixed" }))}>
                <option value="percent">Percent off</option>
                <option value="fixed">Fixed amount off (₦)</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Value *</label>
              <input style={inputStyle} type="number" min="1" value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} placeholder={form.type === "percent" ? "10" : "5000"} required />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Max uses (optional)</label>
              <input style={inputStyle} type="number" min="1" value={form.max_uses} onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))} placeholder="Unlimited" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 }}>Expires (optional)</label>
              <input style={inputStyle} type="date" value={form.expires_at} onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))} />
            </div>
          </div>
          {error && <p style={{ color: "#dc2626", fontSize: 12, margin: "0 0 12px" }}>{error}</p>}
          <button type="submit" disabled={saving} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Creating…" : "Create Coupon"}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading…</div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>
          <Tag size={24} style={{ opacity: 0.4, marginBottom: 8 }} />
          <p style={{ fontSize: 13, margin: 0 }}>No coupons yet</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>
                {["Code", "Discount", "Uses", "Expires", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#0a0a0a" }}>{c.code}</td>
                  <td style={{ padding: "12px 16px", color: "#333" }}>{c.type === "percent" ? `${c.value}%` : `₦${c.value.toLocaleString()}`}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{fmtDate(c.expires_at)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => toggleActive(c)}
                      style={{ background: c.active ? NAVY_BG : "#f5f5f3", color: c.active ? NAVY : "#999", border: "none", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button onClick={() => remove(c.code)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center" }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
