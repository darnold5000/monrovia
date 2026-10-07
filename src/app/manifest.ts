import type { MetadataRoute } from "next";
import { media } from "@/config/media";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f2a1a",
    theme_color: "#1a4d2e",
    icons: [
      {
        src: media.brand.favicon,
        sizes: "480x480",
        type: "image/jpeg",
      },
    ],
  };
}
