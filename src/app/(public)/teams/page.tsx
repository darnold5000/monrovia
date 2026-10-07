import { createMetadata } from "@/lib/seo";
import { teamDivisions } from "@/content/monrovia-data";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";
import { monroviaExternal } from "@/lib/monrovia-urls";

export const metadata = createMetadata({
  title: "Teams & Divisions",
  description:
    "Find Monrovia youth baseball and softball teams and age divisions. MOBS organizes players by division — view teams and register when programs are open.",
  path: "/teams",
});

export default function TeamsPage() {
  const baseball = teamDivisions.filter((d) => d.sport === "Baseball");
  const softball = teamDivisions.filter((d) => d.sport === "Softball");

  return (
    <>
      <PageHero
        eyebrow="Where does my player belong?"
        title="Teams"
        description="Individual team rosters and coaches are managed through the league portal. Below are age divisions referenced in recent MOBS communications — not invented rosters."
      >
        <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
      </PageHero>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-2xl font-black text-charcoal uppercase">Baseball</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {baseball.map((d) => (
                <li
                  key={d.name}
                  className="rounded-md border border-barn-border bg-barn-cream/50 px-4 py-3 text-center font-display text-lg font-bold text-mobs-green"
                >
                  {d.name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-barn-muted">
              Divisions such as 6U, 8U, 10U, and 12U appeared in published evaluation notices. Confirm your player&apos;s
              division during registration.
            </p>
          </div>
          <div className="rounded-xl border border-barn-border bg-barn-white p-6">
            <h2 className="font-display text-2xl font-black text-charcoal uppercase">Softball</h2>
            <ul className="mt-4 space-y-3">
              {softball.map((d) => (
                <li key={d.name} className="rounded-md border border-barn-border px-4 py-3">
                  <p className="font-display font-bold text-charcoal">{d.name}</p>
                  {d.note ? <p className="mt-1 text-sm text-barn-muted">{d.note}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
