import Link from "next/link";
import type { FurnitureItem } from "@/lib/furniture";

const DARK = "#2A3812";

/** Preferred running order; anything unlisted falls in after, alphabetically. */
const ORDER = ["Seating", "Tables", "Lighting", "Storage", "Bedroom", "Decor"];

type Tile = { name: string; image: string | null; count: number };

function buildTiles(items: FurnitureItem[]): Tile[] {
  const byCategory = new Map<string, Tile>();

  for (const item of items) {
    const name = item.category ?? "Other";
    const tile = byCategory.get(name) ?? { name, image: null, count: 0 };
    // First in-stock piece with artwork represents the category.
    if (!tile.image && item.in_stock && item.images?.[0]) tile.image = item.images[0];
    if (item.in_stock) tile.count += 1;
    byCategory.set(name, tile);
  }

  return Array.from(byCategory.values()).sort((a, b) => {
    const ia = ORDER.indexOf(a.name);
    const ib = ORDER.indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

export default function CategoryGrid({ items }: { items: FurnitureItem[] }) {
  const tiles = buildTiles(items);
  if (tiles.length === 0) return null;

  return (
    <section className="px-5 md:px-10 pt-4 pb-14 md:pb-20">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2
          style={{
            color: DARK,
            fontSize: "clamp(24px, 3.2vw, 34px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: "0 0 28px",
          }}
        >
          Shop All Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-5 gap-y-7">
          {tiles.map((tile) => (
            <Link
              key={tile.name}
              href={`/mudres/collection?category=${encodeURIComponent(tile.name)}`}
              className="group block"
              style={{ textDecoration: "none" }}
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ aspectRatio: "1", background: "#F4F4F1" }}
              >
                {tile.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tile.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
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
                {tile.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
