import ProjectShowcase from "@/components/projects/ProjectShowcase";

export default function ProjectUBPage() {
  return (
    <ProjectShowcase
      data={{
        eyebrow: "Project — Interior Decor",
        title: "UB",
        location: "Nigeria",
        heroImage: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/318cb696-ce33-4bb7-966e-62d193baaf1d.png",
        intro: [
          "Project UB is an interior decor project for a private residence — a study in restraint, where every material and surface was chosen with intention.",
          "The brief called for quiet luxury: honest textures, considered lighting, and furniture built to anchor the space rather than compete with it. The result carries the same design language as the rest of the Studio Mudiaga portfolio, adapted to the client's own way of living.",
        ],
        gallery: [
          { src: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/bc71cc9d-71be-4351-9681-391df9a4dedf.png", alt: "Project UB interior" },
          { src: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/787f1cd1-22ef-4882-8596-2122f618cb7f.png", alt: "Project UB interior" },
          { src: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/05eb32ba-b005-48bc-83d2-9ce480ab404e.png", alt: "Project UB interior" },
          { src: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/16f32aab-4d5b-46db-a57b-cf80ecf9f7d9.png", alt: "Project UB interior" },
          { src: "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub/8f871ab5-6666-487c-9d9e-c1774ff9f2ed.png", alt: "Project UB interior" },
        ],
        cta: { label: "Enquire About a Project Like This", href: "/book" },
      }}
    />
  );
}
