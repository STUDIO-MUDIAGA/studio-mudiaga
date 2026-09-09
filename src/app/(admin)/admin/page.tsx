"use client";

import { useEffect, useState } from "react";
import { Building2, Sofa, CalendarDays, Users, TrendingUp, ArrowRight, TrendingDown, Info, Wallet, ShoppingBag, MessageCircle } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useAdminWorkspace } from "../layout";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const MUDRES = "#2A3812";
const MUDRES_BG = "#EDF0E4";
const ABODE = "#c46442";
const ABODE_BG = "#f7ece7";

const fmt = (n: number) => "₦" + (n ?? 0).toLocaleString("en-NG");

function StatCard({ icon: Icon, label, value, color, bg, href }: { icon: typeof Wallet; label: string; value: string | number; color: string; bg: string; href?: string }) {
  const body = (
    <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "20px 22px" }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon size={14} color={color} />
      </div>
      <p style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 800, margin: "0 0 6px", lineHeight: 1, letterSpacing: "-1px" }}>{value}</p>
      <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{label}</p>
    </div>
  );
  return href ? <Link href={href} style={{ textDecoration: "none", display: "block" }}>{body}</Link> : body;
}

/* ── MUDRES dashboard — real data from the APIs built for the store ── */

type MudresSummary = {
  revenue: number;
  orders: number;
  avgOrder: number;
  customers: number;
  unreadSupport: number;
  recentOrders: { id: string; full_name: string; total: number; status: string; created_at: string }[];
};

