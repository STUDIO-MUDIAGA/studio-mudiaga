import Image from "next/image";
import Link from "next/link";

const PROJECTS = [
  {
    title: "Abode",
    eyebrow: "Interior Decor",
    image: "/IMG_1666.JPG",
    href: "/projects/abode",
  },
  {
    title: "UB",
    eyebrow: "Interior Decor",
    image: "/IMG_1660.JPG",
    href: "/projects/ub",
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(140px, 14vw, 200px) 48px clamp(64px, 8vw, 120px)" }}>
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-5"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Our Work
        </p>
        <h1
          className="font-light text-black"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.15 }}
        >
          Projects
        </h1>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px clamp(80px, 10vw, 140px)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <Link key={project.href} href={project.href} className="group block">
              <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
              </div>
              <p
                className="text-black/40 mt-5 mb-1"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}
              >
                {project.eyebrow}
              </p>
              <h2
                className="text-black"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(24px, 2.6vw, 36px)", fontWeight: 400 }}
              >
                {project.title}
              </h2>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
