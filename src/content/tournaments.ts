import { media } from "@/config/media";

export type Tournament = {
  id: string;
  name: string;
  dates: string;
  dateStart: string;
  location: string;
  locations?: string[];
  city: string;
  state: string;
  ageGroups: string;
  registrationFeeCents: number;
  registrationFeeLabel: string;
  gameGuarantee?: string;
  registrationStatus: "open" | "closing-soon" | "sold-out";
  details: string;
  poster: string;
  registrationForm: string;
  registrationVariant?: "standard" | "series";
  registrationFormDownload?: string;
  featured?: boolean;
};

export const tournaments: Tournament[] = [
  {
    id: "hydrocephalus-fundraiser-2026",
    name: "Hydrocephalus Fundraiser Softball Tournament",
    dates: "September 26–27, 2026",
    dateStart: "2026-09-26",
    location: "Springfield High School",
    city: "New Middletown",
    state: "Ohio",
    ageGroups: "8U through High School",
    registrationFeeCents: 44000,
    registrationFeeLabel: "$440",
    registrationStatus: "open",
    details: "Fundraiser tournament with proceeds supporting the Hydrocephalus Association.",
    poster: media.tournaments.hydrocephalusFundraiser,
    registrationForm: "/documents/sluggers-fall-tournaments-2026-registration-form.pdf",
    featured: true,
  },
  {
    id: "fall-brawl-2026",
    name: "Sluggers Fall Brawl",
    dates: "October 17–18, 2026",
    dateStart: "2026-10-17",
    location: "Springfield High School",
    city: "New Middletown",
    state: "Ohio",
    ageGroups: "8U through High School",
    registrationFeeCents: 45000,
    registrationFeeLabel: "$450",
    gameGuarantee: "4-game guarantee",
    registrationStatus: "open",
    details: "Season-ending fall classic for travel and school teams across Northeast Ohio.",
    poster: media.tournaments.fallBrawl,
    registrationForm: "/documents/sluggers-fall-tournaments-2026-registration-form.pdf",
    featured: true,
  },
  {
    id: "sluggers-softball-tournament-series-2027",
    name: "2027 Sluggers Softball Tournament Series",
    dates: "April 30–July 5, 2027",
    dateStart: "2027-04-30",
    location: "Multiple Northeast Ohio locations",
    locations: [
      "Springfield High School, New Middletown, Ohio",
      "Fields of Dreams, Boardman, Ohio",
      "McCune Fields, Canfield, Ohio",
    ],
    city: "Springfield, Boardman & Canfield",
    state: "Ohio",
    ageGroups: "8U–14U; select 16U & 18U divisions",
    registrationFeeCents: 49500,
    registrationFeeLabel: "$495",
    gameGuarantee: "Seven tournament dates with multi-tournament discounts",
    registrationStatus: "open",
    details: "Choose from May Madness, Spring Fling, Stars & Stripes Classic, June Sluggfest, Father’s Day Battle, June Rumble, and Firecracker Frenzy.",
    poster: media.tournaments.softballTournamentSeries2027,
    registrationForm: "/documents/2027-sluggers-softball-tournament-series-registration.pdf",
    registrationFormDownload: "2027-sluggers-softball-tournament-series-registration.pdf",
    registrationVariant: "series",
  },
];

export const multiTournamentDiscount = {
  headline: "The More You Play, The More You Save",
  description:
    "Register for multiple tournaments, and your discount increases with each tournament entered. The first tournament entered is at regular price of $495. Then, the cost for each additional tournament entered is discounted. The more tournaments you enter, the bigger the discount! Teams participating in all six of our qualifying tournaments can save as much as $620 - more than the cost of one tournament!",
  note: "This only applies to our first six tournaments listed. Our special Firecracker Frenzy on July 3-5 is an 8-game guarantee event and is priced separately at $990.",
} as const;

export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find((t) => t.id === id);
}

export function getFeaturedTournaments(): Tournament[] {
  return tournaments.filter((t) => t.featured);
}
