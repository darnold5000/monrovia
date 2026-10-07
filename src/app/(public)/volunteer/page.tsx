import { createMetadata } from "@/lib/seo";
import { volunteerEmptyMessage } from "@/content/monrovia-data";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export const metadata = createMetadata({
  title: "Volunteer Opportunities",
  description: "Volunteer with Monrovia Organized Baseball & Softball youth baseball and softball.",
  path: "/volunteer",
});

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Volunteer"
        description="Coaches, concessions, field work, and team volunteers are essential. MOBS lists volunteer opportunities on the league portal when programs are active."
      >
        <ExternalLinkButton href={monroviaExternal.volunteerListing}>Volunteer portal</ExternalLinkButton>
      </PageHero>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-3xl rounded-xl border border-barn-border bg-barn-white p-8 text-center px-5 sm:px-8">
          <p className="text-barn-muted">{volunteerEmptyMessage}</p>
          <ExternalLinkButton href={monroviaExternal.volunteerListing} className="mt-6">
            Open volunteer listing
          </ExternalLinkButton>
        </div>
      </section>
    </>
  );
}
