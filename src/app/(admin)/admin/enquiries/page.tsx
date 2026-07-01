"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare, Check, X, Clock, Loader2, User, Mail, Phone,
  MapPin, Search, AlertCircle, MoreHorizontal, Archive,
} from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

type Enquiry = {
  id: string;
  full_name: string; email: string; phone: string; location: string; source: string;
  project_type: string; project_type_other: string; property_location: string; space_size: string;
  areas: string[]; areas_other: string; occupancy: string; target_date: string;
  feeling: string; inspiration: string; inspiration_images: string[]; dislikes: string;
  daily_life: string; household: string;
  budget: string; budget_scope: string; prior_experience: string;
  success_vision: string; involvement: string; important_context: string; anything_else: string;
  status: "new" | "contacted" | "archived";
  created_at: string;
};

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  new:       { bg: "#fef3c7", color: "#b45309", label: "New" },
  contacted: { bg: "#dcfce7", color: "#15803d", label: "Contacted" },
  archived:  { bg: "#f0f0f0", color: "#888",    label: "Archived" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.new;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6 }}>{s.label}</span>;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>{label}</p>
      <p style={{ color: "#333", fontSize: 13, lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{value}</p>
    </div>
  );
}

export default function EnquiriesPage() {
  const supabase = createClient();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [detail, setDetail] = useState<Enquiry | null>(null);

  const getToken = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? "";
  }, [supabase]);

  const load = useCallback(async () => {
    const token = await getToken();
    const url = statusFilter !== "all" ? `/api/admin/enquiries?status=${statusFilter}` : "/api/admin/enquiries";
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { setError("Failed to load enquiries"); setLoading(false); return; }
    setEnquiries(await res.json());
    setLoading(false);
  }, [getToken, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const token = await getToken();
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setUpdating(null);
    setActionId(null);
    setDetail(null);
    load();
  }

  const filtered = enquiries.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return e.full_name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.project_type?.toLowerCase().includes(q);
  });

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    contacted: enquiries.filter((e) => e.status === "contacted").length,
    archived: enquiries.filter((e) => e.status === "archived").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#0a0a0a", fontSize: 20, fontWeight: 700, margin: 0 }}>Project Enquiries</h1>
        <p style={{ color: "#aaa", fontSize: 12, margin: "2px 0 0" }}>{counts.all} total · {counts.new} new</p>
      </div>

      {/* Stat pills */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {(["all", "new", "contacted", "archived"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid", cursor: "pointer", transition: "all 0.15s",
              background: statusFilter === s ? (s === "new" ? "#fef3c7" : s === "contacted" ? "#dcfce7" : s === "archived" ? "#f0f0f0" : NAVY_BG) : "#fff",
              borderColor: statusFilter === s ? (s === "new" ? "#b45309" : s === "contacted" ? "#15803d" : s === "archived" ? "#ccc" : NAVY) : "#e8e8e4",
              color: statusFilter === s ? (s === "new" ? "#b45309" : s === "contacted" ? "#15803d" : s === "archived" ? "#888" : NAVY) : "#888",
            }}
          >
            {s === "new" && <Clock size={12} />}
            {s === "contacted" && <Check size={12} />}
            {s === "archived" && <Archive size={12} />}
            {s === "all" && <MessageSquare size={12} />}
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span style={{ background: "rgba(0,0,0,0.08)", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{counts[s]}</span>
          </button>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 10, padding: "8px 14px" }}>
          <Search size={12} color="#ccc" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, location…"
            style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#555", width: 200 }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240 }}>
          <Loader2 size={20} color="#ddd" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : error ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 16 }}>
          <AlertCircle size={15} /> {error}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "60px 0", textAlign: "center" }}>
          <MessageSquare size={32} color="#e0e0e0" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "#bbb", fontSize: 14 }}>No enquiries {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "12px 20px", background: "#f8f8f8", borderBottom: "1px solid #f0f0f0" }}>
            {["Contact", "Project type", "Budget", "Received", "Status", ""].map((h) => (
              <span key={h} style={{ color: "#aaa", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>

          {filtered.map((e, i) => (
            <div
              key={e.id}
              style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 80px", gap: 0, padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f3" : "none", alignItems: "center", cursor: "pointer" }}
              onMouseOver={(ev) => { (ev.currentTarget as HTMLElement).style.background = "#fafaf9"; }}
              onMouseOut={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
              onClick={() => setDetail(e)}
            >
              <div>
                <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{e.full_name}</p>
                <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{e.email}</p>
              </div>
              <div>
                <p style={{ color: "#555", fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.project_type || "—"}</p>
              </div>
              <div>
                <p style={{ color: "#555", fontSize: 12, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.budget || "—"}</p>
              </div>
              <div>
                <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{fmt(e.created_at)}</p>
              </div>
              <div><StatusBadge status={e.status} /></div>
              <div style={{ display: "flex", justifyContent: "flex-end" }} onClick={(ev) => ev.stopPropagation()}>
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setActionId(actionId === e.id ? null : e.id)}
                    style={{ width: 30, height: 30, borderRadius: 8, background: "#f2f2f4", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MoreHorizontal size={14} color="#888" />
                  </button>
                  {actionId === e.id && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setActionId(null)} />
                      <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 20, background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, padding: 6, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                        {e.status !== "contacted" && (
                          <button onClick={() => updateStatus(e.id, "contacted")} disabled={updating === e.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#15803d", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                            {updating === e.id ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={12} />}
                            Mark contacted
                          </button>
                        )}
                        {e.status !== "archived" && (
                          <button onClick={() => updateStatus(e.id, "archived")} disabled={updating === e.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#888", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                            <Archive size={12} /> Archive
                          </button>
                        )}
                        {e.status !== "new" && (
                          <button onClick={() => updateStatus(e.id, "new")} disabled={updating === e.id}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 8, background: "none", border: "none", color: "#b45309", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left" }}>
                            <Clock size={12} /> Mark new
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Detail drawer ── */}
      {detail && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} onClick={() => setDetail(null)} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 460, background: "#fff", zIndex: 101, boxShadow: "-8px 0 40px rgba(0,0,0,0.08)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div>
                <p style={{ color: "#aaa", fontSize: 11, margin: "0 0 4px" }}>Enquiry · {fmt(detail.created_at)}</p>
                <StatusBadge status={detail.status} />
              </div>
              <button onClick={() => setDetail(null)} style={{ background: "#f2f2f4", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={14} color="#666" />
              </button>
            </div>

            <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Contact */}
              <div>
                <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 10px" }}>Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={13} color="#bbb" />
                    <span style={{ color: "#555", fontSize: 13 }}>{detail.full_name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Mail size={13} color="#bbb" />
                    <a href={`mailto:${detail.email}`} style={{ color: NAVY, fontSize: 13, textDecoration: "none" }}>{detail.email}</a>
                  </div>
                  {detail.phone && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Phone size={13} color="#bbb" />
                      <a href={`tel:${detail.phone}`} style={{ color: NAVY, fontSize: 13, textDecoration: "none" }}>{detail.phone}</a>
                    </div>
                  )}
                  {detail.location && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <MapPin size={13} color="#bbb" />
                      <span style={{ color: "#555", fontSize: 13 }}>{detail.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <DetailRow label="Found us via" value={detail.source} />

              <div style={{ borderTop: "1px solid #f0f0f0" }} />

              <p style={{ color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Project</p>
              <DetailRow label="Project type" value={detail.project_type === "Other" ? `Other — ${detail.project_type_other}` : detail.project_type} />
              <DetailRow label="Property location" value={detail.property_location} />
              <DetailRow label="Space size" value={detail.space_size} />
              <DetailRow label="Areas" value={[...(detail.areas ?? []), detail.areas_other].filter(Boolean).join(", ")} />
              <DetailRow label="Occupancy" value={detail.occupancy} />
              <DetailRow label="Target date" value={detail.target_date} />

              <div style={{ borderTop: "1px solid #f0f0f0" }} />

              <p style={{ color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Vision</p>
              <DetailRow label="Desired feeling" value={detail.feeling} />
              <DetailRow label="Inspiration" value={detail.inspiration} />
              {detail.inspiration_images?.length > 0 && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {detail.inspiration_images.map((url, idx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                      <img src={url} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }} />
                    </a>
                  ))}
                </div>
              )}
              <DetailRow label="Dislikes" value={detail.dislikes} />
              <DetailRow label="Daily life" value={detail.daily_life} />
              <DetailRow label="Household" value={detail.household} />

              <div style={{ borderTop: "1px solid #f0f0f0" }} />

              <p style={{ color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Budget</p>
              <DetailRow label="Budget" value={detail.budget} />
              <DetailRow label="Budget scope" value={detail.budget_scope} />
              <DetailRow label="Prior experience" value={detail.prior_experience} />

              <div style={{ borderTop: "1px solid #f0f0f0" }} />

              <p style={{ color: NAVY, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Expectations</p>
              <DetailRow label="Success vision" value={detail.success_vision} />
              <DetailRow label="Involvement" value={detail.involvement} />
              <DetailRow label="Important context" value={detail.important_context} />
              <DetailRow label="Anything else" value={detail.anything_else} />
            </div>

            {/* Actions footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 8, flexShrink: 0 }}>
              {detail.status !== "contacted" && (
                <button
                  onClick={() => updateStatus(detail.id, "contacted")}
                  disabled={updating === detail.id}
                  style={{ flex: 1, background: "#15803d", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                >
                  {updating === detail.id ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                  Mark contacted
                </button>
              )}
              {detail.status !== "archived" && (
                <button
                  onClick={() => updateStatus(detail.id, "archived")}
                  disabled={updating === detail.id}
                  style={{ flex: 1, background: "#fff", color: "#888", border: "1px solid #e8e8e4", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                >
                  <Archive size={14} /> Archive
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
