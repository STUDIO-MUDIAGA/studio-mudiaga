"use client";

import { useState } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

type MediaItem = { key: string; url: string; size: number };

/** Browse every uploaded image across the whole media library (not scoped to
 *  one prefix) and pick one or more to add to a form's image list. */
export default function MediaPicker({
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
