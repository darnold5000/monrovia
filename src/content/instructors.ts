import { media } from "@/config/media";

export type Instructor = {
  id: string;
  name: string;
  photo: string;
  role: string;
  bio: string;
  phone: string;
  specialties: string[];
  sports: ("baseball" | "softball" | "fitness")[];
  active: boolean;
};

export const instructors: Instructor[] = [
  {
    id: "bill-amero",
    name: "Bill Amero",
    photo: media.coaches.billAmero,
    role: "Baseball & Softball Instructor",
    bio: "Baseball and softball instruction focused on player development, mechanics, and game-ready training.",
    phone: "330-549-6150",
    specialties: ["Hitting", "Pitching", "Player Development"],
    sports: ["baseball", "softball"],
    active: true,
  },
  {
    id: "tony-sarigianopolous",
    name: "Tony Sarigianopolous",
    photo: media.coaches.tonySarigianopolous,
    role: "Fitness / Athletic Development",
    bio: "Fitness and athletic development training to support baseball and softball athletes at Sluggers.",
    phone: "330-207-6269",
    specialties: ["Strength", "Conditioning", "Athletic Performance"],
    sports: ["fitness"],
    active: true,
  },
  {
    id: "victoria",
    name: "Victoria",
    photo: media.coaches.victoria,
    role: "Softball Instructor",
    bio: "Softball Instructor.",
    phone: "330-207-6269",
    specialties: ["Hitting", "Pitching", "Fielding", "Player Development"],
    sports: ["softball"],
    active: true,
  },
];

export type TrainingOffering = {
  id: string;
  title: string;
  description: string;
  sport: "baseball" | "softball";
  skill: string;
  instructorId: string;
  durationMinutes: number;
  priceCents: number;
  image: string;
  imagePosition?: string;
};

export const trainingOfferings: TrainingOffering[] = [
  {
    id: "baseball-hitting",
    title: "Baseball Hitting Lesson",
    description: "One-on-one hitting instruction focused on mechanics, timing, and game-ready practice.",
    sport: "baseball",
    skill: "Hitting",
    instructorId: "bill-amero",
    durationMinutes: 45,
    priceCents: 3500,
    image: media.training.baseballHitting,
  },
  {
    id: "baseball-pitching",
    title: "Baseball Pitching Lesson",
    description: "Pitching instruction built around mechanics, command, and player-specific development.",
    sport: "baseball",
    skill: "Pitching",
    instructorId: "bill-amero",
    durationMinutes: 60,
    priceCents: 4000,
    image: media.training.baseballPitching,
    imagePosition: "center 20%",
  },
  {
    id: "softball-hitting",
    title: "Softball Hitting Lesson",
    description: "Softball hitting development with individualized instruction and quality reps.",
    sport: "softball",
    skill: "Hitting",
    instructorId: "bill-amero",
    durationMinutes: 45,
    priceCents: 3500,
    image: media.training.softballHitting,
  },
  {
    id: "softball-pitching",
    title: "Softball Pitching Lesson",
    description: "Softball pitching instruction focused on mechanics and confidence in the circle.",
    sport: "softball",
    skill: "Pitching",
    instructorId: "bill-amero",
    durationMinutes: 60,
    priceCents: 4000,
    image: media.training.softballPitching,
    imagePosition: "center 25%",
  },
];

export const trainingCategories = {
  baseball: ["Hitting", "Pitching", "Fielding", "Player Development"],
  softball: ["Hitting", "Pitching", "Player Development"],
} as const;

export const technologyHighlights = [
  "Blast Motion",
  "Pocket Radar",
] as const;

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((instructor) => instructor.id === id);
}
