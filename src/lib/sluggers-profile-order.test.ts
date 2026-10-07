import { describe, expect, it } from "vitest";
import type { ContentItem } from "./sluggers-cms";
import { compareProfileContentItems } from "./sluggers-profile-order";

function profile(title: string, sortOrder: number, contentType: ContentItem["content_type"] = "business_staff"): ContentItem {
  return {
    id: title,
    tenant_id: "tenant-id",
    content_type: contentType,
    slug: title.toLowerCase().replaceAll(" ", "-"),
    title,
    data: {},
    published: true,
    sort_order: sortOrder,
    created_at: "",
    updated_at: "",
  };
}

describe("profile ordering", () => {
  it("pins Bill Amero first and Eric Sweeney second on Our Staff", () => {
    const items = [
      profile("Mike Gerthung", 1),
      profile("Bill Amero", 4),
      profile("Jillian Bennett", 2),
      profile("Eric Sweeney", 5),
    ];

    expect(items.sort(compareProfileContentItems).map((item) => item.title)).toEqual([
      "Bill Amero",
      "Eric Sweeney",
      "Mike Gerthung",
      "Jillian Bennett",
    ]);
  });

  it("uses portal sort order for all other profiles", () => {
    const items = [
      profile("Coach Three", 3, "travel_team_coach"),
      profile("Coach One", 1, "travel_team_coach"),
      profile("Coach Two", 2, "travel_team_coach"),
    ];

    expect(items.sort(compareProfileContentItems).map((item) => item.title)).toEqual([
      "Coach One",
      "Coach Two",
      "Coach Three",
    ]);
  });
});
