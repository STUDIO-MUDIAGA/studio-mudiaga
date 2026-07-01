"use client";

import { useParams } from "next/navigation";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default function CategoryMediaPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const title = slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

  return <MediaLibrary prefix={slug} title={`${title} Media`} />;
}
