/** Demo operational data for Sluggers admin dashboard preview. */

export const todayAtSluggers = [
  { time: "4:00 PM", type: "Facility Rental", detail: "Main Turf · Team Practice" },
  { time: "4:30 PM", type: "Hitting Lesson", detail: "Baseball Hitting" },
  { time: "5:00 PM", type: "Pitching Lesson", detail: "Softball Pitching" },
  { time: "6:00 PM", type: "Facility Rental", detail: "Main Turf · Individual / Small Group" },
] as const;

export const upcomingTournamentStats = [
  { name: "Sluggers Fall Brawl", registeredTeams: 27, openDivisions: 3 },
  { name: "Hydrocephalus Fundraiser", registeredTeams: 20, openDivisions: 4 },
] as const;

export const facilityUtilization = {
  today: "75% booked",
  thisWeek: "68% booked",
} as const;

export const paymentSummary = {
  today: "$840",
  thisWeek: "$3,240",
  upcoming: "$1,890",
} as const;
