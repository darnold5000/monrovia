import { monroviaExternal } from "@/lib/monrovia-urls";

export const missionStatement =
  "The Monrovia Organized Baseball/Softball League will exist to inspire youth to practice the ideals of sportsmanship, scholarship, physical fitness, and passion for the game; to encourage adults to behave in an exemplary manner when supervising youth; and to keep the welfare of the youth foremost and free from any adult compulsion for power and glory. We will also strive to prepare the youth in our league for continued involvement in the Monrovia Baseball and Softball Programs.";

export type BoardMember = { role: string; name: string | null };

export const boardMembers: BoardMember[] = [
  { role: "League President", name: "Dana Robling" },
  { role: "League Vice President", name: "Brandon Griffee" },
  { role: "League Finance", name: "Erin Buttler" },
  { role: "League Secretary", name: "Sara Pieroni" },
  { role: "Director of Baseball", name: "Heather Grindstaff" },
  { role: "Director of Softball", name: null },
  { role: "Field Maintenance", name: "Adam Bobst" },
  { role: "Sponsorship / Fundraising", name: "Courtney Schumake & Jennifer Burkhardt" },
  { role: "Publicity Director", name: "Ashley Trimble" },
  { role: "Scheduling Director", name: "Filesha Romanelli" },
  { role: "Equipment Director", name: "Corbin Robling" },
  { role: "Concession Director", name: "Cassity Fisher" },
  { role: "Co-Concession", name: "Kaycee Everett" },
  { role: "Umpire Director", name: "Derek Emmons" },
  { role: "Tournament Director", name: "Sam McGlothlin" },
];

export type LeagueUpdate = {
  id: string;
  title: string;
  date: string;
  body: string;
  /** ISO date for sorting / upcoming checks */
  isoDate: string;
};

export const leagueUpdates: LeagueUpdate[] = [
  {
    id: "cleanup-2025",
    title: "Clean Up Day",
    date: "Mar 15, 2025",
    isoDate: "2025-03-15",
    body: "MOBS Clean Up Day — 8:00 AM",
  },
  {
    id: "eval-6u-10u-2025",
    title: "Baseball Evaluations — 6U & 10U",
    date: "Mar 1, 2025",
    isoDate: "2025-03-01",
    body: "4:00–6:00 PM at Monrovia Aux Gym. Enter door 5.",
  },
  {
    id: "eval-8u-12u-2025",
    title: "Baseball Evaluations — 8U & 12U",
    date: "Feb 28, 2025",
    isoDate: "2025-02-28",
    body: "6:00–8:00 PM at Monrovia Aux Gym. Enter door 5.",
  },
];

export type TryoutEvent = {
  id: string;
  title: string;
  sport: "Baseball" | "Softball";
  divisions: string;
  isoDate: string;
  displayDate: string;
  time: string;
  location: string;
  notes?: string;
};

export const tryoutArchive: TryoutEvent[] = [
  {
    id: "eval-6u-10u-2025",
    title: "Baseball Evaluations",
    sport: "Baseball",
    divisions: "6U & 10U",
    isoDate: "2025-03-01",
    displayDate: "Saturday, Mar 1, 2025",
    time: "4:00–6:00 PM",
    location: "Monrovia Aux Gym — enter door 5",
  },
  {
    id: "eval-8u-12u-2025",
    title: "Baseball Evaluations",
    sport: "Baseball",
    divisions: "8U & 12U",
    isoDate: "2025-02-28",
    displayDate: "Friday, Feb 28, 2025",
    time: "6:00–8:00 PM",
    location: "Monrovia Aux Gym — enter door 5",
  },
];

export type TeamDivision = {
  sport: "Baseball" | "Softball";
  name: string;
  note?: string;
};

/** Divisions referenced in published evaluation notices — not a full roster. */
export const teamDivisions: TeamDivision[] = [
  { sport: "Baseball", name: "6U" },
  { sport: "Baseball", name: "8U" },
  { sport: "Baseball", name: "10U" },
  { sport: "Baseball", name: "12U" },
  {
    sport: "Softball",
    name: "League divisions",
    note: "Softball division details are posted through registration when programs open.",
  },
];

