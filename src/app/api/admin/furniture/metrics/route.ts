import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET() {
  const { data: items, error } = await db.from("furniture_items").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: orders } = await db.from("furniture_orders").select("total, status, items, created_at");
  const { data: wishlistRows } = await db.from("furniture_wishlist").select("item_id");

  const validOrders = (orders ?? []).filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((s, o) => s + (o.total ?? 0), 0);
  const totalOrders = orders?.length ?? 0;
  const avgOrderValue = validOrders.length ? Math.round(totalRevenue / validOrders.length) : 0;

  const statusCounts: Record<string, number> = {};
  for (const o of orders ?? []) statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;

  // Real revenue for each of the last 6 months (oldest first).
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = validOrders
      .filter((o) => {
        const c = new Date(o.created_at);
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth();
      })
      .reduce((s, o) => s + (o.total ?? 0), 0);
    return { month: MONTH_LABELS[d.getMonth()], revenue };
  });

  // Most-wishlisted items, joined with the catalogue for name/image.
  const wishlistCounts = new Map<string, number>();
  for (const w of wishlistRows ?? []) wishlistCounts.set(w.item_id, (wishlistCounts.get(w.item_id) ?? 0) + 1);
  const mostWishlisted = [...wishlistCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([itemId, count]) => {
      const item = items?.find((i) => i.id === itemId);
      return { id: itemId, count, name: item?.name ?? "Removed item", category: item?.category ?? "", price: item?.price ?? 0, image: item?.images?.[0] ?? null };
    });

  const sales = { totalRevenue, totalOrders, avgOrderValue, statusCounts, monthlyRevenue, mostWishlisted };

  if (!items?.length) return NextResponse.json({ overview: { total: 0, inStock: 0, outOfStock: 0, featured: 0, avgPrice: 0, totalReviews: 0 }, byCategory: [], byMaterial: [], byPriceTier: [], topRated: [], topFeatured: [], sales });

  const inStock = items.filter((i) => i.in_stock);
  const avgPrice = Math.round(items.reduce((s, i) => s + (i.price ?? 0), 0) / items.length);
  const totalReviews = items.reduce((s, i) => s + (i.review_count ?? 0), 0);
  const avgRating = items.filter((i) => i.rating > 0).length
    ? parseFloat((items.filter((i) => i.rating > 0).reduce((s, i) => s + i.rating, 0) / items.filter((i) => i.rating > 0).length).toFixed(2))
    : 0;

  // By category
  const catMap: Record<string, number> = {};
  items.forEach((i) => { catMap[i.category] = (catMap[i.category] ?? 0) + 1; });
  const byCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count }));

  // By material
  const matMap: Record<string, number> = {};
  items.forEach((i) => { if (i.material) matMap[i.material] = (matMap[i.material] ?? 0) + 1; });
  const byMaterial = Object.entries(matMap).sort((a, b) => b[1] - a[1]).map(([material, count]) => ({ material, count }));

  // Price tiers
  const tiers = [
    { label: "Budget",      range: "< ₦100k",          min: 0,       max: 100000 },
    { label: "Mid-range",   range: "₦100k–₦300k",      min: 100000,  max: 300000 },
    { label: "Premium",     range: "₦300k–₦700k",      min: 300000,  max: 700000 },
    { label: "Luxury",      range: "> ₦700k",           min: 700000,  max: Infinity },
  ];
  const byPriceTier = tiers.map((t) => ({ ...t, count: items.filter((i) => i.price >= t.min && i.price < t.max).length }));

  // Top rated
  const topRated = items.filter((i) => i.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 6).map((i) => ({ id: i.id, name: i.name, category: i.category, price: i.price, rating: i.rating, review_count: i.review_count, image: i.images?.[0] ?? null }));

  // Featured
  const topFeatured = items.filter((i) => i.featured).slice(0, 5).map((i) => ({ id: i.id, name: i.name, category: i.category, price: i.price, image: i.images?.[0] ?? null }));

  return NextResponse.json({
    overview: { total: items.length, inStock: inStock.length, outOfStock: items.length - inStock.length, featured: items.filter((i) => i.featured).length, avgPrice, avgRating, totalReviews },
    byCategory, byMaterial, byPriceTier, topRated, topFeatured, sales,
  });
}
