import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import FeaturedShortlets from "@/components/landing/FeaturedShortlets";
import FeaturedFurniture from "@/components/landing/FeaturedFurniture";
import SplitCTA from "@/components/landing/SplitCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedShortlets />
      <SplitCTA />
      <FeaturedFurniture />
    </>
  );
}
