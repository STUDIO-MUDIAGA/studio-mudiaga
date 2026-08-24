import { notFound } from "next/navigation";
import ProjectShowcase from "@/components/projects/ProjectShowcase";
import { getProjectBySlug } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function DbProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <ProjectShowcase
      data={{
        eyebrow: project.eyebrow,
        title: project.title,
        location: project.location,
        heroImage: project.hero_image,
        intro: project.intro,
        facts: project.facts,
        gallery: project.gallery,
        cta: { label: project.cta_label, href: project.cta_href },
      }}
    />
  );
}
