interface SendArgs {
  to?: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Business inbox that receives form notifications. */
export const BUSINESS_EMAIL = process.env.CONTACT_EMAIL ?? "hello@burgerhouse.am";

/**
 * Pluggable email sender. Uses Resend if RESEND_API_KEY is set; otherwise it's a
 * clearly-logged no-op so the whole flow works (and builds) in dev without keys.
 */
export async function sendEmail({
  to = BUSINESS_EMAIL,
  subject,
  html,
  replyTo,
}: SendArgs): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "BurgerHouse <onboarding@resend.dev>";

  if (!key) {
    console.info(
      `[email:dev-noop] RESEND_API_KEY not set — would send "${subject}" → ${to}`,
    );
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error", res.status, body);
      return { ok: false, error: "We couldn't send that just now. Please try again." };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "We couldn't send that just now. Please try again." };
  }
}

/** Minimal HTML escape for user-supplied values in emails. */
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
