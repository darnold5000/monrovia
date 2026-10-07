import { site } from "@/content/site";
import { TrackedLink } from "@/components/public/tracked-link";
import { cn } from "@/lib/utils";

export function HomeLocation({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={cn(
        "mx-auto max-w-6xl border-t border-barn-border",
        compact ? "interior-section-tight" : "section-pad",
      )}
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="eyebrow">Location</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.06em] text-barn-navy uppercase sm:text-3xl">
            Visit Sluggers in Poland, Ohio
          </h2>
          <div className="gold-divider my-4 max-w-xs" />
          <address className="not-italic text-barn-muted">
            <p className="text-base text-barn-navy sm:text-lg">{site.address.line1}</p>
            <p>
              {site.address.city}, {site.address.state} {site.address.postalCode}
            </p>
          </address>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href={site.phoneHref}
              event="phone_click"
              properties={{ location: "location" }}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-sm border border-barn-green px-6 py-3 text-sm font-semibold text-barn-green hover:bg-barn-green hover:text-barn-cream"
            >
              {site.phone}
            </TrackedLink>
            <TrackedLink
              href={site.directionsUrl}
              event="directions_click"
              properties={{ location: "location" }}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-sm bg-gold px-6 py-3 text-sm font-semibold text-obsidian"
              external
            >
              Get Directions
            </TrackedLink>
          </div>
        </div>
        <div className="overflow-hidden rounded-sm border border-barn-border">
          <iframe
            title={`Map showing ${site.name} at ${site.address.full}`}
            src={site.mapEmbedUrl}
            className="h-64 w-full grayscale-[30%] contrast-[1.05] sm:h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
