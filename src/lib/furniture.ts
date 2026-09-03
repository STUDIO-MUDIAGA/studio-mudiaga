import { createClient } from "@supabase/supabase-js";

export type FurnitureItem = {
  id: string;
  name: string;
  category: string | null;
  price: number | null;
  original_price: number | null;
  images: string[] | null;
  description: string | null;
  in_stock: boolean;
  featured: boolean;
};

const PUBLIC_FIELDS =
  "id, name, category, price, original_price, images, description, in_stock, featured";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/** Catalogue for the public MUDRES pages. Server-side only. */
export async function getFurniture(): Promise<FurnitureItem[]> {
  const { data, error } = await db
    .from("furniture_items")
    .select(PUBLIC_FIELDS)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as FurnitureItem[];
}
