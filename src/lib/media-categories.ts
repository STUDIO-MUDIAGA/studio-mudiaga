export type MediaCategory = { id: string; name: string; slug: string; created_at: string };

export const RESERVED_SLUGS = ["homepage", "mudres", "abode", "shortlets", "furniture"];

export function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,40}$/.test(slug);
}
