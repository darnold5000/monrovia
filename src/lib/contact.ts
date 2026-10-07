import { z } from "zod";

const phoneRegex = /^[\d\s().+-]{7,20}$/;

export const inquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(phoneRegex, "Enter a valid phone number"),
  whoIsTraining: z.enum(["myself", "my_child", "my_team", "other"]),
  primaryGoal: z.enum([
    "hitting",
    "pitching",
    "fielding",
    "player_development",
    "team_practice_facility_use",
    "tournament_question",
    "not_sure",
    "other",
  ]),
  preferredContact: z.enum(["call", "text", "email", "no_preference"]),
  preferredTimes: z.string().trim().max(500).optional(),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
  consent: z
    .boolean()
    .refine((v) => v === true, {
      message: "You must agree to be contacted about your inquiry",
    }),
  company: z.string().optional(),
  attribution: z
    .object({
      utmSource: z.string().nullable().optional(),
      utmMedium: z.string().nullable().optional(),
      utmCampaign: z.string().nullable().optional(),
      utmTerm: z.string().nullable().optional(),
      utmContent: z.string().nullable().optional(),
      landingPage: z.string().nullable().optional(),
      referrer: z.string().nullable().optional(),
      capturedAt: z.string().optional(),
    })
    .optional(),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;

export const goalLabels: Record<InquiryPayload["primaryGoal"], string> = {
  hitting: "Hitting",
  pitching: "Pitching",
  fielding: "Fielding",
  player_development: "Player development",
  team_practice_facility_use: "Team practice / facility use",
  tournament_question: "Tournament question",
  not_sure: "Not sure yet",
  other: "Other",
};

export const whoLabels: Record<InquiryPayload["whoIsTraining"], string> = {
  myself: "Myself",
  my_child: "My child",
  my_team: "My team",
  other: "Other",
};

export const contactLabels: Record<InquiryPayload["preferredContact"], string> = {
  text: "Text",
  call: "Call",
  email: "Email",
  no_preference: "No preference",
};
