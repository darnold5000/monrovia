import { createMetadata } from "@/lib/seo";
import { sponsors } from "@/content/monrovia-data";
import { PageHero } from "@/components/public/page-hero";
import { SponsorCard } from "@/components/public/sponsor-card";

export const metadata = createMetadata({
  title: "Sponsors",
  description:
    "Thank you to local sponsors supporting Monrovia Organized Baseball & Softball youth baseball and softball in Monrovia, Indiana.",
  path: "/sponsors",
});

export default function SponsorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Thank you"
        title="Our sponsors"
        description="Local businesses help keep youth baseball and softball strong in Monrovia. Logos and links are from the current league website."
      />

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <li key={s.name}>
                <SponsorCard sponsor={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
