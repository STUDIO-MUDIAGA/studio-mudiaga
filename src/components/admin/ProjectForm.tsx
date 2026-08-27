"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Plus, X, Image as ImageIcon, Check, Loader2, Upload, GripVertical,
} from "lucide-react";
import { slugify, isValidSlug } from "@/lib/media-categories";
import { RESERVED_PROJECT_SLUGS } from "@/lib/project-constants";
import type { DbProject } from "@/lib/projects";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

const inp: React.CSSProperties = { width: "100%", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "10px 14px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" };
const lbl: React.CSSProperties = { display: "block", color: "#555", fontSize: 11, marginBottom: 6, fontWeight: 600 };

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14, padding: 20, marginBottom: 14 }}>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 4px" }}>{title}</p>
      {hint && <p style={{ color: "#ccc", fontSize: 11, margin: "0 0 14px" }}>{hint}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: hint ? 0 : 4 }}>{children}</div>
    </div>
  );
}
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return <div style={{ flex: half ? "0 0 calc(50% - 6px)" : 1 }}><label style={lbl}>{label}</label>{children}</div>;
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{children}</div>;
}

type MediaItem = { key: string; url: string; size: number };

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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#0a0a0a", margin: 0 }}>Select from Media Library</p>
            <p style={{ color: "#bbb", fontSize: 11, margin: "3px 0 0" }}>Click images to select multiple, then confirm</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X size={16} /></button>
        </div>

        {picked.size > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: NAVY_BG, border: `1px solid #d0cef0`, borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
            <Check size={13} color={NAVY} />
            <span style={{ color: NAVY, fontSize: 12, fontWeight: 600 }}>{picked.size} image{picked.size !== 1 ? "s" : ""} selected</span>
            <button onClick={() => setPicked(new Set())} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 11 }}>Clear all</button>
          </div>
        )}

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

type Fact = { value: string; label: string };
type GalleryImg = { src: string; alt: string };
type UploadingImg = { id: string; name: string; status: "uploading" | "done" | "error" };
type UploadTarget = "hero" | "gallery";

export type ProjectFormValues = {
  title: string;
  slug: string;
  eyebrow: string;
  location: string;
  hero_image: string;
  intro: string[];
  facts: Fact[];
  gallery: GalleryImg[];
  cta_label: string;
  cta_href: string;
  published: boolean;
};

const EMPTY: ProjectFormValues = {
  title: "",
  slug: "",
  eyebrow: "Interior Design",
  location: "Nigeria",
  hero_image: "",
  intro: [""],
  facts: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }],
  gallery: [],
  cta_label: "Enquire About a Project Like This",
  cta_href: "/book-a-consultation",
  published: true,
};

