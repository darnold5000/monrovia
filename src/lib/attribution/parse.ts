/** Adapted from signalworks-modules/attribution */

export type AttributionTouch = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  landingPage: string | null;
  referrer: string | null;
  capturedAt: string;
};

export const ATTRIBUTION_COOKIE = "ttf_attribution";

function clean(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim().slice(0, 500);
  return trimmed.length > 0 ? trimmed : null;
}

export function parseAttributionFromSearchParams(
  searchParams: URLSearchParams,
  landingPage: string,
  referrer: string | null,
  capturedAt = new Date().toISOString(),
): AttributionTouch {
  return {
    utmSource: clean(searchParams.get("utm_source")),
    utmMedium: clean(searchParams.get("utm_medium")),
    utmCampaign: clean(searchParams.get("utm_campaign")),
    utmTerm: clean(searchParams.get("utm_term")),
    utmContent: clean(searchParams.get("utm_content")),
    landingPage: clean(landingPage),
    referrer: clean(referrer),
    capturedAt,
  };
}

export function hasCampaignParams(touch: AttributionTouch): boolean {
  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.utmTerm ||
      touch.utmContent,
  );
}

export function serializeAttribution(touch: AttributionTouch): string {
  return JSON.stringify(touch);
}

export function deserializeAttribution(raw: string | null): AttributionTouch | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AttributionTouch;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function mergeFirstTouch(
  existing: AttributionTouch | null,
  incoming: AttributionTouch,
): AttributionTouch {
  if (!existing) return incoming;
  return {
    utmSource: existing.utmSource ?? incoming.utmSource,
    utmMedium: existing.utmMedium ?? incoming.utmMedium,
    utmCampaign: existing.utmCampaign ?? incoming.utmCampaign,
    utmTerm: existing.utmTerm ?? incoming.utmTerm,
    utmContent: existing.utmContent ?? incoming.utmContent,
    landingPage: existing.landingPage ?? incoming.landingPage,
    referrer: existing.referrer ?? incoming.referrer,
    capturedAt: existing.capturedAt ?? incoming.capturedAt,
  };
}
