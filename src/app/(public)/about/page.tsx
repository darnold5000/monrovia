import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { missionStatement } from "@/content/monrovia-data";
import { PageHero } from "@/components/public/page-hero";

export const metadata = createMetadata({
  title: "About MOBS",
  description:
    "About Monrovia Organized Baseball & Softball — youth baseball and softball in Monrovia, Indiana focused on sportsmanship, scholarship, and love of the game.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Monrovia community" title="About MOBS" />

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-lg leading-relaxed text-barn-muted">{missionStatement}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/about/board"
              className="focus-ring inline-flex min-h-11 items-center rounded-sm bg-mobs-green px-5 py-2.5 text-sm font-bold text-barn-cream uppercase"
            >
              Board of directors
            </Link>
            <Link
              href="/contact"
              className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-mobs-green/40 px-5 py-2.5 text-sm font-bold text-mobs-green uppercase"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
