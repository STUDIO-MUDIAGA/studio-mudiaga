"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NAVY = "#1e156d";
const AMENITIES = ["WiFi","AC","Smart TV","Kitchen","Parking","Pool","Gym","Garden","Beach Access","BBQ","Workspace","Security","Elevator"];

const inputStyle = { width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "10px 14px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" as const };
const labelStyle = { display: "block", color: "#555", fontSize: 12, marginBottom: 6, fontWeight: 500 };

export default function NewShortletPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", location: "", city: "Lagos", price: "", bedrooms: "1", bathrooms: "1", guests: "2", amenities: [] as string[], tags: "", images: "", host_name: "", available: true });

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const toggleAmenity = (a: string) => set("amenities", form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { title: form.title, location: form.location, city: form.city, price: parseInt(form.price), currency: "NGN", bedrooms: parseInt(form.bedrooms), bathrooms: parseInt(form.bathrooms), guests: parseInt(form.guests), amenities: form.amenities, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), images: form.images.split(",").map((u) => u.trim()).filter(Boolean), host: { name: form.host_name || "Studio Mudiaga", avatar: "", superhost: false }, available: form.available, rating: 0, review_count: 0 };
    const res = await fetch("/api/admin/shortlets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save"); setSaving(false); return; }
    router.push("/admin/shortlets");
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontSize: 12, textDecoration: "none", marginBottom: 16 }}><ArrowLeft size={12} /> Back to Shortlets</Link>
        <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>Add New Shortlet</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <Section title="Basic Info">
          <Field label="Title *"><input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Luxury Penthouse with Ocean View" required /></Field>
          <Row>
            <Field label="Location *"><input style={inputStyle} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Victoria Island, Lagos" required /></Field>
            <Field label="City *"><select style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)}><option>Lagos</option><option>Abuja</option><option>Port Harcourt</option></select></Field>
          </Row>
          <Field label="Price per night (₦) *"><input style={inputStyle} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="85000" required min="0" /></Field>
        </Section>
        <Section title="Details">
          <Row>
            <Field label="Bedrooms"><input style={inputStyle} type="number" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} min="0" /></Field>
            <Field label="Bathrooms"><input style={inputStyle} type="number" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} min="0" /></Field>
            <Field label="Max Guests"><input style={inputStyle} type="number" value={form.guests} onChange={(e) => set("guests", e.target.value)} min="1" /></Field>
          </Row>
          <Field label="Host Name"><input style={inputStyle} value={form.host_name} onChange={(e) => set("host_name", e.target.value)} placeholder="e.g. Adaeze Okafor" /></Field>
        </Section>
        <Section title="Amenities">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AMENITIES.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "1px solid", background: form.amenities.includes(a) ? "#f0effe" : "#f5f5f3", borderColor: form.amenities.includes(a) ? NAVY : "#e8e8e4", color: form.amenities.includes(a) ? NAVY : "#888", fontWeight: form.amenities.includes(a) ? 600 : 400 }}>{a}</button>
            ))}
          </div>
        </Section>
        <Section title="Images & Tags">
          <Field label="Image URLs (comma-separated)"><textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.images} onChange={(e) => set("images", e.target.value)} placeholder="https://..., https://..." /></Field>
          <Field label="Tags (comma-separated)"><input style={inputStyle} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="Penthouse, Ocean View, Luxury" /></Field>
        </Section>
        <Section title="Visibility">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={form.available} onChange={(e) => set("available", e.target.checked)} />
            <span style={{ color: "#555", fontSize: 13 }}>List as available (visible on site)</span>
          </label>
        </Section>
        {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" disabled={saving} style={{ background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>{saving ? "Saving…" : "Save Shortlet"}</button>
          <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", padding: "11px 20px", borderRadius: 10, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#888", fontSize: 13, textDecoration: "none" }}>Cancel</Link>
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
