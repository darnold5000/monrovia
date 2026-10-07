import { afterEach, describe, expect, it, vi } from "vitest";
import {
  absoluteSiteUrl,
  getSiteUrl,
  PRODUCTION_SITE_URL,
} from "@/lib/site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("Sluggers site URLs", () => {
  it("uses the canonical production domain even when a stale demo URL is configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://sluggers-demo.vercel.app/");

    expect(getSiteUrl()).toBe(PRODUCTION_SITE_URL);
  });

  it("joins paths without duplicate slashes", () => {
    vi.stubEnv("NODE_ENV", "production");

    expect(absoluteSiteUrl("/")).toBe("https://sluggersohio.com/");
    expect(absoluteSiteUrl("//tournaments")).toBe(
      "https://sluggersohio.com/tournaments",
    );
  });

  it("normalizes a local development URL with a trailing slash", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000/");

    expect(getSiteUrl()).toBe("http://localhost:3000");
    expect(absoluteSiteUrl("/training")).toBe(
      "http://localhost:3000/training",
    );
  });
});
