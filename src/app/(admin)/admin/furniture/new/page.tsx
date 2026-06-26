"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NAVY = "#1e156d";
const CATEGORIES = ["Sofa","Chair","Table","Bed","Storage","Lighting","Décor","Outdoor","Office","Dining"];
const MATERIALS = ["Wood","Metal","Fabric","Leather","Glass","Marble","Rattan","Velvet","Steel","Oak","Walnut"];

const inputStyle = { width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "10px 14px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" as const };
const labelStyle = { display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 };

export default function NewFurniturePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", category: "Sofa", material: "", price: "", original_price: "", description: "", dimensions: "", weight: "", colors: "", images: "", tags: "", in_stock: true, featured: false });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { name: form.name, category: form.category, material: form.material, price: parseInt(form.price), original_price: form.original_price ? parseInt(form.original_price) : null, currency: "NGN", description: form.description, dimensions: form.dimensions, weight: form.weight, colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean), images: form.images.split(",").map((u) => u.trim()).filter(Boolean), tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), in_stock: form.in_stock, featured: form.featured, rating: 0, review_count: 0 };
    const res = await fetch("/api/admin/furniture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save"); setSaving(false); return; }
    router.push("/admin/furniture");
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/furniture" style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontSize: 12, textDecoration: "none", marginBottom: 16 }}><ArrowLeft size={12} /> Back to Furniture</Link>
        <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>Add New Item</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Section title="Basic Info">
          <Field label="Name *"><input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Lagos Lounge Sofa" required /></Field>
          <Row>
            <Field label="Category *"><select style={inputStyle} value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Material"><select style={inputStyle} value={form.material} onChange={(e) => set("material", e.target.value)}><option value="">Select material</option>{MATERIALS.map((m) => <option key={m}>{m}</option>)}</select></Field>
          </Row>
          <Row>
            <Field label="Price (₦) *"><input style={inputStyle} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="350000" required min="0" /></Field>
            <Field label="Original Price (₦)"><input style={inputStyle} type="number" value={form.original_price} onChange={(e) => set("original_price", e.target.value)} placeholder="420000 (for sale)" min="0" /></Field>
          </Row>
        </Section>
        <Section title="Description & Specs">
          <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe the piece…" /></Field>
          <Row>
            <Field label="Dimensions"><input style={inputStyle} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="e.g. 220cm × 90cm × 80cm" /></Field>
            <Field label="Weight"><input style={inputStyle} value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 45kg" /></Field>
          </Row>
          <Field label="Available Colors (comma-separated)"><input style={inputStyle} value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="Charcoal, Ivory, Terracotta" /></Field>
        </Section>
        <Section title="Images & Tags">
          <Field label="Image URLs (comma-separated)"><textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="https://..., https://..." /></Field>
          <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Modern, Minimalist, Lagos" /></Field>
        </Section>
        <Section title="Status">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}><input type="checkbox" checked={form.in_stock} onChange={(e) => set("in_stock", e.target.checked)} /><span style={{ color: "#555", fontSize: 13 }}>In stock (available for purchase)</span></label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /><span style={{ color: "#555", fontSize: 13 }}>Featured on homepage</span></label>
          </div>
        </Section>
        {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save Item"}</button>
          <Link href="/admin/furniture" style={{ display: "flex", alignItems: "center", padding: "11px 20px", borderRadius: 10, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#888", fontSize: 13, textDecoration: "none" }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: 20, marginBottom: 16 }}>
      <p style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ flex: 1 }}><label style={labelStyle}>{label}</label>{children}</div>;
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12 }}>{children}</div>;
}
