import { site } from "@/content/site";
import { listPublishedContent } from "@/lib/sluggers-cms";

function setting(data: Record<string, unknown>, key: string, fallback: string) {
  return typeof data[key] === "string" && data[key].trim() ? data[key].trim() : fallback;
}

export async function resolveSluggersSiteSettings(): Promise<ResolvedSluggersSite> {
  const [item] = await listPublishedContent("site_settings");
  if (!item) {
    return {
      ...site,
      calendarIds: {
        playingField: "sluggers.ohio@gmail.com",
        upstairs: "dfc83902467c36e1aa925eb56ba27cd29a1cd5c0900408bd498a1705e73462dc@group.calendar.google.com",
      },
    };
  }

  const data = item.data;
  const phone = setting(data, "phone", site.phone);
  const email = setting(data, "email", site.email);
  const addressText = setting(data, "address", `${site.address.line1}\n${site.address.city}, ${site.address.state} ${site.address.postalCode}`);
  const [line1 = site.address.line1, cityLine = ""] = addressText.split(/\r?\n/).map((line) => line.trim());
  const addressMatch = cityLine.match(/^(.*?),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/);
  const address = {
    ...site.address,
    line1,
    ...(addressMatch
      ? { city: addressMatch[1], state: addressMatch[2], postalCode: addressMatch[3] }
      : {}),
  };
  const fullAddress = `${address.line1}, ${address.city}, ${address.state} ${address.postalCode}`;
  const directionsUrl = setting(data, "mapsUrl", site.directionsUrl);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;

  return {
    ...site,
    name: setting(data, "businessName", site.name),
    description: site.description,
    phone,
    phoneHref: `tel:${phone.replace(/\D/g, "")}`,
    email,
    address: { ...address, full: fullAddress },
    directionsUrl,
    mapEmbedUrl,
    social: {
      facebook: setting(data, "facebook", site.social.facebook),
      instagram: setting(data, "instagram", site.social.instagram),
      x: setting(data, "x", site.social.x),
      yelp: setting(data, "yelp", site.social.yelp),
    },
    timezone: setting(data, "timezone", site.timezone),
    calendarIds: {
      playingField: setting(data, "playingFieldCalendarId", "sluggers.ohio@gmail.com"),
      upstairs: setting(data, "upstairsCalendarId", "dfc83902467c36e1aa925eb56ba27cd29a1cd5c0900408bd498a1705e73462dc@group.calendar.google.com"),
    },
  };
}

export type ResolvedSluggersSite = Omit<
  typeof site,
  "name" | "description" | "phone" | "phoneHref" | "email" | "address" | "directionsUrl" | "mapEmbedUrl" | "social" | "timezone"
> & {
  name: string;
  description: string;
  phone: string;
  phoneHref: string;
  email: string;
  address: { line1: string; city: string; state: string; postalCode: string; full: string };
  directionsUrl: string;
  mapEmbedUrl: string;
  social: { facebook: string; instagram: string; x: string; yelp: string };
  timezone: string;
  calendarIds?: { playingField: string; upstairs: string };
};
