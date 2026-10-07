/** External links for the standalone Sluggers demo site. */
export type SluggersCalendar = {
  id: "field" | "upstairs";
  name: string;
  googleCalendarId: string;
  description: string;
  defaultService: string;
};

export const sluggersLinks = {
  registrationForm: "/documents/sluggers-fall-tournaments-2026-registration-form.pdf",
  playingRules8U: "/documents/2027-playing-rules-8u.pdf",
  tournamentRules: "/documents/2027-playing-rules-70-minutes.pdf",
  playerAgeChart: "/documents/2027-player-age-chart.pdf",
  calendars: [
    {
      id: "field",
      name: "Playing Field",
      googleCalendarId: "sluggers.ohio@gmail.com",
      description: "Check the Playing Field schedule for practices, lessons, facility use, and existing reservations.",
      defaultService: "playing-field-rental",
    },
    {
      id: "upstairs",
      name: "Upstairs Hitting Lane",
      googleCalendarId: "dfc83902467c36e1aa925eb56ba27cd29a1cd5c0900408bd498a1705e73462dc@group.calendar.google.com",
      description: "Check availability for the upstairs area used for hitting, pitching, lessons, and small-group training.",
      defaultService: "upstairs-hitting-lane",
    },
  ],
  timezone: "America/New_York",
} as const;

export type SluggersCalendarId = (typeof sluggersLinks.calendars)[number]["id"];

export function getSluggersCalendar(id: string | null | undefined) {
  return sluggersLinks.calendars.find((calendar) => calendar.id === id) ?? sluggersLinks.calendars[0];
}

export function googleCalendarEmbedUrl(calendarId: string, timezone: string = sluggersLinks.timezone): string {
  const params = new URLSearchParams({
    src: calendarId,
    ctz: timezone,
    mode: "MONTH",
    showTitle: "0",
    showPrint: "0",
    showTabs: "0",
    showCalendars: "0",
    showTz: "0",
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}
