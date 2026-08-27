import "server-only";
import { createClient } from "@supabase/supabase-js";

export { RESERVED_PROJECT_SLUGS } from "@/lib/project-constants";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export type DbFact = { value: string; label: string };
export type DbGalleryImage = { src: string; alt: string };

export type DbProject = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  location: string;
  hero_image: string;
  intro: string[];
  facts: DbFact[];
  gallery: DbGalleryImage[];
  cta_label: string;
  cta_href: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getPublishedProjects(): Promise<DbProject[]> {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as DbProject[];
}

export async function getProjectBySlug(slug: string): Promise<DbProject | null> {
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) return null;
  return data as DbProject;
}
