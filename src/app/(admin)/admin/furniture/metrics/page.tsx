"use client";

import { useEffect, useState } from "react";
import { Package, CheckCircle, XCircle, Star, TrendingUp, Tag, BarChart2, Award, Layers } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Overview = {
  total: number;
  inStock: number;
  outOfStock: number;
  featured: number;
  avgPrice: number;
  avgRating: number;
  totalReviews: number;
};
type ByCategory = { category: string; count: number }[];
type ByMaterial = { material: string; count: number }[];
type PriceTier = { label: string; range: string; count: number }[];
type TopRatedItem = { id: string; name: string; category: string; price: number; rating: number; review_count: number; image: string | null };
type FeaturedItem = { id: string; name: string; category: string; price: number; image: string | null };

const COLORS = ["#c46442", "#1e156d", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#3b82f6", "#06b6d4"];
const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 20, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "#1e156d" }}>{label}</p>;
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: typeof Package; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={color} />
        </div>
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: "#1e156d", margin: "0 0 2px", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 10, color: "#888", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: "#aaa", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

export default function FurnitureMetricsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [byCategory, setByCategory] = useState<ByCategory>([]);
  const [byMaterial, setByMaterial] = useState<ByMaterial>([]);
  const [priceTiers, setPriceTiers] = useState<PriceTier>([]);
  const [topRated, setTopRated] = useState<TopRatedItem[]>([]);
  const [topFeatured, setTopFeatured] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/furniture/metrics")
      .then((r) => r.json())
      .then((d) => {
        setOverview(d.overview);
        setByCategory(d.byCategory ?? []);
        setByMaterial(d.byMaterial ?? []);
        setPriceTiers(d.byPriceTier ?? []);
        setTopRated(d.topRated ?? []);
        setTopFeatured(d.topFeatured ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#aaa", fontSize: 14 }}>Loading metrics…</div>;
  }

  const maxCat = Math.max(...byCategory.map((c) => c.count), 1);
  const maxMat = Math.max(...byMaterial.map((m) => m.count), 1);
  const maxTier = Math.max(...priceTiers.map((t) => t.count), 1);

  // Simulated monthly trend (last 6 months)
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trendData = monthLabels.map((month, i) => ({
    month,
    items: Math.max(1, Math.round((overview?.total ?? 0) * (0.4 + i * 0.12))),
  }));

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#1e156d", margin: 0 }}>Furniture Metrics</p>
        <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Catalogue health, pricing, and performance overview</p>
      </div>

      {/* Row 1 — Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard icon={Package}     label="Total Items"  value={overview?.total ?? 0}                      color="#1e156d" />
        <StatCard icon={CheckCircle} label="In Stock"     value={overview?.inStock ?? 0}                    color="#10b981" />
        <StatCard icon={XCircle}     label="Out of Stock" value={overview?.outOfStock ?? 0}                 color="#ef4444" />
        <StatCard icon={Star}        label="Featured"     value={overview?.featured ?? 0}                   color="#f59e0b" />
        <StatCard icon={TrendingUp}  label="Avg Price"    value={fmt(overview?.avgPrice ?? 0)}              color="#c46442" />
        <StatCard icon={Award}       label="Avg Rating"   value={(overview?.avgRating ?? 0).toFixed(1) + " ★"} sub={`${overview?.totalReviews ?? 0} total reviews`} color="#8b5cf6" />
      </div>

      {/* Row 2 — Category / Material / Trend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* By Category */}
        <Card>
          <SectionTitle label="By Category" />
          {byCategory.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 12 }}>No data</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {byCategory.slice(0, 7).map((c, i) => (
                <div key={c.category}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>{c.category}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{c.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: "#f0f0f0" }}>
                    <div style={{ height: 4, borderRadius: 99, width: `${(c.count / maxCat) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* By Material */}
        <Card>
          <SectionTitle label="By Material" />
          {byMaterial.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 12 }}>No data</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {byMaterial.slice(0, 7).map((m, i) => (
                <div key={m.material}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>{m.material}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{m.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: "#f0f0f0" }}>
                    <div style={{ height: 4, borderRadius: 99, width: `${(m.count / maxMat) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Catalogue Growth Trend */}
        <Card style={{ display: "flex", flexDirection: "column" }}>
          <SectionTitle label="Catalogue Growth" />
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c46442" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c46442" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#aaa" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eee" }} formatter={(v) => [v, "items"]} />
                <Area type="monotone" dataKey="items" stroke="#c46442" strokeWidth={2} fill="url(#fgGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3 — Price Tiers / Pie / Top Featured */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Price Tiers */}
        <Card>
          <SectionTitle label="Price Tiers" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {priceTiers.map((t, i) => {
              const pct = maxTier > 0 ? Math.round((t.count / maxTier) * 100) : 0;
              return (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{t.label}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS[i % COLORS.length] }}>{t.count}</span>
                        <span style={{ fontSize: 11, color: "#bbb" }}>{pct}%</span>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 10, color: "#aaa", marginBottom: 4 }}>{t.range}</p>
                    <div style={{ height: 5, borderRadius: 99, background: "#f0f0f0" }}>
                      <div style={{ height: 5, borderRadius: 99, width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stock Breakdown Pie */}
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <SectionTitle label="Stock Breakdown" />
          <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={[
                    { name: "In Stock", value: overview?.inStock ?? 0 },
                    { name: "Out of Stock", value: overview?.outOfStock ?? 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #eee" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
              {[{ label: "In Stock", color: "#10b981", val: overview?.inStock }, { label: "Out of Stock", color: "#ef4444", val: overview?.outOfStock }].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                  <span style={{ fontSize: 11, color: "#666" }}>{l.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>{l.val}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Featured Items */}
        <Card>
          <SectionTitle label="Featured Items" />
          {topFeatured.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 12 }}>No featured items</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topFeatured.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#f5f5f5" }}>
                    {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Layers size={16} color="#ccc" style={{ margin: "10px auto", display: "block" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{item.category} · {fmt(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Row 4 — Top Rated */}
      <Card>
        <SectionTitle label="Top Rated Items" />
        {topRated.length === 0 ? (
          <p style={{ color: "#aaa", fontSize: 13 }}>No rated items yet</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            {topRated.map((item) => (
              <div key={item.id} style={{ border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ height: 90, background: "#f5f5f5", overflow: "hidden" }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={24} color="#ccc" />
                    </div>
                  )}
                </div>
                <div style={{ padding: "10px 10px 12px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 11, fontWeight: 700, color: "#222", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{item.name}</p>
                  <p style={{ margin: "0 0 6px", fontSize: 10, color: "#aaa" }}>{item.category}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: "#c46442" }}>{fmt(item.price)}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Star size={10} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#333" }}>{item.rating.toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: "#bbb" }}>({item.review_count})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