function MudresDashboard() {
  const router = useRouter();
  const [data, setData] = useState<MudresSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/furniture/metrics").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/support").then((r) => r.json()),
      fetch("/api/admin/orders/furniture").then((r) => r.json()),
    ]).then(([metrics, users, threads, orders]) => {
      setData({
        revenue: metrics?.sales?.totalRevenue ?? 0,
        orders: metrics?.sales?.totalOrders ?? 0,
        avgOrder: metrics?.sales?.avgOrderValue ?? 0,
        customers: Array.isArray(users) ? users.length : 0,
        unreadSupport: Array.isArray(threads) ? threads.filter((t: { unread: boolean }) => t.unread).length : 0,
        recentOrders: Array.isArray(orders) ? orders.slice(0, 5) : [],
      });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>MUDRES Highlights</p>
        <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Store performance at a glance</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon={Wallet} label="Total Revenue" value={loading ? "…" : fmt(data!.revenue)} color={MUDRES} bg={MUDRES_BG} href="/admin/furniture/metrics" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={loading ? "…" : data!.orders} color={MUDRES} bg={MUDRES_BG} href="/admin/furniture/orders" />
        <StatCard icon={Users} label="Customers" value={loading ? "…" : data!.customers} color={MUDRES} bg={MUDRES_BG} href="/admin/users" />
        <StatCard icon={MessageCircle} label="Awaiting Reply" value={loading ? "…" : data!.unreadSupport} color={MUDRES} bg={MUDRES_BG} href="/admin/furniture/support" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: 0 }}>Recent Orders</p>
          <Link href="/admin/furniture/orders" style={{ fontSize: 12, color: MUDRES, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {!loading && data!.recentOrders.length === 0 ? (
          <p style={{ color: "#bbb", fontSize: 13, padding: "20px 0", textAlign: "center" }}>No orders yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Order", "Customer", "Total", "Status"].map((h) => (
                <th key={h} style={{ color: "#ccc", fontSize: 11, fontWeight: 600, textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {data?.recentOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/admin/furniture/orders/${o.id}`)}
                  style={{ cursor: "pointer" }}
                  onMouseOver={(e) => { e.currentTarget.style.background = "#fafafa"; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "10px", fontSize: 12, fontFamily: "monospace", color: "#888" }}>{o.id}</td>
                  <td style={{ padding: "10px", fontSize: 13, color: "#222" }}>{o.full_name}</td>
                  <td style={{ padding: "10px", fontSize: 13, fontWeight: 600, color: MUDRES }}>{fmt(o.total)}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{ background: MUDRES_BG, color: MUDRES, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize" }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── ABODE dashboard — only what's actually built on that side so far ── */

function AbodeDashboard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/shortlets").then((r) => r.json()).then((d) => setCount(Array.isArray(d) ? d.length : 0));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <p style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>ABODE Highlights</p>
        <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Shortlet listings overview</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard icon={Building2} label="Active Shortlets" value={count === null ? "…" : count} color={ABODE} bg={ABODE_BG} href="/admin/shortlets" />
      </div>

      <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "22px 24px", textAlign: "center" }}>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>
          Bookings, guest accounts, and revenue tracking for ABODE haven&apos;t been built yet — this workspace only reflects the listings side for now.
        </p>
        <Link href="/admin/shortlets" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: ABODE_BG, color: ABODE, fontSize: 13, fontWeight: 600, padding: "10px 18px", borderRadius: 10, textDecoration: "none" }}>
          Manage Shortlets <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

/* ── Main (all-brands) dashboard — unchanged combined overview ── */

const areaData = [
  { day: "1", value: 10 }, { day: "5", value: 18 }, { day: "10", value: 32 },
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

const CARDS = [
  { label: "Active Shortlets", key: "shortlets" as const, icon: Building2,    accent: NAVY,      bg: NAVY_BG,   trend: "+12%", sub: "vs last month", tip: "Live ABODE listings" },
  { label: "Furniture Items",  key: "furniture"  as const, icon: Sofa,         accent: "#c46442", bg: "#fdf0eb", trend: "+5%",  sub: "vs last month", tip: "MUDRES catalogue total" },
  { label: "Total Bookings",   key: "bookings"   as const, icon: CalendarDays, accent: "#1e56d6", bg: "#e9f0fd", trend: "+8%",  sub: "vs last month", tip: "All booking requests" },
  { label: "Registered Users", key: "users"      as const, icon: Users,        accent: "#15803d", bg: "#e9fdf0", trend: "+6%",  sub: "vs last month", tip: "Customer accounts" },
];


function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative", display: "flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Info size={13} color={visible ? "#888" : "#ddd"} style={{ cursor: "default", transition: "color 0.15s" }} />
      {visible && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", right: 0,
          background: "#1a1a1a", color: "#fff", fontSize: 11, lineHeight: 1.5,
          padding: "7px 12px", borderRadius: 8, whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 50, pointerEvents: "none",
        }}>
          {text}
          <div style={{ position: "absolute", bottom: -4, right: 10, width: 8, height: 8, background: "#1a1a1a", transform: "rotate(45deg)", borderRadius: 2 }} />
        </div>
      )}
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

function MainDashboard() {
  const [stats, setStats] = useState<Stats>({ shortlets: 0, furniture: 0, bookings: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [sl, fu, st] = await Promise.all([
        fetch("/api/admin/shortlets").then((r) => r.json()),
        fetch("/api/admin/furniture").then((r) => r.json()),
        fetch("/api/admin/stats").then((r) => r.json()),
      ]);
      setStats({ shortlets: Array.isArray(sl) ? sl.length : 0, furniture: Array.isArray(fu) ? fu.length : 0, bookings: st.bookings ?? 0, users: st.users ?? 0 });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Highlights */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ color: "#0a0a0a", fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>Highlights</p>
          <p style={{ color: "#bbb", fontSize: 12, margin: 0 }}>Live platform overview</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {CARDS.map(({ label, key, icon: Icon, accent, bg, trend, sub, tip }) => {
          const val = loading ? null : stats[key];
          const isPositive = trend.startsWith("+");
          return (
            <div key={label} style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: "20px 22px" }}>
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={accent} />
                  </div>
                  <span style={{ color: "#888", fontSize: 12, fontWeight: 500 }}>{label}</span>
                </div>
                <InfoTooltip text={tip} />
              </div>

              {/* Big number */}
              <p style={{ color: "#0a0a0a", fontSize: 32, fontWeight: 800, margin: "0 0 10px", lineHeight: 1, letterSpacing: "-1px" }}>
                {val === null ? "…" : String(val).padStart(2, "0")}
              </p>

              {/* Trend */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {isPositive
                  ? <TrendingUp size={13} color="#16a34a" />
                  : <TrendingDown size={13} color="#dc2626" />}
                <span style={{ color: isPositive ? "#16a34a" : "#dc2626", fontSize: 12, fontWeight: 700 }}>{trend}</span>
                <span style={{ color: "#bbb", fontSize: 11 }}>{sub}</span>
              </div>
            </div>
          );
        })}
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{ position: "relative" }}>
              <PieChart width={160} height={160}>
                <Pie data={donutData} cx={75} cy={75} innerRadius={52} outerRadius={72} dataKey="value" strokeWidth={0}>
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#aaa", fontSize: 10, margin: "0 0 2px" }}>Total Items</p>
                <p style={{ color: "#0a0a0a", fontSize: 22, fontWeight: 700, margin: 0 }}>{loading ? "…" : stats.shortlets + stats.furniture}</p>
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
              { label: "Add New Shortlet",  href: "/admin/shortlets/new", bg: NAVY_BG,   color: NAVY },
              { label: "Add Furniture Item", href: "/admin/furniture/new", bg: "#fdf0eb", color: "#c46442" },
              { label: "View All Bookings",  href: "/admin/bookings",      bg: "#e9f0fd", color: "#1e56d6" },
              { label: "Manage Users",       href: "/admin/users",         bg: "#e9fdf0", color: "#15803d" },
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

export default function AdminDashboard() {
  const workspace = useAdminWorkspace();
  if (workspace === "mudres") return <MudresDashboard />;
  if (workspace === "abode") return <AbodeDashboard />;
  return <MainDashboard />;
}
