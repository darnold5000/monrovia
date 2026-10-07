import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (site.allowIndexing) {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: absoluteSiteUrl("/sitemap.xml"),
    };
  }
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
