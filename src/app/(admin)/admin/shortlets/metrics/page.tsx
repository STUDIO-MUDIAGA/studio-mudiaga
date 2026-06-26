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

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "20px 22px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ color: "#aaa", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: accent ? `${accent}18` : NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={accent ?? NAVY} />
        </div>
      </div>
      <p style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 800, margin: "0 0 4px", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ color: "#aaa", fontSize: 11, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function BarRow({ label, count, max, color, pct }: { label: string; count: number; max: number; color: string; pct?: number }) {
  const width = max ? Math.round((count / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <span style={{ color: "#555", fontSize: 12, width: 120, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: "#f0f0ee", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${width}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ color: "#888", fontSize: 11, width: 28, textAlign: "right", flexShrink: 0 }}>
        {pct !== undefined ? `${pct}%` : count}
      </span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "20px 22px" }}>
      <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 18px" }}>{title}</p>
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320 }}>
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
  const maxAmenity = Math.max(...topAmenities.map((a) => a.count), 1);
  const maxReviewMonth = Math.max(...reviewsByMonth.map((r) => r.count), 1);

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <Link href="/admin/shortlets" style={{ display: "flex", alignItems: "center", gap: 5, color: "#aaa", fontSize: 12, textDecoration: "none" }}>
          <ArrowLeft size={12} /> Shortlets
        </Link>
        <div style={{ width: 1, height: 16, background: "#e8e8e4" }} />
        <div>
          <h1 style={{ color: "#0a0a0a", fontSize: 20, fontWeight: 700, margin: 0 }}>Apartment Metrics</h1>
          <p style={{ color: "#aaa", fontSize: 12, margin: "2px 0 0" }}>Performance overview across all ABODE listings</p>
        </div>
      </div>

      {/* Overview stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon={Building2} label="Total Listings" value={overview.total} sub={`${overview.available} available · ${overview.hidden} hidden`} />
        <StatCard icon={Star} label="Avg. Rating" value={overview.avgRating} sub={`Across ${overview.totalReviews} reviews`} accent={ORANGE} />
        <StatCard icon={TrendingUp} label="Avg. Price / Night" value={`₦${overview.avgPrice.toLocaleString()}`} sub="Across all active listings" />
        <StatCard icon={Users} label="Total Reviews" value={overview.totalReviews} sub="From verified guests" accent={ORANGE} />
        <StatCard icon={BarChart2} label="Active Listings" value={overview.available} sub={`${Math.round((overview.available / overview.total) * 100)}% of total portfolio`} />
        <StatCard icon={MapPin} label="Cities" value={byCity.length} sub={byCity.map((c) => c.city).join(" · ")} />
      </div>

      {/* Row 2: City + Property Type */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <SectionCard title="Properties by City">
          {byCity.map((c) => (
            <BarRow key={c.city} label={c.city} count={c.count} max={maxCity} color={CITY_COLORS[c.city] ?? NAVY} />
          ))}
          {/* Donut visual */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            {byCity.map((c) => (
              <div key={c.city} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: CITY_COLORS[c.city] ?? NAVY }} />
                <span style={{ color: "#777", fontSize: 11 }}>{c.city} ({c.count})</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Property Types">
          {byType.map((t, i) => (
            <BarRow key={t.type} label={t.type} count={t.count} max={maxType} color={TYPE_COLORS[i % TYPE_COLORS.length]} />
          ))}
        </SectionCard>
      </div>

      {/* Row 3: Price tiers + Bedrooms */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <SectionCard title="Price Tiers">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {byPriceTier.map((t, i) => (
              <div key={t.label} style={{ background: "#f8f8f6", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${TIER_COLORS[i]}` }}>
                <p style={{ color: "#0a0a0a", fontSize: 20, fontWeight: 800, margin: "0 0 3px" }}>{t.count}</p>
                <p style={{ color: "#555", fontSize: 12, fontWeight: 600, margin: "0 0 2px" }}>{t.label}</p>
                <p style={{ color: "#bbb", fontSize: 10, margin: 0 }}>{t.range}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Bedroom Distribution">
          {byBedrooms.map((b) => (
            <BarRow
              key={b.beds}
              label={b.beds === 1 ? "1 bedroom" : `${b.beds} bedrooms`}
              count={b.count}
              max={Math.max(...byBedrooms.map((x) => x.count), 1)}
              color={NAVY}
            />
          ))}
        </SectionCard>
      </div>

      {/* Row 4: Amenity Popularity */}
      <div style={{ marginBottom: 14 }}>
        <SectionCard title="Amenity Popularity (% of listings)">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
            {topAmenities.map((a) => (
              <BarRow key={a.amenity} label={a.amenity} count={a.count} max={maxAmenity} color={ORANGE} pct={a.pct} />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Row 5: Reviews by month */}
      {reviewsByMonth.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionCard title="Review Activity by Month">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, padding: "0 4px" }}>
              {reviewsByMonth.map((r) => {
                const heightPct = Math.round((r.count / maxReviewMonth) * 100);
                return (
                  <div key={r.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
                    <span style={{ color: "#888", fontSize: 10, fontWeight: 600 }}>{r.count}</span>
                    <div style={{ width: "100%", height: `${heightPct}%`, minHeight: 4, background: NAVY, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }} />
                    <span style={{ color: "#bbb", fontSize: 9, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {r.month.split(" ")[0].slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Row 6: Top Rated listings */}
      <SectionCard title="Top Rated Properties">
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {topRated.map((p, i) => (
            <Link
              key={p.id}
              href={`/admin/shortlets/${p.id}/edit`}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < topRated.length - 1 ? "1px solid #f5f5f3" : "none", textDecoration: "none" }}
            >
              {/* Rank */}
              <span style={{ color: i < 3 ? ORANGE : "#ccc", fontSize: 15, fontWeight: 800, width: 24, textAlign: "center", flexShrink: 0 }}>#{i + 1}</span>
              {/* Thumbnail */}
              <div style={{ width: 44, height: 34, borderRadius: 8, overflow: "hidden", background: "#f0f0ee", flexShrink: 0 }}>
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              {/* Name */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                <p style={{ color: "#bbb", fontSize: 11, margin: "2px 0 0" }}>{p.city}</p>
              </div>
              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Star size={11} fill={ORANGE} color={ORANGE} />
                <span style={{ color: "#555", fontSize: 12, fontWeight: 700 }}>{p.rating}</span>
                <span style={{ color: "#ccc", fontSize: 11 }}>({p.review_count})</span>
              </div>
              {/* Price */}
              <span style={{ color: "#888", fontSize: 12, flexShrink: 0, width: 90, textAlign: "right" }}>₦{p.price.toLocaleString()}/night</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
