import ProjectShowcase from "@/components/projects/ProjectShowcase";

export default function ProjectAbodePage() {
  return (
    <ProjectShowcase
      data={{
        eyebrow: "Project — Interior Decor",
        title: "Abode",
        location: "Nigeria",
        heroImage: "/IMG_1666.JPG",
        intro: [
          "Abode is an interior decor project spanning a collection of properties — each one approached as its own design brief, built around warm materials, honest craftsmanship, and a considered sense of scale.",
          "Every room carries the same quiet language that defines Studio Mudiaga's work: natural textures, restrained detailing, and furniture chosen — in many cases handcrafted — specifically for the space it sits in.",
        ],
        gallery: [
          { src: "/IMG_1630.JPG", alt: "Abode interior" },
          { src: "/IMG_1631.JPG", alt: "Abode interior" },
          { src: "/IMG_1632.JPG", alt: "Abode interior" },
          { src: "/IMG_1635.JPG", alt: "Abode interior" },
          { src: "/IMG_1668.JPG", alt: "Abode interior" },
        ],
        cta: { label: "View Available Stays", href: "/abode" },
      }}
    />
  );
}
