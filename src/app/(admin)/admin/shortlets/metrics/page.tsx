"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft, TrendingUp, Star, Building2, MapPin,
  BedDouble, Users, BarChart2, Loader2, AlertCircle,
} from "lucide-react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const ORANGE = "#c46442";

const CITY_COLORS: Record<string, string> = {
  Lagos: "#c46442",
  Abuja: "#1e156d",
  "Port Harcourt": "#0e7a3d",
};
const TYPE_COLORS = ["#c46442", "#1e156d", "#0e7a3d", "#b45309", "#6b21a8", "#0e6595", "#7c3aed"];
const TIER_COLORS = ["#94a3b8", ORANGE, "#1e156d", "#0a0a0a"];

type Overview = { total: number; available: number; hidden: number; avgRating: number; avgPrice: number; totalReviews: number };
type Metrics = {
  overview: Overview;
  byCity: { city: string; count: number }[];
  byType: { type: string; count: number }[];
  byPriceTier: { label: string; range: string; count: number }[];
  byBedrooms: { beds: number; count: number }[];
  topRated: { id: string; title: string; city: string; rating: number; review_count: number; price: number; image: string | null }[];
  mostReviewed: { id: string; title: string; city: string; rating: number; review_count: number; price: number }[];
  topAmenities: { amenity: string; count: number; pct: number }[];
  reviewsByMonth: { month: string; count: number }[];
};

function StatCard({ icon: Icon, label, value, sub, accent, large }: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string; value: string | number; sub?: string; accent?: string; large?: boolean;
}) {
  const color = accent ?? NAVY;
  return (
    <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 18, padding: "22px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#aaa", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <div>
        <p style={{ color: "#0a0a0a", fontSize: large ? 36 : 30, fontWeight: 800, margin: "0 0 5px", lineHeight: 1, letterSpacing: "-1px" }}>{value}</p>
        {sub && <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>{sub}</p>}
      </div>
    </div>
  );
}

