import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { facilityFeatures, facilitySections, facilityStats } from "@/content/facility";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";
import { createMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { getPublicContentState } from "@/lib/sluggers-cms";

export const metadata = createMetadata({
  title: "Facility",
  description: "Explore Sluggers indoor baseball and softball training facility in Poland, Ohio.",
  path: "/facility",
});

function isPlaceholderImage(src: string): boolean {
  return src.includes("/logo.png");
}

export default async function FacilityPage() {
  const [sectionState, statState] = await Promise.all([
    getPublicContentState("facility_section"),
    getPublicContentState("facility_stat"),
  ]);
  const publicSections = sectionState.cmsManaged
    ? sectionState.published.map((item) => ({
        id: item.id,
        title: item.title,
        description: String(item.data.description ?? ""),
        images: [String(item.data.imageUrl ?? ""), String(item.data.secondaryImageUrl ?? "")].filter(Boolean),
      }))
    : facilitySections;
  const publicStats = statState.cmsManaged
    ? statState.published.map((item) => ({
        label: String(item.data.label ?? item.title),
        value: String(item.data.value ?? ""),
        highlight: item.sort_order === 1,
      }))
    : facilityStats;
  return (
    <div className="page-interior">
      <section className="interior-hero">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Facility</p>
          <h1 className="interior-heading mt-3 max-w-4xl">
            Built for Baseball & Softball Development
          </h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {publicStats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-sm border px-4 py-3",
                    "highlight" in stat && stat.highlight
                    ? "border-barn-green bg-barn-green text-barn-cream"
                    : "border-barn-border bg-white text-barn-navy",
                )}
              >
                <p
                  className={cn(
                    "font-display text-sm font-bold tracking-[0.12em] uppercase sm:text-base",
                    "highlight" in stat && stat.highlight ? "text-gold" : "text-barn-navy",
                  )}
                >
                  {"value" in stat && stat.value ? `${stat.label}: ${stat.value}` : stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="interior-section border-t border-barn-border">
        <div className="mx-auto max-w-7xl space-y-10 lg:space-y-12">
          {publicSections.map((section, index) => (
            <div
              key={section.id}
              className={cn(
                "grid items-center gap-6 lg:grid-cols-2 lg:gap-8",
                index % 2 === 1 && "lg:[&>*:first-child]:order-2",
              )}
            >
              <div>
                <h2 className="interior-subheading">{section.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-barn-muted sm:text-base">{section.description}</p>
              </div>
              {!section.images.length || section.images.every(isPlaceholderImage) ? (
                <MediaPlaceholder alt={section.title} size="md" />
              ) : section.images.length > 1 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.images.map((src) =>
                    isPlaceholderImage(src) ? (
                      <MediaPlaceholder key={src} alt={section.title} size="md" />
                    ) : (
                      <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-sm border border-barn-border bg-barn-cream">
                        <Image
                          src={src}
                          alt={section.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 25vw"
                        />
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-barn-border bg-barn-cream">
                  <Image
                    src={section.images[0]}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-barn-border pt-8 lg:pt-10">
            <h2 className="interior-subheading">Equipment / Amenities</h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {facilityFeatures.map((feature) => (
                <li key={feature} className="flex gap-2.5 text-sm text-barn-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="interior-cta bg-obsidian">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <h2 className="font-display text-3xl font-black uppercase text-barn-cream sm:text-4xl">
            Explore facility availability
          </h2>
          <Link
            href="/availability?calendar=field"
            className="bg-gold px-6 py-3 text-sm font-bold tracking-[.14em] text-obsidian uppercase"
          >
            Check Availability <ArrowUpRight className="ml-1 inline size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
