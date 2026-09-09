"use client";

import { useEffect, useState } from "react";
import { Users, Search, Heart, ShoppingBag } from "lucide-react";

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
  wishlist_count: number;
};

const fmt = (n: number) => "₦" + (n ?? 0).toLocaleString("en-NG");
const fmtDate = (s: string) => new Date(s).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data: Customer[]) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpend = users.reduce((n, u) => n + u.total_spent, 0);
  const withOrders = users.filter((u) => u.order_count > 0).length;

  return (
    <div style={{ padding: "32px 28px", minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 20, fontWeight: 700, color: "#1e156d", margin: 0 }}>MUDRES Customers</p>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>{users.length} registered account{users.length !== 1 ? "s" : ""}</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            style={{ paddingLeft: 32, paddingRight: 12, height: 36, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", width: 220 }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { icon: Users, label: "Total customers", value: users.length, color: "#1e156d" },
          { icon: ShoppingBag, label: "Have placed an order", value: withOrders, color: "#10b981" },
          { icon: Heart, label: "Total revenue from customers", value: fmt(totalSpend), color: "#c46442" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "18px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon size={16} color={color} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: "#1e156d", margin: "0 0 2px" }}>{value}</p>
            <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f0f0f0", backgroundColor: "#fafafa" }}>
              {["Customer", "Joined", "Orders", "Total Spent", "Wishlist"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "#aaa" }}>Loading customers…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "#aaa" }}>No customers found</td></tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eeedf8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#1e156d", fontSize: 12, fontWeight: 700 }}>{(u.full_name || u.email || "?").charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: "#111" }}>{u.full_name || "—"}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#888", fontSize: 12 }}>{fmtDate(u.created_at)}</td>
                  <td style={{ padding: "14px 16px", color: "#333", fontWeight: 600 }}>{u.order_count}</td>
                  <td style={{ padding: "14px 16px", color: "#1e156d", fontWeight: 600 }}>{fmt(u.total_spent)}</td>
                  <td style={{ padding: "14px 16px", color: "#888" }}>{u.wishlist_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
