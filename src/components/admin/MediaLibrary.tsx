"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Trash2, Copy, Check, ImageOff, X, Loader2 } from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

export type MediaPrefix = "shortlets" | "furniture" | "homepage" | "mudres" | "abode";

type R2Object = { key: string; url: string; size: number; lastModified: string };

type UploadItem = { name: string; status: "uploading" | "done" | "error"; error?: string };

const PREFIX_META: Record<string, { label: string; bg: string; color: string }> = {
  homepage:  { label: "Homepage",  bg: NAVY_BG,    color: NAVY       },
  mudres:    { label: "MUDRES",    bg: "#fdf0eb",  color: "#c46442"  },
  abode:     { label: "ABODE",     bg: "#fdf0eb",  color: "#c46442"  },
  shortlets: { label: "Shortlets", bg: "#f0fdf4",  color: "#15803d"  },
  furniture: { label: "Furniture", bg: "#f5f0fe",  color: "#7c3aed"  },
};

function getPrefix(key: string) {
  return key.split("/")[0] ?? "";
}

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
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState<R2Object | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    const url = prefix ? `/api/admin/media?prefix=${prefix}` : "/api/admin/media";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [prefix, getToken]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;

    const initial: UploadItem[] = arr.map((f) => ({ name: f.name, status: "uploading" }));
    setQueue(initial);

    const token = await getToken();

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      const form = new FormData();
      form.append("file", file);
      form.append("prefix", prefix ?? "homepage");

      try {
        const res = await fetch("/api/upload-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error ?? "Upload failed");
        }
        setQueue((q) => q.map((item, idx) => idx === i ? { ...item, status: "done" } : item));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setQueue((q) => q.map((item, idx) => idx === i ? { ...item, status: "error", error: msg } : item));
      }
    }

    await fetchItems();
    setTimeout(() => setQueue([]), 4000);
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    setDeleting(key);
    const token = await getToken();
    await fetch(`/api/admin/media?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems((p) => p.filter((i) => i.key !== key));
    if (selected?.key === key) setSelected(null);
    setDeleting(null);
  };

  const copyUrl = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const isUploading = queue.some((q) => q.status === "uploading");
  const doneCount = queue.filter((q) => q.status === "done").length;

  // For All Media, derive available tabs from actual uploaded prefixes
  const availablePrefixes = !prefix
    ? Array.from(new Set(items.map((i) => getPrefix(i.key)).filter(Boolean)))
    : [];

  const visibleItems = !prefix && activeTab !== "all"
    ? items.filter((i) => getPrefix(i.key) === activeTab)
    : items;

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
          disabled={isUploading}
          style={{ display: "flex", alignItems: "center", gap: 7, background: NAVY, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: isUploading ? "not-allowed" : "pointer", opacity: isUploading ? 0.6 : 1 }}
        >
          <Upload size={14} /> Upload Images
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => e.target.files && uploadFiles(e.target.files)} />
      </div>

      {/* Upload queue panel */}
      {queue.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 14, padding: "14px 18px", marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0 }}>
              {isUploading ? `Uploading ${doneCount + 1} of ${queue.length}…` : `${doneCount} of ${queue.length} uploaded`}
            </p>
            {!isUploading && (
              <button onClick={() => setQueue([])} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb" }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: "#f0f0f0", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", background: NAVY, borderRadius: 4, width: `${(doneCount / queue.length) * 100}%`, transition: "width 0.4s ease" }} />
          </div>

          {/* File list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {queue.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.status === "uploading" && <Loader2 size={14} color={NAVY} style={{ animation: "spin 1s linear infinite" }} />}
                  {item.status === "done"      && <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={10} color="#15803d" /></div>}
                  {item.status === "error"     && <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff5f5", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={10} color="#dc2626" /></div>}
                </div>
                <span style={{ color: item.status === "error" ? "#dc2626" : "#555", fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.name}
                </span>
                {item.status === "error" && item.error && (
                  <span style={{ color: "#dc2626", fontSize: 11, flexShrink: 0 }}>{item.error}</span>
                )}
              </div>
            ))}
          </div>
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

      {/* Category filter tabs — All Media only */}
      {!prefix && !loading && availablePrefixes.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", ...availablePrefixes].map((tab) => {
            const isActive = activeTab === tab;
            const meta = tab === "all"
              ? { label: "All", bg: NAVY_BG, color: NAVY }
              : PREFIX_META[tab] ?? { label: tab, bg: "#f0f0f0", color: "#888" };
            const count = tab === "all"
              ? items.length
              : items.filter((i) => getPrefix(i.key) === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 20, border: "1px solid",
                  fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                  background: isActive ? meta.bg : "#fff",
                  borderColor: isActive ? meta.color : "#e8e8e4",
                  color: isActive ? meta.color : "#888",
                  transition: "all 0.15s",
                }}
              >
                {meta.label}
                <span style={{ background: isActive ? meta.color : "#ebebeb", color: isActive ? "#fff" : "#aaa", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <p style={{ color: "#bbb", fontSize: 12, marginBottom: 16 }}>
          {visibleItems.length} image{visibleItems.length !== 1 ? "s" : ""}{activeTab !== "all" ? ` in ${PREFIX_META[activeTab]?.label ?? activeTab}` : ""} · {formatBytes(visibleItems.reduce((s, i) => s + i.size, 0))} total
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#ccc", fontSize: 13 }}>Loading media…</div>
      ) : visibleItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <ImageOff size={32} color="#e0e0e0" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#ccc", fontSize: 13 }}>
            {items.length === 0 ? "No images yet. Upload your first one above." : "No images in this category."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {visibleItems.map((item) => {
            const pfx = getPrefix(item.key);
            const meta = PREFIX_META[pfx] ?? { label: pfx, bg: "#f0f0f0", color: "#888" };
            return (
              <div
                key={item.key}
                onClick={() => setSelected(item)}
                style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${selected?.key === item.key ? NAVY : "#ebebeb"}`, cursor: "pointer", background: "#fff", transition: "border-color 0.15s" }}
              >
                {/* Thumbnail */}
                <div style={{ position: "relative", height: 140, background: "#f5f5f3", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.key} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                  {/* Category badge — only shown in All Media (no prefix filter) */}
                  {!prefix && (
                    <div style={{ position: "absolute", bottom: 7, left: 7, background: meta.bg, color: meta.color, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 7px", borderRadius: 6 }}>
                      {meta.label}
                    </div>
                  )}

                  {/* Delete */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.key); }}
                    disabled={deleting === item.key}
                    style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: 6, background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: deleting === item.key ? 0.5 : 1 }}
                  >
                    {deleting === item.key
                      ? <Loader2 size={12} color="#fff" style={{ animation: "spin 1s linear infinite" }} />
                      : <Trash2 size={12} color="#fff" />
                    }
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
            );
          })}
        </div>
      )}

      {/* Spin keyframes */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Detail modal */}
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
            {(() => {
              const pfx = getPrefix(selected.key);
              const meta = PREFIX_META[pfx] ?? { label: pfx, bg: "#f0f0f0", color: "#888" };
              return (
                <div style={{ display: "inline-flex", alignItems: "center", background: meta.bg, color: meta.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, marginBottom: 14 }}>
                  {meta.label}
                </div>
              );
            })()}
            <div style={{ marginBottom: 10 }}>
              <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 3px" }}>Public URL</p>
              <p style={{ color: "#555", fontSize: 11, margin: 0, wordBreak: "break-all", background: "#f8f8f8", borderRadius: 8, padding: "8px 10px" }}>{selected.url}</p>
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
