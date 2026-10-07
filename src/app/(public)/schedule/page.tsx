import { createMetadata } from "@/lib/seo";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { site } from "@/content/site";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export const metadata = createMetadata({
  title: "Schedule, Calendar & Locations",
  description:
    "Monrovia youth baseball and softball schedule, calendar, and field locations. View events on the official MOBS calendar.",
  path: "/schedule",
});

export default function SchedulePage() {
  return (
    <>
      <PageHero
        eyebrow="Games & fields"
        title="Schedule"
        description="The league calendar and field directory live on monroviaball.com. Use the links below for the official schedule, locations, and sync options."
      >
        <ExternalLinkButton href={monroviaExternal.calendar}>Open league calendar</ExternalLinkButton>
      </PageHero>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-3xl space-y-6 px-5 sm:px-8">
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-lg font-bold text-charcoal uppercase">League calendar</h2>
            <p className="mt-2 text-sm text-barn-muted">
              Practices, games, and league events are maintained in Stack Sports. The live site includes calendar sync
              instructions for Google Calendar and iCalendar.
            </p>
            <ExternalLinkButton href={monroviaExternal.calendar} className="mt-4" variant="secondary">
              View calendar on monroviaball.com
            </ExternalLinkButton>
          </div>
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-lg font-bold text-charcoal uppercase">Locations</h2>
            <p className="mt-2 text-sm text-barn-muted">
              Field names and addresses are listed in the league field directory on the calendar page. Recent evaluation
              notices referenced the Monrovia Aux Gym (enter door 5).
            </p>
            <p className="mt-4 text-sm font-semibold text-charcoal">League mailing address</p>
            <address className="mt-1 not-italic text-sm text-barn-muted">
              {site.address.line1}
              <br />
              {site.address.city}, {site.address.state} {site.address.postalCode}
            </address>
          </div>
        </div>
      </section>
    </>
  );
}
