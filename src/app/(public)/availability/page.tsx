import { createMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSluggersCalendar, type SluggersCalendarId } from "@/content/sluggers-links";
import { AvailabilityClient } from "@/components/public/availability-client";
import { sluggersLinks } from "@/content/sluggers-links";
import { resolveSluggersSiteSettings } from "@/lib/sluggers-site";

export const metadata = createMetadata({
  title: "Availability",
  description: "View the current Sluggers Playing Field and Upstairs Hitting Lane schedules, then send a reservation request.",
  path: "/availability",
});

export default async function AvailabilityPage({ searchParams }: { searchParams: Promise<{ calendar?: string; service?: string }> }) {
  const query = await searchParams;
  const siteConfig = await resolveSluggersSiteSettings();
  const calendar = getSluggersCalendar(query.calendar);
  const calendars = sluggersLinks.calendars.map((item) => ({
    ...item,
    googleCalendarId: item.id === "field" ? siteConfig.calendarIds?.playingField ?? item.googleCalendarId : siteConfig.calendarIds?.upstairs ?? item.googleCalendarId,
  }));
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Availability", path: "/availability" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <div className="page-interior">
        <section className="interior-hero mx-auto max-w-6xl">
          <p className="eyebrow">Availability</p>
          <h1 className="interior-heading mt-3">Check availability</h1>
          <p className="mt-4 max-w-2xl text-sm text-barn-muted sm:text-base">View the current Sluggers schedule, then send a reservation request for the time you need.</p>
          <p className="mt-3 max-w-2xl text-xs font-semibold text-barn-muted">Submitting a request does not automatically reserve the facility. Sluggers will confirm availability with you.</p>
          <AvailabilityClient calendars={calendars} timezone={siteConfig.timezone} initialCalendar={calendar.id as SluggersCalendarId} initialService={query.service} />
        </section>
      </div>
    </>
  );
}
