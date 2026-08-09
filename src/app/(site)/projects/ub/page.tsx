import ProjectShowcase from "@/components/projects/ProjectShowcase";

const R2 = "https://pub-2ddf02e2e1654b72808b735601463baf.r2.dev/project-ub";

export default function ProjectUBPage() {
  return (
    <ProjectShowcase
      data={{
        eyebrow: "Project: Interior Design",
        title: "UB",
        location: "Nigeria",
        heroImage: `${R2}/318cb696-ce33-4bb7-966e-62d193baaf1d.png`,
        intro: [
          "Project UB is an interior design project for a private residence, a study in restraint, where every material and surface was chosen with intention.",
          "The brief called for quiet luxury: honest textures, considered lighting, and furniture built to anchor the space rather than compete with it. The result carries the same design language as the rest of the Studio Mudiaga portfolio, adapted to the client's own way of living.",
          "It reads as calm from every angle, but rewards a closer look: proportions considered down to the centimeter, and objects chosen as much for how they feel as how they look.",
        ],
        facts: [
          { value: "1", label: "Residence" },
          { value: "Lagos", label: "Location" },
          { value: "3+", label: "Rooms Reimagined" },
          { value: "2024", label: "Completed" },
        ],
        storyRows: [
          {
            eyebrow: "The Brief",
            heading: "Quiet luxury, built around restraint.",
            body: [
              "The client wanted a home that felt considered rather than decorated, every surface earning its place instead of competing for attention.",
              "Warm ambient light, honest textures, and generous scale give each room a sense of calm the moment you walk in.",
            ],
            image: { src: `${R2}/7240b28d-f140-41de-882e-ff7902d1541d.png`, alt: "Project UB bedroom" },
          },
          {
            eyebrow: "Details & Objects",
            heading: "Small gestures, held to the same standard as the big ones.",
            body: [
              "Nothing in the space was left as an afterthought, even a bedside object was chosen for its form as much as its function.",
              "Brass, travertine, and dark timber recur throughout, giving every room a shared material vocabulary.",
            ],
            image: { src: `${R2}/26c710e2-2dd9-47dc-b82e-d0ae72643ada.png`, alt: "Project UB decorative object detail" },
          },
          {
            eyebrow: "Living With It",
            heading: "A space built to be used, not just photographed.",
            body: [
              "Beyond the finishes, the brief was always about how the home would actually be lived in: daylight, quiet corners, and furniture that holds up to daily life.",
              "That's the real measure of the project: a space that still feels considered long after the shoot.",
            ],
            image: { src: `${R2}/24066afc-2dcd-4d85-8385-82f076a84021.png`, alt: "Project UB resident in the finished space" },
          },
        ],
        gallery: [
          { src: `${R2}/bc71cc9d-71be-4351-9681-391df9a4dedf.png`, alt: "Project UB interior" },
          { src: `${R2}/787f1cd1-22ef-4882-8596-2122f618cb7f.png`, alt: "Project UB interior" },
          { src: `${R2}/05eb32ba-b005-48bc-83d2-9ce480ab404e.png`, alt: "Project UB interior" },
          { src: `${R2}/16f32aab-4d5b-46db-a57b-cf80ecf9f7d9.png`, alt: "Project UB interior" },
          { src: `${R2}/8f871ab5-6666-487c-9d9e-c1774ff9f2ed.png`, alt: "Project UB interior" },
          { src: `${R2}/0693b61e-187e-4a2c-8319-572c888143d2.png`, alt: "Project UB travertine console" },
          { src: `${R2}/37ed9938-0950-4af6-9bdd-d6ae642eb6d1.png`, alt: "Project UB shelving detail" },
          { src: `${R2}/ee803654-28b6-4dc2-accc-5f03c271d0f7.png`, alt: "Project UB dressing area" },
          { src: `${R2}/99255ae1-f4b9-477d-b128-4c24ac8c1716.png`, alt: "Project UB side table detail" },
          { src: `${R2}/c9cdd7c8-42ba-4730-98cd-879fd94f4d3e.png`, alt: "Project UB joinery detail" },
          { src: `${R2}/413b6c65-9c7a-4fa6-ad2b-cac4cb3092b2.png`, alt: "Project UB bedroom" },
        ],
        cta: { label: "Enquire About a Project Like This", href: "/book-a-consultation" },
      }}
    />
  );
}
