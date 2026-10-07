import { createMetadata } from "@/lib/seo";
import { programsEmptyMessage } from "@/content/monrovia-data";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export const metadata = createMetadata({
  title: "Programs & Registration",
  description:
    "Monrovia Indiana youth baseball and softball programs. View available divisions and register through the official MOBS registration portal.",
  path: "/programs",
});

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Play MOBS"
        title="Programs"
        description="Registration and program listings are managed on Monrovia's existing Stack Sports portal. When divisions open, register there — this page stays in sync with what the league publishes."
      >
        <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
        <ExternalLinkButton href={monroviaExternal.programsListing} variant="secondary">
          Live program listing
        </ExternalLinkButton>
      </PageHero>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="rounded-xl border border-barn-border bg-barn-white p-8 text-center shadow-sm">
            <p className="text-lg text-barn-muted">{programsEmptyMessage}</p>
            <p className="mt-4 text-sm text-barn-muted">
              Baseball and softball offerings appear here when the league opens registration. No checkout or sign-up is
              built into this demo site — you&apos;ll continue on monroviaball.com.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ExternalLinkButton href={monroviaExternal.register}>Register when open</ExternalLinkButton>
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
