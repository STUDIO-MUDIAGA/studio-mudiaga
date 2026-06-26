import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

function getClient() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const BUCKET = process.env.R2_BUCKET_NAME ?? "studio-mudiaga-r2";

/**
 * Build a public R2 delivery URL from a stored key.
 * Prefix: "shortlets/", "furniture/", "brand/" etc.
 * If the key is already a full URL (placeholder), return as-is.
 */
export function cfImageUrl(key: string): string {
  if (!key) return "";
  if (key.startsWith("http")) return key;
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Upload a file to Cloudflare R2.
 * Returns the storage key and the public delivery URL.
 */
export async function uploadToCF(
  file: File | Blob,
  prefix: MediaPrefix = "shortlets",
): Promise<{ key: string; url: string }> {
  const ext = file instanceof File ? file.name.split(".").pop() ?? "jpg" : "jpg";
  const key = `${prefix}/${randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type || "image/jpeg",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { key, url: cfImageUrl(key) };
}

export type MediaPrefix = "shortlets" | "furniture" | "homepage" | "mudres" | "abode";

export type R2Object = { key: string; url: string; size: number; lastModified: Date };

/**
 * List all objects in R2 under an optional prefix.
 * Pass no prefix to list everything (all media).
 */
export async function listFromCF(prefix?: MediaPrefix): Promise<R2Object[]> {
  const client = getClient();
  const res = await client.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix ? `${prefix}/` : undefined,
      MaxKeys: 1000,
    })
  );
  return (res.Contents ?? [])
    .filter((obj) => obj.Key)
    .map((obj) => ({
      key: obj.Key!,
      url: cfImageUrl(obj.Key!),
      size: obj.Size ?? 0,
      lastModified: obj.LastModified ?? new Date(),
    }));
}

/**
 * Delete a file from R2 by its storage key.
 * Skips full URLs (placeholder / external images).
 */
export async function deleteFromCF(key: string): Promise<void> {
  if (!key || key.startsWith("http")) return;
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
