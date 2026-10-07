import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { tryoutArchive, upcomingTryouts } from "@/content/monrovia-data";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { PageHero } from "@/components/public/page-hero";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export const metadata = createMetadata({
  title: "Tryouts & Evaluations",
  description:
    "Monrovia youth baseball tryout and evaluation dates, times, and locations. Register through the official MOBS portal when tryouts are announced.",
  path: "/tryouts",
});

export default function TryoutsPage() {
  const upcoming = upcomingTryouts();
  const past = tryoutArchive.filter((t) => !upcoming.some((u) => u.id === t.id));

  return (
    <>
      <PageHero
        eyebrow="Evaluations"
        title="Tryouts"
        description="Tryout and evaluation details are announced by MOBS on the league website and through registration. This page reflects published information only."
      >
        <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
        <Link
          href="/contact"
          className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-white/25 px-5 py-2.5 text-sm font-bold text-barn-cream uppercase"
        >
          Contact us
        </Link>
      </PageHero>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {upcoming.length === 0 ? (
            <div className="rounded-xl border border-barn-border bg-barn-white p-8 text-center">
              <h2 className="font-display text-xl font-black text-charcoal uppercase">Tryout information</h2>
              <p className="mt-4 text-barn-muted">
                Current tryout and evaluation dates will be posted here as they are announced.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
                <Link
                  href="/contact"
                  className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-mobs-green/40 px-5 py-2.5 text-sm font-bold text-mobs-green uppercase"
                >
                  Contact us
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {upcoming.map((t) => (
                <li key={t.id} className="rounded-xl border border-mobs-green/30 bg-barn-white p-6">
                  <p className="text-xs font-bold tracking-wide text-mobs-green uppercase">{t.sport}</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-charcoal">
                    {t.divisions} — {t.title}
                  </h2>
                  <dl className="mt-4 grid gap-2 text-sm text-barn-muted sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-charcoal">Date</dt>
                      <dd>{t.displayDate}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-charcoal">Time</dt>
                      <dd>{t.time}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-charcoal">Location</dt>
                      <dd>{t.location}</dd>
                    </div>
                  </dl>
                  <ExternalLinkButton href={monroviaExternal.register} className="mt-6">
                    Register
                  </ExternalLinkButton>
                </li>
              ))}
            </ul>
          )}

          {past.length > 0 ? (
            <details className="mt-10 rounded-xl border border-barn-border bg-barn-white p-6">
              <summary className="cursor-pointer font-display text-sm font-bold text-charcoal uppercase">
                Past evaluations (archive)
              </summary>
              <ul className="mt-4 space-y-4 border-t border-barn-border pt-4">
                {past.map((t) => (
                  <li key={t.id} className="text-sm text-barn-muted">
                    <span className="font-semibold text-charcoal">
                      {t.displayDate} — {t.divisions} {t.sport}
                    </span>
                    <br />
                    {t.time} · {t.location}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </section>
    </>
  );
}