export default function ProjectForm({
  mode,
  projectId,
  initial,
}: {
  mode: "new" | "edit";
  projectId?: string;
  initial?: Partial<DbProject>;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<ProjectFormValues>(() => ({
    title: initial?.title ?? EMPTY.title,
    slug: initial?.slug ?? EMPTY.slug,
    eyebrow: initial?.eyebrow ?? EMPTY.eyebrow,
    location: initial?.location ?? EMPTY.location,
    hero_image: initial?.hero_image ?? EMPTY.hero_image,
    intro: initial?.intro?.length ? initial.intro : EMPTY.intro,
    facts: initial?.facts?.length ? initial.facts : EMPTY.facts,
    gallery: initial?.gallery ?? EMPTY.gallery,
    cta_label: initial?.cta_label ?? EMPTY.cta_label,
    cta_href: initial?.cta_href ?? EMPTY.cta_href,
    published: initial?.published ?? EMPTY.published,
  }));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mediaPicker, setMediaPicker] = useState<UploadTarget | null>(null);
  const [uploadingImgs, setUploadingImgs] = useState<UploadingImg[]>([]);
  const [drag, setDrag] = useState<UploadTarget | null>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof ProjectFormValues>(k: K, v: ProjectFormValues[K]) =>
    setForm((p) => ({ ...p, [k]: v })), []);

  const handleTitleChange = (title: string) => {
    set("title", title);
    if (!slugTouched) set("slug", slugify(title));
  };

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const prefix = () => `project-${form.slug || "untitled"}`;

  const handleFiles = useCallback(async (files: FileList | File[], target: UploadTarget) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;

    const ids = arr.map(() => Math.random().toString(36).slice(2));
    setUploadingImgs((p) => [...p, ...arr.map((f, i) => ({ id: ids[i], name: f.name, status: "uploading" as const }))]);

    const token = await getToken();

    await Promise.all(arr.map(async (file, i) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", prefix());
      try {
        const res = await fetch("/api/upload-image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        if (target === "hero") {
          set("hero_image", url);
        } else {
          setForm((p) => ({ ...p, gallery: [...p.gallery, { src: url, alt: form.title || "Project image" }] }));
        }
        setUploadingImgs((p) => p.map((u) => u.id === ids[i] ? { ...u, status: "done" } : u));
      } catch {
        setUploadingImgs((p) => p.map((u) => u.id === ids[i] ? { ...u, status: "error" } : u));
      }
    }));

    setTimeout(() => setUploadingImgs((p) => p.filter((u) => u.status !== "done")), 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken, form.slug, form.title]);

  const addIntroParagraph = () => set("intro", [...form.intro, ""]);
  const updateIntroParagraph = (i: number, v: string) => set("intro", form.intro.map((p, idx) => (idx === i ? v : p)));
  const removeIntroParagraph = (i: number) => set("intro", form.intro.filter((_, idx) => idx !== i));

  const updateFact = (i: number, key: keyof Fact, v: string) =>
    set("facts", form.facts.map((f, idx) => (idx === i ? { ...f, [key]: v } : f)));
  const addFact = () => { if (form.facts.length < 6) set("facts", [...form.facts, { value: "", label: "" }]); };
  const removeFact = (i: number) => set("facts", form.facts.filter((_, idx) => idx !== i));

  const removeGalleryImage = (i: number) => set("gallery", form.gallery.filter((_, idx) => idx !== i));
  const updateGalleryAlt = (i: number, alt: string) => set("gallery", form.gallery.map((g, idx) => (idx === i ? { ...g, alt } : g)));
  const addGalleryUrls = (urls: string[]) =>
    setForm((p) => ({ ...p, gallery: [...p.gallery, ...urls.filter((u) => !p.gallery.some((g) => g.src === u)).map((u) => ({ src: u, alt: p.title || "Project image" }))] }));
  const handleMediaPickerSelect = (urls: string[]) => {
    if (mediaPicker === "hero") { if (urls[0]) set("hero_image", urls[0]); }
    else addGalleryUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidSlug(form.slug)) {
      setError("Slug must be lowercase letters, numbers, and hyphens only.");
      return;
    }
    if (RESERVED_PROJECT_SLUGS.includes(form.slug)) {
      setError(`"${form.slug}" is reserved and can't be used as a slug.`);
      return;
    }
    if (!form.hero_image) {
      setError("Add a hero image before saving.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      eyebrow: form.eyebrow,
      location: form.location,
      hero_image: form.hero_image,
      intro: form.intro.map((p) => p.trim()).filter(Boolean),
      facts: form.facts.filter((f) => f.value.trim() || f.label.trim()),
      gallery: form.gallery,
      cta_label: form.cta_label,
      cta_href: form.cta_href,
      published: form.published,
    };

    const url = mode === "new" ? "/api/admin/projects" : `/api/admin/projects/${projectId}`;
    const method = mode === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save"); setSaving(false); return; }
    router.push("/admin/projects");
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <Link href="/admin/projects" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#aaa", fontSize: 12, textDecoration: "none", marginBottom: 20 }}>
        <ArrowLeft size={12} /> Back to Projects
      </Link>
      <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: "0 0 20px" }}>
        {mode === "new" ? "Add New Project" : "Edit Project"}
      </h1>

      <form onSubmit={handleSubmit}>
        <Section title="Basic Info">
          <Field label="Project Title *">
            <input style={inp} value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Whitfield Residence" required />
          </Field>
          <Row>
            <Field label="URL Slug *" half>
              <input
                style={inp}
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
                placeholder="whitfield-residence"
                required
              />
            </Field>
            <Field label="Location" half>
              <input style={inp} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Nigeria" />
            </Field>
          </Row>
          <Field label="Eyebrow">
            <input style={inp} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Project: Interior Design" />
          </Field>
          <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>
            Will be live at <span style={{ color: "#888" }}>/projects/{form.slug || "your-slug"}</span>
          </p>
        </Section>

        <Section title="Hero Image" hint="Shown full-bleed at the top of the project page and as its card on the Projects listing.">
          <input ref={heroInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => e.target.files && handleFiles(e.target.files, "hero")} />
          {form.hero_image ? (
            <div style={{ position: "relative", width: "100%", height: 180, borderRadius: 12, overflow: "hidden", border: "1px solid #e8e8e4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.hero_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => set("hero_image", "")} style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: 6, background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={13} color="#fff" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag("hero"); }}
              onDragLeave={() => setDrag(null)}
              onDrop={(e) => { e.preventDefault(); setDrag(null); handleFiles(e.dataTransfer.files, "hero"); }}
              onClick={() => heroInputRef.current?.click()}
              style={{ border: `2px dashed ${drag === "hero" ? NAVY : "#e0e0e0"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: drag === "hero" ? NAVY_BG : "#fafaf9", transition: "all 0.15s", cursor: "pointer" }}
            >
              <Upload size={22} color={drag === "hero" ? NAVY : "#ccc"} style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ color: drag === "hero" ? NAVY : "#888", fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>
                {drag === "hero" ? "Drop to upload" : "Drag & drop a hero image here"}
              </p>
              <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>or <span style={{ color: NAVY, fontWeight: 600, textDecoration: "underline" }}>click to browse</span></p>
            </div>
          )}
          <button type="button" onClick={() => setMediaPicker("hero")}
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: NAVY_BG, border: `1px solid #d0cef0`, borderRadius: 10, cursor: "pointer", color: NAVY, fontSize: 12, fontWeight: 600 }}>
            <ImageIcon size={13} /> Pick from Media Library
          </button>
        </Section>

        <Section title="Intro" hint="One or more paragraphs introducing the project. Shown under 'About the Project'.">
          {form.intro.map((paragraph, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <textarea
                style={{ ...inp, minHeight: 80, resize: "vertical", lineHeight: 1.6, flex: 1 }}
                value={paragraph}
                onChange={(e) => updateIntroParagraph(i, e.target.value)}
                placeholder="Describe the brief, the materials, the feeling of the space…"
              />
              {form.intro.length > 1 && (
                <button type="button" onClick={() => removeIntroParagraph(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 4 }}>
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIntroParagraph} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px dashed #e0e0e0", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#888", fontSize: 12 }}>
            <Plus size={12} /> Add paragraph
          </button>
        </Section>

        <Section title="Facts" hint="Small stats shown in a strip under the intro, e.g. rooms, location, year completed.">
          {form.facts.map((fact, i) => (
            <Row key={i}>
              <Field label="Value" half>
                <input style={inp} value={fact.value} onChange={(e) => updateFact(i, "value", e.target.value)} placeholder="e.g. 2024" />
              </Field>
              <div style={{ display: "flex", gap: 8, flex: "0 0 calc(50% - 6px)", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Label</label>
                  <input style={inp} value={fact.label} onChange={(e) => updateFact(i, "label", e.target.value)} placeholder="e.g. Completed" />
                </div>
                {form.facts.length > 1 && (
                  <button type="button" onClick={() => removeFact(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: "10px 4px" }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </Row>
          ))}
          {form.facts.length < 6 && (
            <button type="button" onClick={addFact} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px dashed #e0e0e0", borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: "#888", fontSize: 12 }}>
              <Plus size={12} /> Add fact
            </button>
          )}
        </Section>

        <Section title="Gallery" hint="Additional images shown in the gallery grid near the bottom of the project page.">
          <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => e.target.files && handleFiles(e.target.files, "gallery")} />

          <div
            onDragOver={(e) => { e.preventDefault(); setDrag("gallery"); }}
            onDragLeave={() => setDrag(null)}
            onDrop={(e) => { e.preventDefault(); setDrag(null); handleFiles(e.dataTransfer.files, "gallery"); }}
            onClick={() => galleryInputRef.current?.click()}
            style={{ border: `2px dashed ${drag === "gallery" ? NAVY : "#e0e0e0"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", background: drag === "gallery" ? NAVY_BG : "#fafaf9", transition: "all 0.15s", cursor: "pointer" }}
          >
            <Upload size={22} color={drag === "gallery" ? NAVY : "#ccc"} style={{ margin: "0 auto 8px", display: "block" }} />
            <p style={{ color: drag === "gallery" ? NAVY : "#888", fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>
              {drag === "gallery" ? "Drop to upload" : "Drag & drop gallery images here"}
            </p>
            <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>or <span style={{ color: NAVY, fontWeight: 600, textDecoration: "underline" }}>click to browse</span> · multiple allowed</p>
          </div>

          {(form.gallery.length > 0 || uploadingImgs.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.gallery.map((img, i) => (
                <div key={img.src + i} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #e8e8e4", borderRadius: 10, padding: 8 }}>
                  <GripVertical size={14} color="#ddd" />
                  <div style={{ width: 56, height: 44, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#f0f0f0" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <input
                    style={{ ...inp, flex: 1 }}
                    value={img.alt}
                    onChange={(e) => updateGalleryAlt(i, e.target.value)}
                    placeholder="Alt text (for accessibility)"
                  />
                  <button type="button" onClick={() => removeGalleryImage(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 4, flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {uploadingImgs.map((u) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${u.status === "error" ? "#fecaca" : "#e8e8e4"}`, borderRadius: 10, padding: 8, background: u.status === "error" ? "#fff5f5" : "#fafaf9" }}>
                  {u.status === "uploading"
                    ? <Loader2 size={14} color={NAVY} style={{ animation: "spin 1s linear infinite" }} />
                    : <X size={14} color="#dc2626" />}
                  <span style={{ color: u.status === "error" ? "#dc2626" : "#bbb", fontSize: 12 }}>{u.status === "error" ? `Failed: ${u.name}` : `Uploading ${u.name}…`}</span>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={() => setMediaPicker("gallery")}
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", background: NAVY_BG, border: `1px solid #d0cef0`, borderRadius: 10, cursor: "pointer", color: NAVY, fontSize: 12, fontWeight: 600 }}>
            <ImageIcon size={13} /> Pick from Media Library
          </button>
        </Section>

        <Section title="Call to Action">
          <Row>
            <Field label="Button Label">
              <input style={inp} value={form.cta_label} onChange={(e) => set("cta_label", e.target.value)} />
            </Field>
            <Field label="Button Link">
              <input style={inp} value={form.cta_href} onChange={(e) => set("cta_href", e.target.value)} />
            </Field>
          </Row>
        </Section>

        <Section title="Visibility">
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div onClick={() => set("published", !form.published)} style={{ width: 40, height: 22, borderRadius: 11, background: form.published ? "#15803d" : "#e0e0e0", position: "relative", transition: "background 0.2s", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ position: "absolute", top: 3, left: form.published ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
            <div>
              <p style={{ color: "#555", fontSize: 13, fontWeight: 500, margin: 0 }}>Published</p>
              <p style={{ color: "#bbb", fontSize: 11, margin: "2px 0 0" }}>Visible on the Projects page and its own URL</p>
            </div>
          </label>
        </Section>

        {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, paddingBottom: 40 }}>
          <button type="submit" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Saving…</> : "Save Project"}
          </button>
          <Link href="/admin/projects" style={{ display: "flex", alignItems: "center", padding: "11px 20px", borderRadius: 10, background: "#f5f5f3", border: "1px solid #e8e8e4", color: "#888", fontSize: 13, textDecoration: "none" }}>Cancel</Link>
        </div>
      </form>

      {mediaPicker && (
        <MediaPicker
          onSelectMany={handleMediaPickerSelect}
          onClose={() => setMediaPicker(null)}
          alreadySelected={mediaPicker === "hero" ? (form.hero_image ? [form.hero_image] : []) : form.gallery.map((g) => g.src)}
        />
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
