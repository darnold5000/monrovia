import { z } from "zod";

const phone = /^[\d\s().+-]{7,20}$/;

export const tournamentRegistrationSchema = z.object({
  tournamentId: z.string().trim().min(1).max(160),
  tournament: z.string().trim().min(1).max(160),
  registrationVariant: z.enum(["standard", "series"]).default("standard"),
  selectedTournaments: z.array(z.string().trim().min(1).max(160)).max(7).optional(),
  teamName: z.string().trim().min(1, "Team name is required").max(120),
  ageGroup: z.string().trim().min(1, "Age group is required").max(40),
  organization: z.string().trim().max(160).optional(),
  homeCityState: z.string().trim().min(1, "Home city / state is required").max(120),
  headCoachName: z.string().trim().min(1, "Head coach name is required").max(120),
  headCoachEmail: z.string().trim().email("Enter a valid head coach email").max(254),
  headCoachCell: z.string().trim().min(7).max(20).regex(phone, "Enter a valid head coach cell number"),
  alternateContactName: z.string().trim().max(120).optional(),
  alternateContactEmail: z.string().trim().email("Enter a valid alternate contact email").max(254).optional().or(z.literal("")),
  alternateContactCell: z.string().trim().max(20).regex(phone, "Enter a valid alternate contact cell number").optional().or(z.literal("")),
  specialRequests: z.string().trim().max(2000).optional(),
  company: z.string().optional(),
}).superRefine((payload, context) => {
  if (payload.registrationVariant === "series" && !payload.selectedTournaments?.length) {
    context.addIssue({
      code: "custom",
      path: ["selectedTournaments"],
      message: "Select at least one tournament",
    });
  }
});

export type TournamentRegistrationPayload = z.infer<typeof tournamentRegistrationSchema>;
