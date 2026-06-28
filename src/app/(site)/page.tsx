import HorizontalScroll from "@/components/landing/HorizontalScroll";
import AboutSection from "@/components/landing/AboutSection";
import ImageCarousel from "@/components/landing/ImageCarousel";

export default function HomePage() {
  return (
    <>
      <HorizontalScroll />
      <AboutSection />
      <ImageCarousel />
    </>
  );
}
