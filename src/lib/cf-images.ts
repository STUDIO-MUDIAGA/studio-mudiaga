const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH ?? "";

/**
 * Build a Cloudflare Images delivery URL.
 * variant: "public" (original), "thumb" (200px), "card" (800px), etc.
 * Define variants in your Cloudflare Images dashboard.
 */
export function cfImageUrl(imageId: string, variant: "public" | "thumb" | "card" | "hero" = "public"): string {
  if (!imageId) return "";
  // Already a full URL (Unsplash placeholder etc.) — return as-is
  if (imageId.startsWith("http")) return imageId;
  return `https://imagedelivery.net/${ACCOUNT_HASH}/${imageId}/${variant}`;
}

/**
 * Upload a file to Cloudflare Images from the server side.
 * Call this only from API routes (uses secret token).
 */
export async function uploadToCF(file: File | Blob, filename?: string): Promise<{ id: string; url: string }> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Cloudflare credentials not configured");

  const body = new FormData();
  body.append("file", file, filename ?? "upload");

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiToken}` },
    body,
  });

  const json = await res.json() as { success: boolean; result?: { id: string; variants: string[] }; errors?: { message: string }[] };
  if (!json.success || !json.result) {
    throw new Error(json.errors?.[0]?.message ?? "Cloudflare upload failed");
  }

  return {
    id: json.result.id,
    url: cfImageUrl(json.result.id, "public"),
  };
}

/**
 * Delete an image from Cloudflare Images by ID.
 */
export async function deleteFromCF(imageId: string): Promise<void> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return;
  if (!imageId || imageId.startsWith("http")) return; // skip placeholders

  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiToken}` },
  });
}
