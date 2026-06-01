import { notFound } from "next/navigation";
import { furnitureItems } from "@/data/furniture";
import FurnitureDetailClient from "./FurnitureDetailClient";

export function generateStaticParams() {
  return furnitureItems.map((f) => ({ id: f.id }));
}

export default async function FurnitureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = furnitureItems.find((f) => f.id === id);
  if (!item) notFound();

  return <FurnitureDetailClient item={item} />;
}
