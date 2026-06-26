import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

export async function GET() {
  const [shortletsRes, reviewsRes] = await Promise.all([
    db.from("shortlets").select("id,title,city,price,rating,review_count,bedrooms,guests,available,property_type,amenities,images"),
    db.from("shortlet_reviews").select("shortlet_id,rating,stay_date"),
  ]);

  if (shortletsRes.error) return NextResponse.json({ error: shortletsRes.error.message }, { status: 500 });

  const shortlets = shortletsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  // Overview
  const total = shortlets.length;
  const available = shortlets.filter((s) => s.available).length;
  const avgRating = total ? +(shortlets.reduce((s, p) => s + (p.rating || 0), 0) / total).toFixed(2) : 0;
  const avgPrice = total ? Math.round(shortlets.reduce((s, p) => s + p.price, 0) / total) : 0;
  const totalReviews = reviews.length;

  // By city
  const cityMap: Record<string, number> = {};
  for (const s of shortlets) cityMap[s.city] = (cityMap[s.city] ?? 0) + 1;
  const byCity = Object.entries(cityMap).map(([city, count]) => ({ city, count })).sort((a, b) => b.count - a.count);

  // By property type
  const typeMap: Record<string, number> = {};
  for (const s of shortlets) typeMap[s.property_type ?? "Unknown"] = (typeMap[s.property_type ?? "Unknown"] ?? 0) + 1;
  const byType = Object.entries(typeMap).map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

  // Price tiers
  const tiers = [
    { label: "Budget", range: "< ₦80k", min: 0, max: 80000 },
    { label: "Mid-range", range: "₦80k–₦150k", min: 80000, max: 150000 },
    { label: "Luxury", range: "₦150k–₦250k", min: 150000, max: 250000 },
    { label: "Ultra-luxury", range: "> ₦250k", min: 250000, max: Infinity },
  ];
  const byPriceTier = tiers.map((t) => ({
    ...t,
    count: shortlets.filter((s) => s.price >= t.min && s.price < t.max).length,
  }));

  // Bedroom distribution
  const bedMap: Record<number, number> = {};
  for (const s of shortlets) bedMap[s.bedrooms] = (bedMap[s.bedrooms] ?? 0) + 1;
  const byBedrooms = Object.entries(bedMap)
    .map(([beds, count]) => ({ beds: Number(beds), count }))
    .sort((a, b) => a.beds - b.beds);

  // Top rated (min 1 review)
  const topRated = [...shortlets]
    .filter((s) => s.rating > 0)
    .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    .slice(0, 5)
    .map((s) => ({ id: s.id, title: s.title, city: s.city, rating: s.rating, review_count: s.review_count, price: s.price, image: s.images?.[0] ?? null }));

  // Most reviewed
  const mostReviewed = [...shortlets]
    .sort((a, b) => b.review_count - a.review_count)
    .slice(0, 5)
    .map((s) => ({ id: s.id, title: s.title, city: s.city, rating: s.rating, review_count: s.review_count, price: s.price }));

  // Amenity popularity
  const amenityMap: Record<string, number> = {};
  for (const s of shortlets) for (const a of s.amenities ?? []) amenityMap[a] = (amenityMap[a] ?? 0) + 1;
  const topAmenities = Object.entries(amenityMap)
    .map(([amenity, count]) => ({ amenity, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Reviews by month
  const monthMap: Record<string, number> = {};
  for (const r of reviews) {
    const key = r.stay_date ?? "Unknown";
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  }
  const reviewsByMonth = Object.entries(monthMap)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const [aM, aY] = a.month.split(" ");
      const [bM, bY] = b.month.split(" ");
      return Number(aY) - Number(bY) || months.indexOf(aM) - months.indexOf(bM);
    });

  return NextResponse.json({
    overview: { total, available, hidden: total - available, avgRating, avgPrice, totalReviews },
    byCity,
    byType,
    byPriceTier,
    byBedrooms,
    topRated,
    mostReviewed,
    topAmenities,
    reviewsByMonth,
  });
}