function BarRow({ label, count, max, color, pct }: { label: string; count: number; max: number; color: string; pct?: number }) {
  const width = max ? Math.round((count / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <span style={{ color: "#555", fontSize: 13, width: 130, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 7, background: "#f0f0ee", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.7s ease" }} />
      </div>
      <span style={{ color: "#888", fontSize: 12, fontWeight: 600, width: 32, textAlign: "right", flexShrink: 0 }}>
        {pct !== undefined ? `${pct}%` : count}
      </span>
    </div>
  );
}

function Card({ title, children, span2 }: { title: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 18, padding: "22px 26px", gridColumn: span2 ? "span 2" : undefined }}>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", margin: "0 0 20px" }}>{title}</p>
      {children}
    </div>
  );
}

export default function ShortletMetricsPage() {
  const supabase = createClient();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token ?? "";
      const res = await fetch("/api/admin/shortlets/metrics", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { setError("Failed to load metrics"); setLoading(false); return; }
      setMetrics(await res.json());
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <Loader2 size={22} color="#ddd" style={{ animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error || !metrics) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#dc2626", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: "14px 18px" }}>
      <AlertCircle size={16} /> {error || "No data available"}
    </div>
  );

  const { overview, byCity, byType, byPriceTier, byBedrooms, topRated, topAmenities, reviewsByMonth } = metrics;
  const maxCity = Math.max(...byCity.map((c) => c.count), 1);
  const maxType = Math.max(...byType.map((t) => t.count), 1);
  const maxReviewMonth = Math.max(...reviewsByMonth.map((r) => r.count), 1);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", gap: 5, color: "#aaa", fontSize: 12, textDecoration: "none" }}>
          <ArrowLeft size={12} /> Shortlets
        </Link>
        <div style={{ width: 1, height: 16, background: "#e0e0e0" }} />
        <div>
          <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.3px" }}>Apartment Metrics</h1>
          <p style={{ color: "#bbb", fontSize: 12, margin: "3px 0 0" }}>Performance overview across all ABODE listings</p>
        </div>
      </div>

      {/* ── Row 1: 6 stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 18 }}>
        <StatCard icon={Building2} label="Total Listings" value={overview.total} sub={`${overview.available} live · ${overview.hidden} hidden`} large />
        <StatCard icon={Star} label="Avg. Rating" value={overview.avgRating} sub={`${overview.totalReviews} reviews`} accent={ORANGE} large />
        <StatCard icon={TrendingUp} label="Avg. Price / Night" value={`₦${overview.avgPrice.toLocaleString()}`} sub="Active listings" large />
        <StatCard icon={Users} label="Total Reviews" value={overview.totalReviews} sub="Verified guests" accent={ORANGE} large />
        <StatCard icon={BarChart2} label="Active Listings" value={overview.available} sub={`${Math.round((overview.available / overview.total) * 100)}% of portfolio`} large />
        <StatCard icon={MapPin} label="Cities" value={byCity.length} sub={byCity.map((c) => c.city).join(" · ")} large />
      </div>

      {/* ── Row 2: City + Type + Reviews by month ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 14, marginBottom: 14 }}>

        {/* By City */}
        <Card title="Properties by City">
          {byCity.map((c) => (
            <BarRow key={c.city} label={c.city} count={c.count} max={maxCity} color={CITY_COLORS[c.city] ?? NAVY} />
          ))}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, paddingTop: 14, borderTop: "1px solid #f5f5f3" }}>
            {byCity.map((c) => (
              <div key={c.city} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: CITY_COLORS[c.city] ?? NAVY }} />
                <span style={{ color: "#777", fontSize: 12 }}>{c.city} <span style={{ color: "#bbb" }}>({c.count})</span></span>
              </div>
            ))}
          </div>
        </Card>

        {/* By Type */}
        <Card title="Property Types">
          {byType.map((t, i) => (
            <BarRow key={t.type} label={t.type} count={t.count} max={maxType} color={TYPE_COLORS[i % TYPE_COLORS.length]} />
          ))}
        </Card>

        {/* Review activity */}
        <Card title="Review Activity by Month">
          {reviewsByMonth.length > 0 ? (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
              {reviewsByMonth.map((r) => {
                const h = Math.max(Math.round((r.count / maxReviewMonth) * 100), 4);
                return (
                  <div key={r.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>{r.count || ""}</span>
                    <div style={{ width: "100%", height: `${h}%`, background: NAVY, borderRadius: "4px 4px 0 0", transition: "height 0.5s ease", minHeight: 4 }} />
                    <span style={{ color: "#bbb", fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center" }}>
                      {r.month.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#ccc", fontSize: 13, textAlign: "center", padding: "30px 0", margin: 0 }}>No review data yet</p>
          )}
        </Card>
      </div>

      {/* ── Row 3: Price Tiers + Bedroom Distribution + Amenities ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.4fr", gap: 14, marginBottom: 14 }}>

        {/* Price Tiers */}
        <Card title="Price Tiers">
          {(() => {
            const total = byPriceTier.reduce((s, t) => s + t.count, 0) || 1;
            const TIER_CFG = [
              { color: "#94a3b8", bg: "#f1f5f9", label_color: "#64748b" },
              { color: ORANGE,    bg: "#fdf0eb", label_color: ORANGE },
              { color: NAVY,      bg: NAVY_BG,   label_color: NAVY },
              { color: "#0a0a0a", bg: "#f0f0f0", label_color: "#0a0a0a" },
            ];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {byPriceTier.map((t, i) => {
                  const cfg = TIER_CFG[i] ?? TIER_CFG[0];
                  const pct = Math.round((t.count / total) * 100);
                  return (
                    <div key={t.label} style={{ background: cfg.bg, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                      {/* Big count */}
                      <span style={{ color: cfg.color, fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: "-1px", flexShrink: 0, minWidth: 36 }}>{t.count}</span>
                      {/* Label + range */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: cfg.label_color, fontSize: 12, fontWeight: 700, margin: "0 0 1px" }}>{t.label}</p>
                        <p style={{ color: "#aaa", fontSize: 10, margin: "0 0 6px" }}>{t.range}</p>
                        {/* Share bar */}
                        <div style={{ height: 3, background: `${cfg.color}22`, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                      {/* Percentage */}
                      <span style={{ color: cfg.color, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </Card>

        {/* Bedroom Distribution */}
        <Card title="Bedroom Distribution">
          {byBedrooms.map((b) => (
            <BarRow
              key={b.beds}
              label={b.beds === 1 ? "1 bedroom" : `${b.beds} bedrooms`}
              count={b.count}
              max={Math.max(...byBedrooms.map((x) => x.count), 1)}
              color={NAVY}
            />
          ))}
        </Card>

        {/* Amenity Popularity */}
        <Card title="Amenity Popularity">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 28px" }}>
            {topAmenities.map((a) => (
              <BarRow key={a.amenity} label={a.amenity} count={a.count} max={Math.max(...topAmenities.map((x) => x.count), 1)} color={ORANGE} pct={a.pct} />
            ))}
          </div>
        </Card>
      </div>

      {/* ── Row 4: Top Rated + Bedroom stats summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Top Rated */}
        <Card title="Top Rated Properties">
          <div>
            {topRated.map((p, i) => (
              <Link
                key={p.id}
                href={`/admin/shortlets/${p.id}/edit`}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < topRated.length - 1 ? "1px solid #f5f5f3" : "none", textDecoration: "none" }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <span style={{ color: i < 3 ? ORANGE : "#ccc", fontSize: 14, fontWeight: 800, width: 26, textAlign: "center", flexShrink: 0 }}>#{i + 1}</span>
                <div style={{ width: 52, height: 40, borderRadius: 10, overflow: "hidden", background: "#f0f0ee", flexShrink: 0 }}>
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                  <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{p.city}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <Star size={11} fill={ORANGE} color={ORANGE} />
                  <span style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 700 }}>{p.rating}</span>
                  <span style={{ color: "#ccc", fontSize: 11 }}>({p.review_count})</span>
                </div>
                <span style={{ color: "#888", fontSize: 12, flexShrink: 0, width: 100, textAlign: "right" }}>₦{p.price.toLocaleString()}/night</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Portfolio health summary */}
        <Card title="Portfolio Health">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Occupancy rate", value: `${Math.round((overview.available / overview.total) * 100)}%`, sub: "Listings currently live", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "Avg. nightly rate", value: `₦${overview.avgPrice.toLocaleString()}`, sub: "Across active listings", color: NAVY, bg: NAVY_BG, border: "#d0cef0" },
              { label: "Guest rating", value: `${overview.avgRating} / 5`, sub: `From ${overview.totalReviews} reviews`, color: ORANGE, bg: "#fdf0eb", border: `${ORANGE}33` },
              { label: "Hidden listings", value: overview.hidden, sub: "Unavailable to guests", color: "#aaa", bg: "#f7f7f5", border: "#e8e8e4" },
            ].map(({ label, value, sub, color, bg, border }) => (
              <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 2px" }}>{label}</p>
                  <p style={{ color: "#bbb", fontSize: 11, margin: 0 }}>{sub}</p>
                </div>
                <span style={{ color, fontSize: 18, fontWeight: 800 }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
