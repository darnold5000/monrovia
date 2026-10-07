import { ProfilePlaceholderGrid } from "@/components/public/profile-placeholder-grid";
import { createMetadata } from "@/lib/seo";
import { getPublicContentState } from "@/lib/sluggers-cms";
import { compareProfileContentItems } from "@/lib/sluggers-profile-order";

export const metadata = createMetadata({
  title: "Our Staff",
  description: "Meet the people behind Sluggers Indoor Baseball & Softball in Poland, Ohio.",
  path: "/our-staff",
});

export default async function OurStaffPage() {
  const state = await getPublicContentState("business_staff");
  const staff = [...state.published].sort(compareProfileContentItems).map((item) => ({
    id: item.id,
    name: item.title,
    photoUrl: String(item.data.photoUrl ?? ""),
    role: String(item.data.role ?? ""),
  }));

  return (
    <div className="page-interior">
      <section className="interior-hero border-b border-barn-border pb-7 sm:pb-8 lg:pb-9">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Our Staff</p>
          <h1 className="interior-heading mt-2">Meet the people behind Sluggers</h1>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <ProfilePlaceholderGrid
            count={4}
            columns={4}
            profileLabel="Staff member"
            description="Staff name and role information coming soon."
            profiles={staff}
          />
        </div>
      </section>
    </div>
  );
}
