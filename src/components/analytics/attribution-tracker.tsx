"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ATTRIBUTION_COOKIE,
  deserializeAttribution,
  mergeFirstTouch,
  parseAttributionFromSearchParams,
  serializeAttribution,
} from "@/lib/attribution/parse";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 90;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function AttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const incoming = parseAttributionFromSearchParams(
      params,
      `${pathname}${window.location.search}`,
      document.referrer || null,
    );
    const existing = deserializeAttribution(readCookie(ATTRIBUTION_COOKIE));
    const merged = mergeFirstTouch(existing, incoming);
    writeCookie(ATTRIBUTION_COOKIE, serializeAttribution(merged));
  }, [pathname, searchParams]);

  return null;
}

export function getStoredAttribution() {
  return deserializeAttribution(readCookie(ATTRIBUTION_COOKIE));
}
