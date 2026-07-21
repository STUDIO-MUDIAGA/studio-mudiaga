import ProjectShowcase from "@/components/projects/ProjectShowcase";

export default function ProjectUBPage() {
  return (
    <ProjectShowcase
      data={{
        eyebrow: "Project — Interior Decor",
        title: "UB",
        location: "Nigeria",
        heroImage: "/IMG_1660.JPG",
        intro: [
          "Project UB is an interior decor project for a private residence — a study in restraint, where every material and surface was chosen with intention.",
          "The brief called for quiet luxury: honest textures, considered lighting, and furniture built to anchor the space rather than compete with it. The result carries the same design language as the rest of the Studio Mudiaga portfolio, adapted to the client's own way of living.",
        ],
        gallery: [
          { src: "/IMG_1639.JPG", alt: "Project UB interior" },
          { src: "/IMG_1640.JPG", alt: "Project UB interior" },
          { src: "/IMG_1642.JPG", alt: "Project UB interior" },
          { src: "/IMG_1643.JPG", alt: "Project UB interior" },
          { src: "/IMG_1655.JPG", alt: "Project UB interior" },
        ],
        cta: { label: "Enquire About a Project Like This", href: "/book" },
      }}
    />
  );
}
