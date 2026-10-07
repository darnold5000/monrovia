import { describe, expect, it } from "vitest";
import { adminSections, publicPathsForSection } from "./sluggers-admin-sections";
import { contentTypes } from "./sluggers-cms";

describe("new profile admin sections", () => {
  it("configures travel team coach CRUD fields and public revalidation", () => {
    const section = adminSections["travel-teams"];

    expect(contentTypes).toContain("travel_team_coach");
    expect(section.type).toBe("travel_team_coach");
    expect(section.titleLabel).toBe("Coach Name");
    expect(section.fields.map((field) => field.key)).toEqual([
      "photoFile",
      "teamName",
      "email",
      "phone",
      "photoUrl",
    ]);
    expect(publicPathsForSection("travel-teams")).toEqual(["/travel-teams"]);
  });

  it("configures Our Staff CRUD fields and public revalidation", () => {
    const section = adminSections["our-staff"];

    expect(contentTypes).toContain("business_staff");
    expect(section.type).toBe("business_staff");
    expect(section.titleLabel).toBe("Staff Member Name");
    expect(section.fields.map((field) => field.key)).toEqual([
      "photoFile",
      "role",
      "photoUrl",
    ]);
    expect(publicPathsForSection("our-staff")).toEqual(["/our-staff"]);
  });
});
