"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Plus, X, Star, MapPin, BedDouble, Bath, Users,
  ChevronDown, Image as ImageIcon, Check, Loader2, Upload,
} from "lucide-react";
import Link from "next/link";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const ORANGE = "#c46442";

const AMENITIES = [
  "WiFi", "AC", "Smart TV", "Kitchen", "Parking", "Pool", "Gym",
  "Garden", "Beach Access", "BBQ", "Workspace", "Security", "Elevator",
  "Washing Machine", "Dishwasher", "Balcony", "City View", "Ocean View",
];
const CITIES = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Benin City"];
const PROPERTY_TYPES = ["Apartment", "Studio", "Penthouse", "Villa", "Loft", "Duplex", "Townhouse"];

const inp: React.CSSProperties = { width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "10px 14px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", color: "#555", fontSize: 11, marginBottom: 6, fontWeight: 600 };

type MediaItem = { key: string; url: string; size: number };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: 20, marginBottom: 14 }}>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 16px" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return <div style={{ flex: half ? "0 0 calc(50% - 6px)" : 1 }}><label style={lbl}>{label}</label>{children}</div>;
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{children}</div>;
}

// ── Media Picker Modal ────────────────────────────────────────────
function MediaPicker({
  onSelectMany,
  onClose,
  alreadySelected,
}: {
  onSelectMany: (urls: string[]) => void;
  onClose: () => void;
  alreadySelected: string[];
}) {
  const supabase = createClient();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Set<string>>(new Set(alreadySelected));

  useState(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      const res = await fetch("/api/admin/media", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  });

  const toggle = (url: string) =>
    setPicked((p) => { const n = new Set(p); n.has(url) ? n.delete(url) : n.add(url); return n; });

  const newCount = [...picked].filter((u) => !alreadySelected.includes(u)).length;

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 }} onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 101, background: "#fff", borderRadius: 20, padding: 24, width: 680, maxWidth: "92vw", maxHeight: "82vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#0a0a0a", margin: 0 }}>Select from Media Library</p>
            <p style={{ color: "#bbb", fontSize: 11, margin: "3px 0 0" }}>Click images to select multiple, then confirm</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X size={16} /></button>
        </div>

        {/* Selection counter */}
        {picked.size > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: NAVY_BG, border: `1px solid #d0cef0`, borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
            <Check size={13} color={NAVY} />
            <span style={{ color: NAVY, fontSize: 12, fontWeight: 600 }}>{picked.size} image{picked.size !== 1 ? "s" : ""} selected</span>
            <button onClick={() => setPicked(new Set())} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 11 }}>Clear all</button>
          </div>
        )}

        {/* Grid */}
        <div style={{ overflowY: "auto", flex: 1, marginBottom: 16 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#ccc" }}><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /></div>
          ) : items.length === 0 ? (
            <p style={{ textAlign: "center", color: "#bbb", padding: "40px 0", fontSize: 13 }}>No images uploaded yet. Go to Media → Upload first.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {items.map((item) => {
                const isSelected = picked.has(item.url);
                return (
                  <button
                    key={item.key}
                    onClick={() => toggle(item.url)}
                    style={{ position: "relative", border: `2px solid ${isSelected ? NAVY : "#ebebeb"}`, borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "none", padding: 0, aspectRatio: "1", display: "block", transition: "border-color 0.15s" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    {/* Checkmark overlay */}
                    {isSelected && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(30,21,109,0.25)", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Check size={12} color="#fff" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
          <button
            onClick={() => { onSelectMany([...picked]); onClose(); }}
            disabled={newCount === 0}
            style={{ flex: 1, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: newCount === 0 ? "not-allowed" : "pointer", opacity: newCount === 0 ? 0.4 : 1 }}
          >
            {newCount === 0 ? "Select images to add" : `Add ${newCount} image${newCount !== 1 ? "s" : ""}`}
          </button>
          <button onClick={onClose} style={{ padding: "11px 20px", borderRadius: 10, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#888", fontSize: 13, cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

// ── Preview Card ──────────────────────────────────────────────────
function Preview({ form }: { form: ReturnType<typeof useFormState> }) {
  const heroImg = form.images[0] ?? null;
  const price = parseInt(form.price) || 0;

  return (
    <div style={{ position: "sticky", top: 24 }}>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 12px" }}>Live Preview</p>

      {/* Card */}
      <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        {/* Hero image */}
        <div style={{ position: "relative", height: 200, background: "#f0f0ee", overflow: "hidden" }}>
          {heroImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ImageIcon size={28} color="#ddd" />
              <p style={{ color: "#ccc", fontSize: 11 }}>Add images to preview</p>
            </div>
          )}
          {/* City badge */}
          {form.city && (
            <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", borderRadius: 7, padding: "3px 9px", fontSize: 11, color: "#555", fontWeight: 600 }}>
              {form.city}
            </div>
          )}
          {/* Image count */}
          {form.images.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.55)", color: "#fff", borderRadius: 7, padding: "3px 9px", fontSize: 11 }}>
              +{form.images.length - 1} more
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px 20px" }}>
          {/* Title + rating */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <h3 style={{ color: "#0a0a0a", fontSize: 15, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              {form.title || <span style={{ color: "#ccc", fontWeight: 400 }}>Property title…</span>}
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              <Star size={12} fill={ORANGE} color={ORANGE} />
              <span style={{ color: "#888", fontSize: 12 }}>New</span>
            </div>
          </div>

          {/* Location */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#bbb", fontSize: 12, marginBottom: 14 }}>
            <MapPin size={11} />
            {form.location || <span style={{ color: "#ddd" }}>Location…</span>}
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {[
              { icon: BedDouble, val: form.bedrooms || "–", label: "bed" },
              { icon: Bath, val: form.bathrooms || "–", label: "bath" },
              { icon: Users, val: form.guests || "–", label: "guests" },
            ].map(({ icon: Icon, val, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f8f8f6", borderRadius: 8, padding: "5px 10px" }}>
                <Icon size={11} color="#bbb" />
                <span style={{ color: "#555", fontSize: 11, fontWeight: 600 }}>{val}</span>
                <span style={{ color: "#bbb", fontSize: 11 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Amenities preview */}
          {form.amenities.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
              {form.amenities.slice(0, 5).map((a) => (
                <span key={a} style={{ background: "#f5f5f3", border: "1px solid #e8e8e4", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#666" }}>{a}</span>
              ))}
              {form.amenities.length > 5 && (
                <span style={{ color: "#bbb", fontSize: 10, padding: "3px 0" }}>+{form.amenities.length - 5} more</span>
              )}
            </div>
          )}

          {/* Description */}
          {form.description && (
            <p style={{ color: "#777", fontSize: 12, lineHeight: 1.6, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {form.description}
            </p>
          )}

          {/* Divider */}
          <div style={{ borderTop: "1px solid #f0f0ee", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ color: "#0a0a0a", fontWeight: 800, fontSize: 17 }}>
                {price ? `₦${price.toLocaleString()}` : <span style={{ color: "#ccc", fontWeight: 400, fontSize: 13 }}>₦––</span>}
              </span>
              <span style={{ color: "#bbb", fontSize: 11 }}> / night</span>
            </div>
            {form.host_name && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: NAVY, fontSize: 11, fontWeight: 700 }}>{form.host_name[0]?.toUpperCase()}</span>
                </div>
                <span style={{ color: "#555", fontSize: 11 }}>{form.host_name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: form.available ? "#15803d" : "#ccc" }} />
        <span style={{ fontSize: 11, color: form.available ? "#15803d" : "#aaa" }}>
          {form.available ? "Will be listed as Live" : "Will be saved as Hidden"}
        </span>
      </div>

      {/* Property type */}
      {form.property_type && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ background: NAVY_BG, color: NAVY, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.05em" }}>{form.property_type.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

// ── Form state hook ───────────────────────────────────────────────
function useFormState() {
  const [form, setForm] = useState({
    title: "", location: "", city: "Lagos", price: "",
    property_type: "Apartment", description: "",
    bedrooms: "1", bathrooms: "1", guests: "2",
    images: [] as string[],
    amenities: [] as string[],
    host_name: "", superhost: false,
    checkin: "14:00", checkout: "11:00", min_nights: "1",
    rules: [] as string[],
    tags: "",
    available: true,
  });

  const set = useCallback(<K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v })), []);

  const toggleAmenity = useCallback((a: string) =>
    setForm((p) => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a] })), []);

  const toggleRule = useCallback((r: string) =>
    setForm((p) => ({ ...p, rules: p.rules.includes(r) ? p.rules.filter((x) => x !== r) : [...p.rules, r] })), []);

  const addImage = useCallback((url: string) =>
    setForm((p) => ({ ...p, images: p.images.includes(url) ? p.images : [...p.images, url] })), []);

  const removeImage = useCallback((url: string) =>
    setForm((p) => ({ ...p, images: p.images.filter((i) => i !== url) })), []);

  return { ...form, set, toggleAmenity, toggleRule, addImage, removeImage };
}

const RULES = ["No smoking", "No pets", "No parties", "No events", "No loud music after 10pm"];

type UploadingImg = { id: string; name: string; status: "uploading" | "done" | "error" };

// ── Page ──────────────────────────────────────────────────────────
export default function NewShortletPage() {
  const router = useRouter();
  const supabase = createClient();
  const form = useFormState();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mediaPicker, setMediaPicker] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadingImgs, setUploadingImgs] = useState<UploadingImg[]>([]);
  const [drag, setDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;

    const ids = arr.map(() => Math.random().toString(36).slice(2));
    setUploadingImgs((p) => [...p, ...arr.map((f, i) => ({ id: ids[i], name: f.name, status: "uploading" as const }))]);

    const token = await getToken();

    await Promise.all(arr.map(async (file, i) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", "abode");
      try {
        const res = await fetch("/api/upload-image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        form.addImage(url);
        setUploadingImgs((p) => p.map((u) => u.id === ids[i] ? { ...u, status: "done" } : u));
      } catch {
        setUploadingImgs((p) => p.map((u) => u.id === ids[i] ? { ...u, status: "error" } : u));
      }
    }));

    setTimeout(() => setUploadingImgs((p) => p.filter((u) => u.status !== "done")), 2500);
  }, [getToken, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    const payload = {
      title: form.title, location: form.location, city: form.city,
      price: parseInt(form.price) || 0, currency: "NGN",
      bedrooms: parseInt(form.bedrooms), bathrooms: parseInt(form.bathrooms),
      guests: parseInt(form.guests), amenities: form.amenities,
      images: form.images,
      host: { name: form.host_name || "Studio Mudiaga", avatar: "", superhost: form.superhost },
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      available: form.available, rating: 0, review_count: 0,
      property_type: form.property_type,
      description: form.description,
      checkin: form.checkin,
      checkout: form.checkout,
      min_nights: parseInt(form.min_nights) || 1,
      rules: form.rules,
    };
    const res = await fetch("/api/admin/shortlets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save"); setSaving(false); return; }
    router.push("/admin/shortlets");
  };

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "flex-start", maxWidth: 1200 }}>
      {/* ── LEFT: Form ── */}
      <div style={{ flex: "0 0 58%", minWidth: 0 }}>
        <Link href="/admin/shortlets" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#aaa", fontSize: 12, textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={12} /> Back to Shortlets
        </Link>
        <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>Add New Shortlet</h1>

        <form onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <Section title="Basic Info">
            <Field label="Property Title *">
              <input style={inp} value={form.title} onChange={(e) => form.set("title", e.target.value)} placeholder="e.g. Luxury Penthouse with Ocean View" required />
            </Field>
            <Row>
              <Field label="Location *">
                <input style={inp} value={form.location} onChange={(e) => form.set("location", e.target.value)} placeholder="e.g. Victoria Island" required />
              </Field>
              <Field label="City *" half>
                <select style={inp} value={form.city} onChange={(e) => form.set("city", e.target.value)}>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </Row>
            <Row>
              <Field label="Price per night (₦) *">
                <input style={inp} type="number" value={form.price} onChange={(e) => form.set("price", e.target.value)} placeholder="85000" required min="0" />
              </Field>
              <Field label="Property Type">
                <div style={{ position: "relative" }}>
                  <select style={{ ...inp, appearance: "none", paddingRight: 32 }} value={form.property_type} onChange={(e) => form.set("property_type", e.target.value)}>
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={13} color="#bbb" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </Field>
            </Row>
          </Section>

          {/* DESCRIPTION */}
          <Section title="Description">
            <Field label="Full Description">
              <textarea
                style={{ ...inp, minHeight: 110, resize: "vertical", lineHeight: 1.6 }}
                value={form.description}
                onChange={(e) => form.set("description", e.target.value)}
                placeholder="Describe the space, the vibe, what makes it special…"
              />
            </Field>
          </Section>

          {/* DETAILS */}
          <Section title="Property Details">
            <Row>
              <Field label="Bedrooms">
                <input style={inp} type="number" value={form.bedrooms} onChange={(e) => form.set("bedrooms", e.target.value)} min="0" />
              </Field>
              <Field label="Bathrooms">
                <input style={inp} type="number" value={form.bathrooms} onChange={(e) => form.set("bathrooms", e.target.value)} min="0" />
              </Field>
              <Field label="Max Guests">
                <input style={inp} type="number" value={form.guests} onChange={(e) => form.set("guests", e.target.value)} min="1" />
              </Field>
            </Row>
          </Section>

          {/* IMAGES */}
          <Section title="Images">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {/* Drag-and-drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `2px dashed ${drag ? NAVY : "#e0e0e0"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: drag ? NAVY_BG : "#fafaf9", transition: "all 0.15s", cursor: "pointer" }}
            >
              <Upload size={22} color={drag ? NAVY : "#ccc"} style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ color: drag ? NAVY : "#888", fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>
                {drag ? "Drop to upload" : "Drag & drop images here"}
              </p>
              <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>or <span style={{ color: NAVY, fontWeight: 600, textDecoration: "underline" }}>click to browse</span> — JPG, PNG, WebP · max 10 MB · multiple allowed</p>
            </div>

            {/* Thumbnail strip — uploaded + uploading */}
            {(form.images.length > 0 || uploadingImgs.length > 0) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {/* Uploaded */}
                {form.images.map((url, i) => (
                  <div key={url} style={{ position: "relative", width: 90, height: 70, borderRadius: 10, overflow: "hidden", border: "1px solid #e8e8e4" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {i === 0 && <div style={{ position: "absolute", bottom: 4, left: 4, background: NAVY, color: "#fff", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>COVER</div>}
                    <button type="button" onClick={() => form.removeImage(url)} style={{ position: "absolute", top: 3, right: 3, width: 18, height: 18, borderRadius: 4, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <X size={10} color="#fff" />
                    </button>
                  </div>
                ))}

                {/* Uploading placeholders */}
                {uploadingImgs.map((u) => (
                  <div key={u.id} style={{ width: 90, height: 70, borderRadius: 10, border: `1px solid ${u.status === "error" ? "#fecaca" : "#e8e8e4"}`, background: u.status === "error" ? "#fff5f5" : "#f8f8f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    {u.status === "uploading"
                      ? <Loader2 size={16} color={NAVY} style={{ animation: "spin 1s linear infinite" }} />
                      : <X size={14} color="#dc2626" />
                    }
                    <span style={{ color: u.status === "error" ? "#dc2626" : "#bbb", fontSize: 9, textAlign: "center", padding: "0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 80 }}>
                      {u.status === "error" ? "Failed" : "Uploading…"}
                    </span>
                  </div>
                ))}

                {/* + Add more button */}
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: 90, height: 70, borderRadius: 10, border: "2px dashed #e0e0e0", background: "#fafaf9", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "#ccc", fontSize: 10 }}>
                  <Plus size={14} /> Add more
                </button>
              </div>
            )}

            {/* Toolbar: Media Library + Paste URL */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button type="button" onClick={() => setMediaPicker(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: NAVY_BG, border: `1px solid #d0cef0`, borderRadius: 10, cursor: "pointer", color: NAVY, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                <ImageIcon size={13} /> Pick from Media Library
              </button>
              <div style={{ display: "flex", flex: 1, gap: 6 }}>
                <input
                  style={{ ...inp, flex: 1 }}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Or paste an image URL…"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (urlInput.trim()) { form.addImage(urlInput.trim()); setUrlInput(""); } } }}
                />
                {urlInput.trim() && (
                  <button type="button" onClick={() => { form.addImage(urlInput.trim()); setUrlInput(""); }}
                    style={{ padding: "9px 14px", background: "#f5f5f3", border: "1px solid #e8e8e4", borderRadius: 10, cursor: "pointer", color: "#555", fontSize: 12, whiteSpace: "nowrap" }}>
                    Add
                  </button>
                )}
              </div>
            </div>
            <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>First image is the cover photo. Uploaded images are saved to ABODE Media.</p>
          </Section>

          {/* AMENITIES */}
          <Section title="Amenities">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {AMENITIES.map((a) => {
                const on = form.amenities.includes(a);
                return (
                  <button key={a} type="button" onClick={() => form.toggleAmenity(a)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "1px solid", background: on ? NAVY_BG : "#f5f5f3", borderColor: on ? NAVY : "#e8e8e4", color: on ? NAVY : "#888", fontWeight: on ? 600 : 400 }}>
                    {on && <Check size={11} />}{a}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* HOST */}
          <Section title="Host Info">
            <Field label="Host Name">
              <input style={inp} value={form.host_name} onChange={(e) => form.set("host_name", e.target.value)} placeholder="e.g. Adaeze Okafor" />
            </Field>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div onClick={() => form.set("superhost", !form.superhost)} style={{ width: 40, height: 22, borderRadius: 11, background: form.superhost ? NAVY : "#e0e0e0", position: "relative", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: form.superhost ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <div>
                <p style={{ color: "#555", fontSize: 13, fontWeight: 500, margin: 0 }}>Superhost</p>
                <p style={{ color: "#bbb", fontSize: 11, margin: "2px 0 0" }}>Show Superhost badge on listing</p>
              </div>
            </label>
          </Section>

          {/* POLICIES */}
          <Section title="Policies">
            <Row>
              <Field label="Check-in Time">
                <input style={inp} type="time" value={form.checkin} onChange={(e) => form.set("checkin", e.target.value)} />
              </Field>
              <Field label="Check-out Time">
                <input style={inp} type="time" value={form.checkout} onChange={(e) => form.set("checkout", e.target.value)} />
              </Field>
              <Field label="Min. Nights">
                <input style={inp} type="number" value={form.min_nights} onChange={(e) => form.set("min_nights", e.target.value)} min="1" />
              </Field>
            </Row>
          </Section>

          {/* RULES */}
          <Section title="House Rules">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {RULES.map((r) => {
                const on = form.rules.includes(r);
                return (
                  <button key={r} type="button" onClick={() => form.toggleRule(r)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: "1px solid", background: on ? "#fff5f5" : "#f5f5f3", borderColor: on ? "#fecaca" : "#e8e8e4", color: on ? "#dc2626" : "#888", fontWeight: on ? 600 : 400 }}>
                    {on && <X size={11} />}{r}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* TAGS + VISIBILITY */}
          <Section title="Tags & Visibility">
            <Field label="Tags (comma-separated)">
              <input style={inp} value={form.tags} onChange={(e) => form.set("tags", e.target.value)} placeholder="Penthouse, Ocean View, Luxury, Superhost" />
            </Field>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div onClick={() => form.set("available", !form.available)} style={{ width: 40, height: 22, borderRadius: 11, background: form.available ? "#15803d" : "#e0e0e0", position: "relative", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: form.available ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <div>
                <p style={{ color: "#555", fontSize: 13, fontWeight: 500, margin: 0 }}>List as available</p>
                <p style={{ color: "#bbb", fontSize: 11, margin: "2px 0 0" }}>Visible to guests on ABODE</p>
              </div>
            </label>
          </Section>

          {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, paddingBottom: 40 }}>
            <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "Save Shortlet"}
            </button>
            <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", padding: "11px 20px", borderRadius: 10, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#888", fontSize: 13, textDecoration: "none" }}>Cancel</Link>
          </div>
        </form>
      </div>

      {/* ── RIGHT: Preview ── */}
      <div style={{ flex: "0 0 38%", minWidth: 0 }}>
        <Preview form={form} />
      </div>

      {/* Media picker modal */}
      {mediaPicker && (
        <MediaPicker
          onSelectMany={(urls) => urls.forEach(form.addImage)}
          onClose={() => setMediaPicker(false)}
          alreadySelected={form.images}
        />
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
