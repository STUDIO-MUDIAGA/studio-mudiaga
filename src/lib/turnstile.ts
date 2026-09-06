/** Server-side verification for Cloudflare Turnstile tokens.
 *
 *  Inactive (always passes) until TURNSTILE_SECRET_KEY is set in the
 *  environment — that key does not exist yet, so nothing is actually
 *  blocked by this until it is added. See TurnstileWidget.tsx for the
 *  matching client piece. */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

let warned = false;

export function turnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string | null
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (!warned) {
      warned = true;
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY is not set — verification is a no-op and this form is unprotected."
      );
    }
    return { ok: true };
  }

  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = await res.json();
    if (!data.success) {
      return { ok: false, reason: (data["error-codes"] ?? []).join(",") || "failed" };
    }
    return { ok: true };
  } catch {
    // Cloudflare unreachable: fail closed so an outage cannot be used to
    // bypass the check silently.
    return { ok: false, reason: "verify_unreachable" };
  }
}
