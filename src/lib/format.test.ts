import { describe, expect, it } from "vitest";
import { formatTournamentDates } from "@/lib/format";

describe("formatTournamentDates", () => {
  it("formats a same-month tournament range", () => {
    expect(formatTournamentDates("2026-09-26", "2026-09-27")).toBe(
      "September 26–27, 2026",
    );
  });

  it("formats a same-month October tournament range", () => {
    expect(formatTournamentDates("2026-10-17", "2026-10-18")).toBe(
      "October 17–18, 2026",
    );
  });

  it("formats a range spanning different months", () => {
    expect(formatTournamentDates("2027-04-30", "2027-07-05")).toBe(
      "April 30–July 5, 2027",
    );
  });
});
