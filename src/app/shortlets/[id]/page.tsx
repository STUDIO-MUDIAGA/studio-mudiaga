import { notFound } from "next/navigation";
import Image from "next/image";
import { shortlets } from "@/data/shortlets";
import ShortletDetailClient from "./ShortletDetailClient";

export function generateStaticParams() {
  return shortlets.map((s) => ({ id: s.id }));
}

export default async function ShortletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shortlet = shortlets.find((s) => s.id === id);
  if (!shortlet) notFound();

  return <ShortletDetailClient shortlet={shortlet} />;
}
