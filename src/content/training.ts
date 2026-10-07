export const trainingPhilosophy = {
  headline: "Develop Confidence. Consistency. Power.",
  description:
    "Private baseball and softball instruction built around individual player development.",
  highlights: [
    "One-on-one instruction",
    "Swing mechanics",
    "Bat-speed development",
    "Timing and rhythm",
    "Game-ready practice",
    "Player-specific development",
  ],
} as const;

export const credibilityItems = [
  "Baseball Training",
  "Softball Training",
  "Facility Rentals",
  "Tournaments",
] as const;

export const audienceSegments = [
  "Youth baseball and softball players",
  "Travel and school teams",
  "Coaches booking team practice",
  "Parents seeking private instruction",
] as const;

export type TrainingArea = {
  id: string;
  title: string;
  summary: string;
};

export function getTrainingAreaBookHref(areaId: string): string {
  if (areaId === "baseball" || areaId === "softball") {
    return `/availability?calendar=upstairs&service=${areaId === "baseball" ? "baseball-lesson" : "softball-lesson"}`;
  }
  return `/availability?calendar=upstairs&service=small-group-training`;
}

export const trainingAreasList: TrainingArea[] = [
  {
    id: "hitting",
    title: "Hitting Instruction",
    summary: "Baseball and softball hitting development with individualized coaching.",
  },
  {
    id: "pitching",
    title: "Pitching Instruction",
    summary: "Mechanics, command, and confidence for baseball and softball pitchers.",
  },
  {
    id: "baseball",
    title: "Baseball Training",
    summary: "Hitting, pitching, fielding, and player development for baseball athletes.",
  },
  {
    id: "softball",
    title: "Softball Training",
    summary: "Hitting, pitching, and player development for softball athletes.",
  },
];

/** @deprecated Legacy home component export — use trainingAreasList on new pages */
export const trainingAreas = trainingAreasList;

export const trainingSkillCategories = {
  baseball: ["Hitting", "Pitching", "Fielding", "Player Development"],
  softball: ["Hitting", "Pitching", "Player Development"],
} as const;

export const trainingProcess = [
  "Choose training",
  "Select instructor",
  "Pick a time",
  "Request a time",
] as const;
