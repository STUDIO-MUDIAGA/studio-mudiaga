import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFurniture } from "@/lib/furniture";
import MudresHero from "@/components/mudres/MudresHero";
import ProductTile from "@/components/mudres/ProductTile";
import CategoryGrid from "@/components/mudres/CategoryGrid";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";

export const revalidate = 60;

export default async function MudresLanding() {
  const items = await getFurniture();
  const inStock = items.filter((f) => f.in_stock);
  const heroItems = inStock.slice(0, 6);
  const featured = inStock.slice(0, 8);

  return (
    <div style={{ background: WHITE, color: DARK, minHeight: "100vh" }}>
      <MudresHero products={heroItems} />

      <CategoryGrid items={items} />

      {/* ── Brand statement ── */}
      <section className="px-5 py-14 md:px-10 md:py-20" style={{ borderBottom: "1px solid rgba(42,56,18,0.08)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 16px" }}>Our philosophy</p>
            <h2 style={{ color: DARK, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>Craft rooted in culture, designed for today</h2>
            <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
              MUDRES draws from the richness of Nigerian craftsmanship: bold textures, warm tones, and forms that ground a space without overwhelming it. Every piece is a collaboration between maker and material.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
              "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
            ].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: i === 0 ? "16px 4px 4px 4px" : i === 3 ? "4px 4px 16px 4px" : 4 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection preview ── */}
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>The Collection</p>
              <h2 style={{ color: DARK, fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 700, margin: 0 }}>Handpicked pieces</h2>
            </div>
            <Link href="/mudres/collection" style={{ display: "flex", alignItems: "center", gap: 4, color: SAGE, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((item) => (
              <ProductTile key={item.id} item={item} />
            ))}
          </div>

          {featured.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(42,56,18,0.25)", fontSize: 13 }}>
              No pieces available right now.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
