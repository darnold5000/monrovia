import { afterEach, describe, expect, it } from "vitest";
import { applyEmailSandbox, isEmailSandboxEnabled } from "./email-sandbox";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("email sandbox", () => {
  it("auto-enables on localhost site URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    delete process.env.BARN_EMAIL_SANDBOX;
    expect(isEmailSandboxEnabled()).toBe(true);
  });

  it("can be forced off on localhost", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.BARN_EMAIL_SANDBOX = "false";
    expect(isEmailSandboxEnabled()).toBe(false);
  });

  it("redirects outbound mail when sandbox is on", () => {
    process.env.BARN_EMAIL_SANDBOX = "true";
    process.env.BARN_EMAIL_SANDBOX_TO = "dev@example.com";

    const result = applyEmailSandbox({
      to: "thebarnbaseball.com",
      subject: "Package purchased",
      html: "<p>Hi</p>",
    });

    expect(result.to).toBe("dev@example.com");
    expect(result.subject).toBe("[SANDBOX] Package purchased");
    expect(result.html).toContain("thebarnbaseball.com");
  });
});
