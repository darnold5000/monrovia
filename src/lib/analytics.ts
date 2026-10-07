import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent =
  | "page_view"
  | "hero_start_training_click"
  | "phone_click"
  | "sms_click"
  | "directions_click"
  | "instagram_click"
  | "booking_portal_click"
  | "training_service_click"
  | "inquiry_started"
  | "inquiry_submitted"
  | "inquiry_error"
  | "booking_started"
  | "booking_submitted"
  | "booking_error"
  | "mobile_sticky_call_click"
  | "mobile_sticky_inquiry_click"
  | "package_checkout_started"
  | "package_checkout_redirect"
  | "package_checkout_error";

const fired = new Set<string>();

export function trackEvent(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  const key = `${name}:${JSON.stringify(properties ?? {})}`;
  if (fired.has(key)) return;
  fired.add(key);
  vercelTrack(name, properties);
}

export function trackEventRepeatable(
  name: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  vercelTrack(name, properties);
}

export function resetPageViewDedupe() {
  fired.delete("page_view:{}");
}