export type Sponsor = { name: string; href: string | null; logo?: string | null };

export const sponsors: Sponsor[] = [
  { name: "Temple Rents", href: "https://www.templerents.com/", logo: "/images/sponsors/temple-rents.png" },
  { name: "I-70 Wrecker", href: "http://www.i70wrecker.com", logo: "/images/sponsors/i70-wrecker.png" },
  { name: "Subway", href: "http://order.subway.com", logo: "/images/sponsors/subway.png" },
  {
    name: "Sherri Walstrom — Carpenter Realtors",
    href: "http://SherriWalstrom.callcarpenter.com",
    logo: "/images/sponsors/sherri-walstrom.png",
  },
  { name: "Skyline Roofing", href: "https://www.skylineroofing.net/", logo: "/images/sponsors/skyline-roofing.png" },
  { name: "Ted Everett", href: "https://www.tedeverett.com/", logo: "/images/sponsors/ted-everett.png" },
  { name: "Johnson Melloh", href: "https://johnsonmelloh.com/", logo: "/images/sponsors/johnson-melloh.png" },
  {
    name: "Skin Tonics Spa & Wax",
    href: "https://skintonics-spawax.square.site/",
    logo: "/images/sponsors/skin-tonics.png",
  },
  {
    name: "Greg Hubler Chevrolet",
    href: "http://www.greghublerchevy.com/",
    logo: "/images/sponsors/greghubler-chevy.png",
  },
  { name: "Big O Tires", href: "https://www.bigotires.com", logo: "/images/sponsors/big-o-tires.png" },
  {
    name: "Community Cars Ford",
    href: "https://www.communitycars.com/ford/home?utm_source=googlemybusiness&utm_medium=organic",
    logo: "/images/sponsors/community-cars.png",
  },
  {
    name: "McClain Matthews Insurance",
    href: "https://www.mcclainmatthewsinsurance.com/",
    logo: "/images/sponsors/mcclain-matthews.png",
  },
  { name: "JDS Builds", href: "https://www.jdsbuilds.com/", logo: "/images/sponsors/jds-builds.png" },
  { name: "Edward Jones", href: "https://www.edwardjones.com/us-en", logo: "/images/sponsors/edward-jones.png" },
  {
    name: "Summers Plumbing Heating & Cooling",
    href: "https://www.summersphc.com/",
    logo: "/images/sponsors/summers-phc.png",
  },
  { name: "Naylor's Auto", href: "https://www.naylorsauto.com/", logo: "/images/sponsors/naylors-auto.png" },
  {
    name: "Forest Commodities",
    href: "https://forestcommodities.com/",
    logo: "/images/sponsors/forest-commodities.png",
  },
  { name: "Nucor", href: null, logo: null },
];

export const programsEmptyMessage =
  "There are no programs or divisions available at the moment. Please contact your club administrator with any questions.";

export const volunteerEmptyMessage =
  "There are no programs available at the moment. Please contact your club administrator with any questions.";

export const quickLinks = [
  { label: "Register", href: monroviaExternal.register, external: true },
  { label: "Login", href: monroviaExternal.login, external: true },
  { label: "Available Programs", href: monroviaExternal.programsListing, external: true },
  { label: "Volunteer", href: "/volunteer", external: false },
  { label: "Locations & Calendar", href: "/schedule", external: false },
  { label: "Umpires", href: monroviaExternal.umpireSignals, external: true },
  { label: "West Central Baseball", href: monroviaExternal.westCentralBaseball, external: true },
  { label: "Team Store", href: monroviaExternal.apparel, external: true },
] as const;

export function isUpcoming(isoDate: string, today = new Date()): boolean {
  const d = new Date(`${isoDate}T23:59:59`);
  if (Number.isNaN(d.valueOf())) return false;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return d >= start;
}

export function upcomingTryouts(today = new Date()) {
  return tryoutArchive.filter((t) => isUpcoming(t.isoDate, today));
}

export function pastUpdates(today = new Date()) {
  return leagueUpdates.filter((u) => !isUpcoming(u.isoDate, today));
}

export function upcomingUpdates(today = new Date()) {
  return leagueUpdates.filter((u) => isUpcoming(u.isoDate, today));
}
