import HorizontalScroll from "@/components/landing/HorizontalScroll";
import AboutSection from "@/components/landing/AboutSection";
import IdentityMarquee from "@/components/landing/IdentityMarquee";
import BrandStatement from "@/components/landing/BrandStatement";
import ProcessSection from "@/components/landing/ProcessSection";
import ReviewsSection from "@/components/landing/ReviewsSection";
import FinalCTA from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HorizontalScroll />
      <AboutSection />
      <IdentityMarquee />
      <BrandStatement />
      <ProcessSection />
      <FinalCTA />
      <ReviewsSection />
    </>
  );
}
