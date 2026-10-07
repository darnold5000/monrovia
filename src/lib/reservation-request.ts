import { z } from "zod";

const phoneRegex = /^[\d\s().+-]{7,20}$/;

export const reservationRequestSchema = z.object({
  serviceType: z.enum([
    "team-practice",
    "playing-field-rental",
    "upstairs-hitting-lane",
    "baseball-lesson",
    "softball-lesson",
    "small-group-training",
    "other",
  ]),
  otherDetails: z.string().trim().max(500).optional(),
  preferredDate: z.string().trim().min(1, "Preferred date is required").max(40),
  preferredTime: z.string().trim().max(100).optional(),
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20).regex(phoneRegex, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address").max(254),
  teamInfo: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  consent: z.boolean().refine((value) => value === true, { message: "You must agree to be contacted about your request" }),
  company: z.string().optional(),
});

export type ReservationRequestPayload = z.infer<typeof reservationRequestSchema>;

export const reservationServiceLabels: Record<ReservationRequestPayload["serviceType"], string> = {
  "team-practice": "Team Baseball / Softball Practice",
  "playing-field-rental": "Playing Field Rental",
  "upstairs-hitting-lane": "Upstairs Hitting Lane",
  "baseball-lesson": "Baseball Lesson",
  "softball-lesson": "Softball Lesson",
  "small-group-training": "Small Group Training",
  other: "Other",
};
