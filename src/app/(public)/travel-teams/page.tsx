import { ProfilePlaceholderGrid } from "@/components/public/profile-placeholder-grid";
import { createMetadata } from "@/lib/seo";
import { getPublicContentState } from "@/lib/sluggers-cms";
import { compareProfileContentItems } from "@/lib/sluggers-profile-order";

export const metadata = createMetadata({
  title: "Sluggers Travel Teams",
  description: "Meet the coaches leading Sluggers travel baseball and softball teams in Poland, Ohio.",
  path: "/travel-teams",
});

export default async function TravelTeamsPage() {
  const state = await getPublicContentState("travel_team_coach");
  const coaches = [...state.published].sort(compareProfileContentItems).map((item) => ({
    id: item.id,
    name: item.title,
    photoUrl: String(item.data.photoUrl ?? ""),
    teamName: String(item.data.teamName ?? ""),
    email: String(item.data.email ?? ""),
    phone: String(item.data.phone ?? ""),
  }));

  return (
    <div className="page-interior">
      <section className="interior-hero border-b border-barn-border pb-7 sm:pb-8 lg:pb-9">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Sluggers Travel Teams</p>
          <h1 className="interior-heading mt-2">Meet our travel team coaches</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-barn-muted sm:text-base">
            Sluggers is proud to sponsor several boys’ and girls’ travel teams for the 2026–2027 season. We would like to thank our Sluggers coaches for their hard work and dedication.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <ProfilePlaceholderGrid
            count={6}
            columns={3}
            profileLabel="Travel team coach"
            description="Coach information and team details coming soon."
            profiles={coaches}
          />
        </div>
      </section>
    </div>
  );
}
