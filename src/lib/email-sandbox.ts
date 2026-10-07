import { escapeHtml } from "@/lib/signalworks/email";

type SandboxEmailPayload = {
  to: string | string[];
  subject?: string;
  html?: string;
};

/** Production inbox — never used as a send target while sandbox is on. */
export const BARN_PRODUCTION_INBOX = "thebarnbaseball.com";

export function isEmailSandboxEnabled(): boolean {
  const explicit = process.env.BARN_EMAIL_SANDBOX?.trim().toLowerCase();
  if (explicit === "false") return false;
  if (explicit === "true") return true;

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").toLowerCase();
  return siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
}

export function sandboxRecipient(): string {
  const sandboxTo =
    process.env.BARN_EMAIL_SANDBOX_TO?.trim() ?? process.env.BARN_CONTACT_EMAIL?.trim();
  if (!sandboxTo) {
    throw new Error("EMAIL_SANDBOX_NOT_CONFIGURED");
  }
  return sandboxTo;
}

function formatOriginalRecipients(to: string | string[]): string {
  return Array.isArray(to) ? to.join(", ") : to;
}

export function applyEmailSandbox<T extends SandboxEmailPayload>(payload: T): T {
  if (!isEmailSandboxEnabled()) {
    return payload;
  }

  const originalTo = formatOriginalRecipients(payload.to);
  const redirectTo = sandboxRecipient();

  const banner = `
    <div style="margin: 0 0 16px; padding: 12px; background: #fff8e6; border: 1px solid #e6c200; font-family: sans-serif; font-size: 13px;">
      <strong>Sandbox email</strong> — would have been sent to: ${escapeHtml(originalTo)}
    </div>
  `;

  return {
    ...payload,
    to: redirectTo,
    subject: payload.subject?.startsWith("[SANDBOX]")
      ? payload.subject
      : `[SANDBOX] ${payload.subject ?? ""}`,
    html: `${banner}${payload.html ?? ""}`,
  };
}
