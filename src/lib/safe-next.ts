/** Only ever redirect to a path on this site. An absolute URL in the query
 *  string would let a crafted link bounce a signed-in user off-site. */
export function safeNext(raw: string | null | undefined, fallback = "/account"): string {
  if (!raw) return fallback;
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}
