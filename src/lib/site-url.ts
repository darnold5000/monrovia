export const PRODUCTION_SITE_URL = "https://sluggersohio.com";

function normalizeSiteOrigin(value: string) {
  return new URL(value.trim()).origin;
}

export function getSiteUrl() {
  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return configuredUrl
    ? normalizeSiteOrigin(configuredUrl)
    : "http://localhost:3000";
}

export function absoluteSiteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return new URL(path).toString();
  }

  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return new URL(normalizedPath, `${getSiteUrl()}/`).toString();
}
