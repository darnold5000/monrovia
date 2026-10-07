import { createMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact Monrovia Organized Baseball & Softball — youth baseball and softball in Monrovia, Indiana.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Contact" />

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:px-8 lg:grid-cols-2">
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-lg font-bold text-charcoal uppercase">{site.name}</h2>
            <address className="mt-4 not-italic text-sm leading-relaxed text-barn-muted">
              <p>{site.address.line1}</p>
              <p>
                {site.address.city}, {site.address.state} {site.address.postalCode}
              </p>
              <p className="mt-4">
                Email:{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-mobs-green hover:underline">
                  {site.email}
                </a>
              </p>
            </address>
            <a
              href={site.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-6 inline-flex min-h-11 items-center text-sm font-bold text-mobs-green uppercase hover:underline"
            >
              Get directions
            </a>
          </div>
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-lg font-bold text-charcoal uppercase">Connect</h2>
            <p className="mt-3 text-sm text-barn-muted">
              Follow MOBS on Facebook for updates. Registration and account questions are handled through the league
              portal.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalLinkButton href={monroviaExternal.facebook} variant="secondary">
                Facebook
              </ExternalLinkButton>
              <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
              <ExternalLinkButton href={monroviaExternal.login} variant="secondary">
                Login
              </ExternalLinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
