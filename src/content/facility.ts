import { media } from "@/config/media";

export type FacilitySpace = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  priceCents: number;
  demoPriceLabel: string;
};

export const facilitySpaces: FacilitySpace[] = [
  {
    id: "main-facility",
    title: "Main Turf",
    description:
      "Reserve the main indoor turf for team practices, hitting, pitching, scrimmages, and development.",
    durationMinutes: 60,
    priceCents: 6000,
    demoPriceLabel: "$60 demo",
  },
  {
    id: "upstairs-training",
    title: "Upstairs Training Area",
    description:
      "Smaller upstairs space suited for individual work, small groups, hitting stations, and pitching work.",
    durationMinutes: 60,
    priceCents: 4000,
    demoPriceLabel: "$40 demo",
  },
  {
    id: "full-facility",
    title: "Full Facility",
    description:
      "Reserve the entire facility for larger team practices, events, or full-team development sessions (demo placeholder).",
    durationMinutes: 60,
    priceCents: 9000,
    demoPriceLabel: "$90 demo",
  },
];

export const facilityFeatures = [
  "Indoor baseball and softball training space",
  "Team practices and scrimmages",
  "Hitting and pitching development",
  "Individual and small-group work",
  "Upstairs hitting and pitching area",
  "Batting tees, baseballs, and softballs",
  "Year-round indoor access",
] as const;

export const facilityStats = [
  { label: "9,000+ SQ FT TURF", highlight: true },
  { label: "BASEBALL & SOFTBALL" },
  { label: "SMALL-GROUP TRAINING" },
  { label: "TEAM PRACTICE & RENTALS" },
] as const;

export const facilitySections = [
  {
    id: "main",
    title: "Main Turf",
    description:
      "Sluggers supports team practices, hitting, pitching, scrimmages, individual work, and both baseball and softball development on the main turf.",
    images: [media.facility.main, media.facility.mainTurfWide] as const,
  },
  {
    id: "upstairs",
    title: "Upstairs Hitting / Pitching Area",
    description:
      "A dedicated upstairs training area suited for individual work, small groups, hitting stations, and pitching development.",
    images: [media.facility.upstairs, media.facility.upstairsTraining] as const,
  },
] as const;

export type FacilityAreaId = (typeof facilitySpaces)[number]["id"];

export function getFacilitySpaceById(id: string): FacilitySpace | undefined {
  return facilitySpaces.find((space) => space.id === id);
}

/** Areas blocked when a given area is booked (demo / future availability rules). */
export function getFacilityAreasBlockedByBooking(areaId: FacilityAreaId): FacilityAreaId[] {
  if (areaId === "full-facility") {
    return ["main-facility", "upstairs-training", "full-facility"];
  }
  return [areaId];
}
