import { ArrowUpRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { sponsors } from "@/content/monrovia-data";
import { PageHero } from "@/components/public/page-hero";

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
        description="Local businesses help keep youth baseball and softball strong in Monrovia. Sponsor names and links are taken from the current league website."
      />

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((s) => (
              <li key={s.name}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex min-h-[5.5rem] items-center justify-between gap-3 rounded-lg border border-barn-border bg-barn-white px-5 py-4 font-semibold text-charcoal transition hover:border-mobs-green/40 hover:text-mobs-green"
                  >
                    <span>{s.name}</span>
                    <ArrowUpRight className="size-5 shrink-0 opacity-50" aria-hidden />
                  </a>
                ) : (
                  <div className="flex min-h-[5.5rem] items-center rounded-lg border border-barn-border bg-barn-white px-5 py-4 font-semibold text-charcoal">
                    {s.name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
