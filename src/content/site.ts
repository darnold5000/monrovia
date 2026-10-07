import { media } from "@/config/media";
import { getSiteUrl } from "@/lib/site-url";
import { monroviaExternal } from "@/lib/monrovia-urls";

export const site = {
  name: "Monrovia Organized Baseball & Softball",
  shortName: "MOBS",
  tagline: "Youth baseball and softball for the Monrovia community.",
  motto: ["Sportsmanship.", "Scholarship.", "Love of the game."],
  description:
    "Monrovia Organized Baseball & Softball (MOBS) — youth baseball and softball in Monrovia, Indiana. Register for programs, find teams, and stay connected with league news and events.",
  url: getSiteUrl(),
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  phone: "",
  phoneHref: "",
  smsHref: "",
  email: "monroviabaseballsoftball@yahoo.com",
  address: {
    line1: "180 S Chestnut St",
    city: "Monrovia",
    state: "IN",
    postalCode: "46157",
    full: "180 S Chestnut St, Monrovia, IN 46157",
  },
  registerUrl: monroviaExternal.register,
  loginUrl: monroviaExternal.login,
  instagramUrl: null as string | null,
  facebookUrl: monroviaExternal.facebook,
  tiktokUrl: null as string | null,
  timezone: "America/Indiana/Indianapolis",
  mapEmbedUrl:
    "https://www.google.com/maps?q=180+S+Chestnut+St,+Monrovia,+IN+46157&output=embed",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=180+S+Chestnut+St,+Monrovia,+IN+46157",
  social: {
    facebook: monroviaExternal.facebook,
    instagram: "",
    x: "",
    yelp: "",
  },
  signalWorks: {
    name: "Signal Works Platform",
    url: "https://hiresignalworks.com",
    title: "Professional websites, software & AI solutions.",
  },
  owner: {
    displayName: "Monrovia Organized Baseball & Softball",
    title: "Youth Baseball & Softball League",
    credentials: ["Youth baseball", "Youth softball", "Community sports"],
    veteranOwned: false,
    biography: null as string | null,
    photo: media.brand.logo,
  },
  googleReview: { rating: 0, count: 0, quote: "" },
  demoMode: true,
} as const;
