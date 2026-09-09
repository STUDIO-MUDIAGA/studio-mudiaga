import {
  Sofa, Table2, Lamp, Archive, BedDouble, Flower2, LayoutGrid,
  Armchair, UtensilsCrossed, ChefHat, Tv, Briefcase, TreePine,
  type LucideIcon,
} from "lucide-react";

/** Icon choices an admin can assign to a furniture category. The stored
 *  value is just the key (e.g. "Sofa") — this map resolves it to the actual
 *  component wherever the icon needs to render (mega menu, admin picker). */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sofa, Table2, Lamp, Archive, BedDouble, Flower2, LayoutGrid,
  Armchair, UtensilsCrossed, ChefHat, Tv, Briefcase, TreePine,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export const DEFAULT_CATEGORY_ICON = "LayoutGrid";

export function resolveCategoryIcon(name: string | null | undefined): LucideIcon {
  return CATEGORY_ICONS[name ?? ""] ?? CATEGORY_ICONS[DEFAULT_CATEGORY_ICON];
}
