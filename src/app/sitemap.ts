import type { MetadataRoute } from "next";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/programs",
    "/teams",
    "/tryouts",
    "/schedule",
    "/sponsors",
    "/about",
    "/about/board",
    "/volunteer",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((path) => ({
    url: absoluteSiteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
