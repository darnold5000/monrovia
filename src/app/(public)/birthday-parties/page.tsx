import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BirthdayPartyGallery } from "@/components/public/birthday-party-gallery";
import { TrackedLink } from "@/components/public/tracked-link";
import { birthdayPartyPhotos } from "@/content/birthday-parties";
import { createMetadata } from "@/lib/seo";
import { resolveSluggersSiteSettings } from "@/lib/sluggers-site";

const pageTitle = "Birthday Parties | Sluggers Poland Ohio";

const baseMetadata = createMetadata({
  title: "Birthday Parties",
  description:
    "Host your child's birthday party at Sluggers in Poland, Ohio. Celebrate with friends in our indoor sports facility. Contact us to plan your party.",
  path: "/birthday-parties",
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: pageTitle,
  openGraph: baseMetadata.openGraph
    ? { ...baseMetadata.openGraph, title: pageTitle }
    : undefined,
  twitter: baseMetadata.twitter ? { ...baseMetadata.twitter, title: pageTitle } : undefined,
};

export default async function BirthdayPartiesPage() {
  const siteConfig = await resolveSluggersSiteSettings();

  return (
    <div className="page-interior">
      <section className="interior-hero">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Birthday Parties</p>
          <h1 className="interior-heading mt-3 max-w-3xl">Celebrate at Sluggers</h1>
          <p className="mt-4 max-w-2xl text-sm text-barn-muted sm:text-base">
            Host your child&apos;s next birthday at our indoor sports facility in Poland, Ohio. Kids can play on the
            turf, enjoy party space for food and cake, and celebrate with friends in a fun, active setting.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/contact" className="bg-gold px-7 py-4 text-sm font-bold tracking-[.14em] text-obsidian uppercase hover:bg-gold/90">
              Plan a Party
            </Link>
            {siteConfig.phone && siteConfig.phoneHref ? (
              <p className="text-sm text-barn-muted">
                Or call{" "}
                <TrackedLink
                  href={siteConfig.phoneHref}
                  event="phone_click"
                  properties={{ location: "birthday_parties_hero" }}
                  className="font-semibold text-barn-green hover:text-barn-navy"
                >
                  {siteConfig.phone}
                </TrackedLink>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="interior-section border-t border-barn-border">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Party photos</p>
          <h2 className="interior-subheading mt-3 max-w-2xl">Real celebrations at Sluggers</h2>
          <p className="mt-3 max-w-2xl text-sm text-barn-muted sm:text-base">
            From whiffle ball and kickball to dodgeball, football, and more, Sluggers&apos; turf field is ready for your
            favorite indoor games. Celebrate your next birthday with room to play, laugh, and make memories!
          </p>
          <div className="mt-10">
            <BirthdayPartyGallery photos={birthdayPartyPhotos} />
          </div>
        </div>
      </section>

      <section className="interior-cta bg-obsidian">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-black uppercase text-barn-cream sm:text-4xl">
              Ready to plan the party?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-stone sm:text-base">
              Contact Sluggers to check dates, talk through your group size, and reserve party time at the facility.
            </p>
            {siteConfig.phone ? (
              <p className="mt-4 text-sm text-stone">
                Call{" "}
                {siteConfig.phoneHref ? (
                  <TrackedLink
                    href={siteConfig.phoneHref}
                    event="phone_click"
                    properties={{ location: "birthday_parties_footer" }}
                    className="font-semibold text-gold hover:text-barn-cream"
                  >
                    {siteConfig.phone}
                  </TrackedLink>
                ) : (
                  siteConfig.phone
                )}
              </p>
            ) : null}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-gold px-6 py-3 text-sm font-bold tracking-[0.14em] text-obsidian uppercase hover:bg-gold/90"
          >
            Contact Us <ArrowUpRight className="ml-1 size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
