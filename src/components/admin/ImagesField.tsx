"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Images, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import MediaPicker from "@/components/admin/MediaPicker";

const NAVY = "#1e156d";

type UploadingImg = { id: string; name: string; status: "uploading" | "error" };

/** Thumbnail grid + upload (drag/drop or browse) + "pick from media library",
 *  replacing a plain comma-separated URL textarea. */
export default function ImagesField({
  images,
  onChange,
  prefix = "furniture",
}: {
  images: string[];
  onChange: (images: string[]) => void;
  prefix?: string;
}) {
  const supabase = createClient();
  const [uploading, setUploading] = useState<UploadingImg[]>([]);
  const [drag, setDrag] = useState(false);
  const [picking, setPicking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    const ids = arr.map(() => Math.random().toString(36).slice(2));
    setUploading((p) => [...p, ...arr.map((f, i) => ({ id: ids[i], name: f.name, status: "uploading" as const }))]);

    const token = await getToken();
    await Promise.all(arr.map(async (file, i) => {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", prefix);
      try {
        const res = await fetch("/api/upload-image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!res.ok) throw new Error("Upload failed");
        const { url } = await res.json();
        onChange([...images, url]);
        setUploading((p) => p.filter((u) => u.id !== ids[i]));
      } catch {
        setUploading((p) => p.map((u) => u.id === ids[i] ? { ...u, status: "error" } : u));
      }
    }));
  }, [getToken, images, onChange, prefix]);

  const removeAt = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
        style={{
          border: `1.5px dashed ${drag ? NAVY : "#e0e0dc"}`, borderRadius: 12, padding: 16,
          background: drag ? "#f4f3fb" : "#fafafa", transition: "all 0.15s",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
        />

        {images.length === 0 && uploading.length === 0 ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <Images size={22} color="#ccc" style={{ marginBottom: 8 }} />
            <p style={{ color: "#999", fontSize: 12.5, margin: "0 0 12px" }}>Drag images here, upload, or pick from the media library</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={btnStyle(NAVY, "#fff")}>
                <Upload size={12} /> Upload
              </button>
              <button type="button" onClick={() => setPicking(true)} style={btnStyle("#f5f5f3", "#555")}>
                <Images size={12} /> Media Library
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(84px, 1fr))", gap: 8, marginBottom: 12 }}>
              {images.map((url, i) => (
                <div key={url + i} style={{ position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", background: "#eee" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    aria-label="Remove image"
                    style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X size={11} />
                  </button>
                  {i === 0 && (
                    <span style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>Cover</span>
                  )}
                </div>
              ))}
              {uploading.map((u) => (
                <div key={u.id} style={{ aspectRatio: "1", borderRadius: 8, background: "#f0f0ee", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: 4 }}>
                  {u.status === "uploading" ? (
                    <Loader2 size={16} color="#aaa" style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    <AlertCircle size={16} color="#dc2626" />
                  )}
                  <span style={{ fontSize: 8.5, color: "#999", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{u.name}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={btnStyle(NAVY, "#fff")}>
                <Upload size={12} /> Upload
              </button>
              <button type="button" onClick={() => setPicking(true)} style={btnStyle("#f5f5f3", "#555")}>
                <Images size={12} /> Media Library
              </button>
            </div>
          </>
        )}
      </div>

      {picking && (
        <MediaPicker
          alreadySelected={images}
          onClose={() => setPicking(false)}
          onSelectMany={(urls) => onChange([...images, ...urls.filter((u) => !images.includes(u))])}
        />
      )}
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", gap: 6, background: bg, color, border: bg === "#f5f5f3" ? "1px solid #e8e8e4" : "none",
    borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  };
}
