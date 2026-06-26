"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2, Copy, Check, ImageOff, X } from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

export type MediaPrefix = "shortlets" | "furniture" | "homepage" | "mudres" | "abode";

type R2Object = { key: string; url: string; size: number; lastModified: string };

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({
  prefix,
  title,
}: {
  prefix?: MediaPrefix;
  title: string;
}) {
  const supabase = createClient();
  const [items, setItems] = useState<R2Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState<R2Object | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    const url = prefix ? `/api/admin/media?prefix=${prefix}` : "/api/admin/media";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [prefix, supabase]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setUploading(true); setError("");
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";

    for (const file of arr) {
      const form = new FormData();
      form.append("file", file);
      form.append("prefix", prefix ?? "homepage");
      const res = await fetch("/api/upload-image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      if (!res.ok) {
        const { error: e } = await res.json();
        setError(e ?? "Upload failed");
      }
    }
    setUploading(false);
    fetchItems();
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(key);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token ?? "";
    await fetch(`/api/admin/media?key=${encodeURIComponent(key)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setItems((p) => p.filter((i) => i.key !== key));
    if (selected?.key === key) setSelected(null);
    setDeleting(null);
  };

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ color: "#bbb", fontSize: 12, margin: "0 0 4px" }}>Media Library</p>
          <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h1>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: uploading ? 0.6 : 1 }}
        >
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload Images"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
      </div>

      {error && (
        <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {error}
          <button onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}><X size={13} /></button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); uploadFiles(e.dataTransfer.files); }}
        style={{ border: `2px dashed ${drag ? NAVY : "#e0e0e0"}`, borderRadius: 14, padding: "22px 20px", textAlign: "center", marginBottom: 20, background: drag ? NAVY_BG : "#fafaf9", transition: "all 0.2s", cursor: "pointer" }}
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={20} color={drag ? NAVY : "#ccc"} style={{ margin: "0 auto 8px" }} />
        <p style={{ color: drag ? NAVY : "#aaa", fontSize: 13, margin: 0 }}>
          {drag ? "Drop to upload" : "Drag & drop images here, or click to browse"}
        </p>
        <p style={{ color: "#ccc", fontSize: 11, margin: "4px 0 0" }}>JPG, PNG, WebP, AVIF — max 10 MB each</p>
      </div>

      {/* Stats row */}
      {!loading && (
        <p style={{ color: "#bbb", fontSize: 12, marginBottom: 16 }}>
          {items.length} image{items.length !== 1 ? "s" : ""} · {formatBytes(items.reduce((s, i) => s + i.size, 0))} total
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading media…</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <ImageOff size={32} color="#e0e0e0" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#ccc", fontSize: 13 }}>No images yet. Upload your first one above.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => setSelected(item)}
              style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${selected?.key === item.key ? NAVY : "#ebebeb"}`, cursor: "pointer", background: "#fff", transition: "border-color 0.15s" }}
            >
              {/* Thumbnail */}
              <div style={{ position: "relative", height: 140, background: "#f5f5f3", overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.key} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* Delete overlay */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(item.key); }}
                  disabled={deleting === item.key}
                  style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: 6, background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting === item.key ? 0.5 : 1 }}
                >
                  <Trash2 size={12} color="#fff" />
                </button>
              </div>
              {/* Footer */}
              <div style={{ padding: "8px 10px" }}>
                <p style={{ color: "#555", fontSize: 11, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.key.split("/").pop()}
                </p>
                <p style={{ color: "#bbb", fontSize: 10, margin: 0 }}>{formatBytes(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }} onClick={() => setSelected(null)} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 50, background: "#fff", borderRadius: 20, padding: 28, width: 480, maxWidth: "90vw", boxShadow: "0 16px 48px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ color: "#0a0a0a", fontWeight: 600, fontSize: 14, margin: 0 }}>Image Details</p>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}><X size={16} /></button>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", background: "#f5f5f3", marginBottom: 16, height: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.url} alt={selected.key} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 3px" }}>File key</p>
              <p style={{ color: "#555", fontSize: 12, margin: 0, wordBreak: "break-all" }}>{selected.key}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 3px" }}>Size</p>
              <p style={{ color: "#555", fontSize: 12, margin: 0 }}>{formatBytes(selected.size)}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => copyUrl(selected.url, selected.key)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, background: NAVY_BG, border: `1px solid #d8d6f0`, color: NAVY, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                {copied === selected.key ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy URL</>}
              </button>
              <button
                onClick={() => handleDelete(selected.key)}
                disabled={deleting === selected.key}
                style={{ padding: "10px 16px", borderRadius: 10, background: "#fff5f5", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: deleting === selected.key ? 0.5 : 1 }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
