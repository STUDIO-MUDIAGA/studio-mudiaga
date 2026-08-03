import ProjectShowcase from "@/components/projects/ProjectShowcase";

export default function ProjectAbodePage() {
  return (
    <ProjectShowcase
      data={{
        eyebrow: "Project — Interior Design",
        title: "Abode",
        location: "Nigeria",
        heroImage: "/IMG_1666.JPG",
        intro: [
          "Abode is an interior design project spanning a collection of properties — each one approached as its own design brief, built around warm materials, honest craftsmanship, and a considered sense of scale.",
          "Every room carries the same quiet language that defines Studio Mudiaga's work: natural textures, restrained detailing, and furniture chosen — in many cases handcrafted — specifically for the space it sits in.",
          "What began as a single apartment has grown into a running body of work, each new property giving us room to push the palette further while staying true to the same core sensibility.",
        ],
        facts: [
          { value: "4+", label: "Properties" },
          { value: "Lagos", label: "Cities" },
          { value: "2023", label: "Since" },
          { value: "Nightly", label: "Availability" },
        ],
        storyRows: [
          {
            eyebrow: "The Collection",
            heading: "A range of properties, one design language.",
            body: [
              "No two Abode properties are identical, but every one is drawn from the same well: warm neutrals, tactile materials, and layouts that give a space room to breathe.",
              "Living rooms are built around a single strong gesture — a color, a texture, a piece of furniture — rather than competing details, so the eye always has somewhere quiet to land.",
            ],
            image: { src: "/IMG_1642.JPG", alt: "Abode living room detail" },
          },
          {
            eyebrow: "Materials & Craft",
            heading: "Furniture chosen — and often made — for the room it sits in.",
            body: [
              "Where a piece didn't exist in the right form, we made it. Coffee tables, headboards, and storage were built in-house so proportion and material could be tuned to the exact space.",
              "Brass fittings, glass, dark timber, and leather recur across the collection, always kept in balance so no single material overwhelms the room.",
            ],
            image: { src: "/IMG_1655.JPG", alt: "Abode bedroom detail" },
          },
          {
            eyebrow: "Lighting & Atmosphere",
            heading: "Every room is designed to feel different after dark.",
            body: [
              "Layered lighting — wall-mounted arms, low ambient pools, the occasional sculptural fixture — was as much a part of the design brief as furniture selection.",
              "The result is a set of properties that photograph beautifully but are built, first, to be lived in.",
            ],
            image: { src: "/IMG_1640.JPG", alt: "Abode lighting detail" },
          },
        ],
        gallery: [
          { src: "/IMG_1630.JPG", alt: "Abode interior" },
          { src: "/IMG_1631.JPG", alt: "Abode interior" },
          { src: "/IMG_1632.JPG", alt: "Abode interior" },
          { src: "/IMG_1635.JPG", alt: "Abode interior" },
          { src: "/IMG_1668.JPG", alt: "Abode interior" },
          { src: "/IMG_1639.JPG", alt: "Abode interior detail" },
          { src: "/IMG_1643.JPG", alt: "Abode interior" },
          { src: "/IMG_1659.JPG", alt: "Abode interior" },
          { src: "/IMG_1660.JPG", alt: "Abode interior" },
          { src: "/IMG_1676.JPG", alt: "Abode interior" },
          { src: "/IMG_1669.JPG", alt: "Abode interior" },
        ],
        cta: { label: "View Available Stays", href: "/abode" },
      }}
    />
  );
}
