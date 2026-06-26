"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Building2, Sofa, CalendarDays, Users,
  RefreshCw, TrendingUp, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

const areaData = [
  { day: "1",  value: 10 }, { day: "5",  value: 18 }, { day: "10", value: 32 },
  { day: "15", value: 55 }, { day: "20", value: 62 }, { day: "25", value: 78 },
  { day: "30", value: 90 },
];

const donutData = [
  { name: "Shortlets", value: 40, color: NAVY },
  { name: "Furniture", value: 30, color: "#c46442" },
  { name: "Bookings",  value: 20, color: "#6b7fd6" },
  { name: "Orders",    value: 10, color: "#c4c4a9" },
];

const upcomingTasks = [
  { task: "Confirm Lekki Phase 1 Shortlet", date: "2025-10-28", type: "Shortlet",  status: "Pending",     priority: "High",   dot: "#c46442" },
  { task: "Dispatch Lagos Lounge Sofa",      date: "2025-10-30", type: "Order",     status: "In Progress", priority: "High",   dot: NAVY },
  { task: "Review New User Application",     date: "2025-11-01", type: "User",      status: "Not Started", priority: "Medium", dot: "#c4c4a9" },
];

const STATUS: Record<string, { bg: string; color: string }> = {
  "Pending":     { bg: "#fff8e1", color: "#b45309" },
  "In Progress": { bg: "#e8fdf0", color: "#15803d" },
  "Not Started": { bg: "#f0f0f0", color: "#777" },
};

type Stats = { shortlets: number; furniture: number; bookings: number; users: number };

function MiniSparkline() {
  const pts = [4, 8, 5, 12, 9, 16, 14, 20];
  const max = Math.max(...pts);
  const W = 80, H = 28;
  const points = pts.map((v, i) => `${(i / (pts.length - 1)) * W},${H - (v / max) * H}`).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={points} fill="none" stroke={NAVY} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, color, trend }: { label: string; value: number | string; icon: React.ElementType; color: string; trend: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 6px" }}>{label}</p>
          <p style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1 }}>
            {typeof value === "number" ? String(value).padStart(2, "0") : value}
          </p>
        </div>
        <span style={{ background: "#e8fdf0", color: "#15803d", fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 20 }}>{trend}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={NAVY} />
        </div>
        <MiniSparkline />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 }}>
      <p style={{ color: "#aaa", margin: "0 0 4px" }}>Day {label}</p>
      <p style={{ color: "#0a0a0a", fontWeight: 700, margin: 0 }}>{payload[0].value}%</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ shortlets: 0, furniture: 0, bookings: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  const displayName = user?.email?.split("@")[0] ?? "Admin";

  const fetchStats = async () => {
    setLoading(true);
    const [sl, fu, st] = await Promise.all([
      fetch("/api/admin/shortlets").then((r) => r.json()),
      fetch("/api/admin/furniture").then((r) => r.json()),
      fetch("/api/admin/stats").then((r) => r.json()),
    ]);
    setStats({ shortlets: Array.isArray(sl) ? sl.length : 0, furniture: Array.isArray(fu) ? fu.length : 0, bookings: st.bookings ?? 0, users: st.users ?? 0 });
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    { label: "Active Shortlets", value: loading ? "—" : stats.shortlets, icon: Building2,    color: NAVY_BG,   trend: "+12%" },
    { label: "Furniture Items",  value: loading ? "—" : stats.furniture,  icon: Sofa,         color: "#fdf0eb", trend: "+5%"  },
    { label: "Total Bookings",   value: loading ? "—" : stats.bookings,   icon: CalendarDays, color: "#e9f0fd", trend: "+8%"  },
    { label: "Registered Users", value: loading ? "—" : stats.users,      icon: Users,        color: "#e9fdf0", trend: "+6%"  },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>Welcome Back, {displayName}!</h1>
          <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>Here&apos;s what&apos;s happening across your platform today.</p>
        </div>
        <button onClick={fetchStats} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10, background: "#fff", border: "1px solid #ebebeb", color: "#666", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
          <RefreshCw size={13} /> Refresh Data
        </button>
      </div>

      {/* Highlights */}
      <p style={{ color: "#0a0a0a", fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>Highlights</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {statCards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
        {/* Area chart */}
        <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: "0 0 3px" }}>Progress Overview</p>
              <p style={{ color: "#aaa", fontSize: 12, margin: 0 }}>Platform activity and completion trends.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select style={{ background: "#f7f7f5", border: "1px solid #ebebeb", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#555", outline: "none" }}>
                <option>All Products</option><option>ABODE</option><option>MUDRES</option>
              </select>
              <select style={{ background: "#f7f7f5", border: "1px solid #ebebeb", borderRadius: 8, padding: "6px 10px", fontSize: 12, color: "#555", outline: "none" }}>
                <option>This Month</option><option>Last Month</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={NAVY} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#ccc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#ccc" }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" stroke={NAVY} strokeWidth={2} fill="url(#navyGrad)" dot={{ fill: NAVY, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: 0 }}>Activity Split</p>
            <TrendingUp size={14} color="#ccc" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <PieChart width={160} height={160}>
                <Pie data={donutData} cx={75} cy={75} innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={0}>
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#aaa", fontSize: 10, margin: "0 0 2px" }}>Total Items</p>
                <p style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>{loading ? "—" : stats.shortlets + stats.furniture}</p>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {donutData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color }} />
                  <span style={{ color: "#888", fontSize: 12 }}>{d.name}</span>
                </div>
                <span style={{ color: "#555", fontSize: 12, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        {/* Tasks table */}
        <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: 0 }}>Upcoming Tasks</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "#f7f7f5", border: "1px solid #ebebeb", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#555", cursor: "pointer" }}>Sort</button>
              <button style={{ background: "#f7f7f5", border: "1px solid #ebebeb", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#555", cursor: "pointer" }}>Filter</button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Task", "Due Date", "Type", "Status", "Priority"].map((h) => (
                <th key={h} style={{ color: "#ccc", fontSize: 11, fontWeight: 600, textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {upcomingTasks.map((row, i) => {
                const s = STATUS[row.status] ?? { bg: "#f0f0f0", color: "#777" };
                return (
                  <tr key={i} style={{ borderBottom: i < upcomingTasks.length - 1 ? "1px solid #f8f8f8" : "none" }}>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#0a0a0a", fontWeight: 500 }}>{row.task}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px", fontSize: 12, color: "#888" }}>{row.date}</td>
                    <td style={{ padding: "12px 10px", fontSize: 12, color: "#888" }}>{row.type}</td>
                    <td style={{ padding: "12px 10px" }}><span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>{row.status}</span></td>
                    <td style={{ padding: "12px 10px", fontSize: 12, color: "#888" }}>{row.priority}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick actions */}
        <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px" }}>
          <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>Quick Actions</p>
          <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 20px" }}>Jump to common tasks.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Add New Shortlet",   href: "/admin/shortlets/new", bg: NAVY_BG,   color: NAVY },
              { label: "Add Furniture Item",  href: "/admin/furniture/new", bg: "#fdf0eb", color: "#c46442" },
              { label: "View All Bookings",   href: "/admin/bookings",      bg: "#e9f0fd", color: "#1e56d6" },
              { label: "Manage Users",        href: "/admin/users",         bg: "#e9fdf0", color: "#15803d" },
            ].map(({ label, href, bg, color }) => (
              <Link key={href} href={href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: bg, textDecoration: "none" }}>
                <span style={{ color, fontSize: 13, fontWeight: 600 }}>{label}</span>
                <ArrowRight size={14} color={color} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
