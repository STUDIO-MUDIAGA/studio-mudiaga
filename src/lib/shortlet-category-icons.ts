import {
  Waves, Crown, Briefcase, Home, Heart, Building2, Tag, Droplets,
  type LucideIcon,
} from "lucide-react";

/** shortlet_categories.icon is stored kebab-case (seeded directly against
 *  the DB — there's no icon picker in the admin categories UI yet, unlike
 *  MUDRES's category-icons.ts which uses PascalCase keys from an actual
 *  picker). This just resolves what's already there for display. */
export const SHORTLET_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "waves": Waves,
  "crown": Crown,
  "briefcase": Briefcase,
  "home": Home,
  "heart": Heart,
  "building-2": Building2,
  "tag": Tag,
  "droplets": Droplets,
};

export const DEFAULT_SHORTLET_CATEGORY_ICON = "tag";

export function resolveShortletCategoryIcon(name: string | null | undefined): LucideIcon {
  return SHORTLET_CATEGORY_ICONS[name ?? ""] ?? SHORTLET_CATEGORY_ICONS[DEFAULT_SHORTLET_CATEGORY_ICON];
}
