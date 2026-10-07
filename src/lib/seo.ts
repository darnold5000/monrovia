import type { Metadata } from "next";
import { media } from "@/config/media";
import { site } from "@/content/site";
import { absoluteSiteUrl } from "@/lib/site-url";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

const allowIndexing = site.allowIndexing;

export function createMetadata({
  title,
  description,
  path = "",
  image = media.brand.og,
}: SEOProps): Metadata {
  const url = absoluteSiteUrl(path || "/");
  const imageUrl = absoluteSiteUrl(image);
  const fullTitle =
    path === "" || path === "/"
      ? `${site.name} | ${title}`
      : `${title} | ${site.name}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: allowIndexing
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export function sportsOrganizationSchema() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: site.name,
    description: site.description,
    url: site.url,
    ...(site.phone ? { telephone: site.phone } : {}),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.line1,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: "US",
    },
    sport: ["Baseball", "Softball"],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function organizationSchema() {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: absoluteSiteUrl(media.brand.logo),
    email: site.email,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  };
}
