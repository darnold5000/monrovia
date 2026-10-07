export type Program = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "demo" | "coming-soon";
  dates?: string;
};

export const programs: Program[] = [
  {
    id: "demo-camp",
    title: "Sample Skills Camp",
    description:
      "Demo placeholder for future camps and clinics. Sluggers can publish seasonal programs here when ready.",
    category: "Camp",
    status: "demo",
    dates: "Dates TBD",
  },
  {
    id: "team-events",
    title: "Team Events & Clinics",
    description:
      "Architecture supports team events, specialty training, birthday parties, leagues, and seasonal programming.",
    category: "Events",
    status: "coming-soon",
  },
];

export const programCategories = [
  "Camps",
  "Clinics",
  "Birthday Parties",
  "Team Events",
  "Leagues",
  "Specialty Training",
  "Seasonal Programs",
] as const;
