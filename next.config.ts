import type { NextConfig } from "next";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
  images: {
    dangerouslyAllowSVG: false,
  },
  async redirects() {
    return [
      { source: "/facility", destination: "/schedule", permanent: false },
      { source: "/training", destination: "/programs", permanent: false },
      { source: "/staff", destination: "/teams", permanent: false },
      { source: "/travel-teams", destination: "/teams", permanent: false },
      { source: "/our-staff", destination: "/about/board", permanent: false },
      { source: "/tournaments", destination: "/schedule", permanent: false },
      { source: "/availability", destination: "/schedule", permanent: false },
      { source: "/gallery", destination: "/", permanent: false },
      { source: "/instructors", destination: "/", permanent: false },
      { source: "/packages", destination: "/programs", permanent: false },
      { source: "/packages/success", destination: "/programs", permanent: false },
      { source: "/team-rentals", destination: "/schedule", permanent: false },
      { source: "/results", destination: "/", permanent: false },
      { source: "/book", destination: "/register", permanent: false },
      { source: "/birthday-parties", destination: "/", permanent: false },
      { source: "/portal/book", destination: "/register", permanent: false },
      { source: "/portal/book-training", destination: "/programs", permanent: false },
      { source: "/portal/book-pt", destination: "/programs", permanent: false },
      { source: "/admin", destination: "/login", permanent: false },
    ];
  },
  async headers() {
    if (allowIndexing) return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
