import Link from "next/link";
import {
  Armchair,
  Sofa,
  Table2,
  UtensilsCrossed,
  BedDouble,
  Lamp,
  Archive,
  Flower2,
  Briefcase,
  TreePine,
  ChefHat,
  Tv,
  type LucideIcon,
} from "lucide-react";
import type { FurnitureItem } from "@/lib/furniture";

const DARK = "#2A3812";

type Category = { name: string; icon: LucideIcon; color: string };

/** Fixed icon + accent-color pairing per category — each tile gets its own color. */
const CATEGORIES: Category[] = [
  { name: "Seating", icon: Armchair, color: "#C1440E" },
  { name: "Sofas", icon: Sofa, color: "#2563EB" },
  { name: "Tables", icon: Table2, color: "#B8860B" },
  { name: "Dining", icon: UtensilsCrossed, color: "#0F766E" },
  { name: "Bedroom", icon: BedDouble, color: "#9333EA" },
  { name: "Lighting", icon: Lamp, color: "#D97706" },
  { name: "Storage", icon: Archive, color: "#65A30D" },
  { name: "Decor", icon: Flower2, color: "#DB2777" },
  { name: "Office", icon: Briefcase, color: "#1D4ED8" },
  { name: "Outdoor", icon: TreePine, color: "#16A34A" },
  { name: "Kitchen", icon: ChefHat, color: "#DC2626" },
  { name: "Media", icon: Tv, color: "#0891B2" },
];

function Tile({ cat }: { cat: Category }) {
  const Icon = cat.icon;
  return (
    <Link
      href={`/mudres/collection?category=${encodeURIComponent(cat.name)}`}
      className="group block shrink-0"
      style={{ textDecoration: "none", width: "clamp(130px, 15vw, 175px)", "--tile-c": cat.color } as React.CSSProperties}
    >
      <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#F4F4F1] transition-colors duration-300 group-hover:bg-[var(--tile-c)]/10" style={{ aspectRatio: "1" }}>
        <Icon
          className="h-9 w-9 md:h-11 md:w-11 text-[#1A1A1A] transition-all duration-300 ease-out group-hover:text-[var(--tile-c)] group-hover:scale-110"
          strokeWidth={1.5}
        />
      </div>
      <p
        className="text-center"
        style={{
          color: DARK,
          fontSize: 15,
          fontWeight: 500,
          margin: "12px 0 0",
        }}
      >
        {cat.name}
      </p>
    </Link>
  );
}

export default function CategoryGrid({ items }: { items: FurnitureItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="pt-4 pb-14 md:pb-20 overflow-hidden">
      <h2
        className="px-5 md:px-10"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          color: DARK,
          fontSize: "clamp(24px, 3.2vw, 34px)",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        Shop All Categories
      </h2>

      <style>{`
        @keyframes categoryLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .category-track {
          animation: categoryLoop 40s linear infinite;
          will-change: transform;
        }
        .category-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative mt-7 md:mt-8">
        <div className="category-track flex gap-4 md:gap-5 w-max px-5 md:px-10">
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <Tile key={`${cat.name}-${i}`} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
