import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { media } from "@/config/media";
import { site } from "@/content/site";
import {
  missionStatement,
  pastUpdates,
  programsEmptyMessage,
  quickLinks,
  sponsors,
  upcomingTryouts,
  upcomingUpdates,
} from "@/content/monrovia-data";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { ExternalLinkButton } from "@/components/public/external-link-button";

export default function HomePage() {
  const activeTryouts = upcomingTryouts();
  const upcoming = upcomingUpdates();
  const archive = pastUpdates();

  return (
    <>
      <section className="border-b border-white/10 bg-charcoal pt-24 sm:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pb-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-softball-yellow">Monrovia, Indiana · Youth League</p>
            <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.9] text-barn-cream sm:text-6xl lg:text-7xl">
              Monrovia
              <span className="mt-1 block text-mobs-green sm:text-barn-cream">Baseball & Softball</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ExternalLinkButton href={monroviaExternal.register}>Register</ExternalLinkButton>
              <Link
                href="/teams"
                className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-white/25 px-5 py-2.5 text-sm font-bold tracking-wide text-barn-cream uppercase hover:border-softball-yellow/60 hover:text-softball-yellow"
              >
                View Teams
              </Link>
              <ExternalLinkButton href={monroviaExternal.login} variant="ghost" className="min-h-0 px-2 py-1 normal-case">
                Login to your account
              </ExternalLinkButton>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative w-full max-w-md">
              <div
                className="absolute -inset-4 rounded-2xl bg-mobs-green/30 blur-2xl"
                aria-hidden
              />
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-mobs-green/40 via-charcoal to-obsidian p-8 sm:p-10">
                <Image
                  src={media.brand.logo}
                  alt={site.name}
                  width={480}
                  height={480}
                  priority
                  className="mx-auto h-auto w-full max-w-[320px] object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeTryouts[0] ? (
        <section className="border-b border-softball-yellow/30 bg-mobs-green/20">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-softball-yellow uppercase">Upcoming tryouts</p>
              <p className="mt-1 font-display text-xl font-bold text-barn-cream uppercase">
                {activeTryouts[0].divisions} {activeTryouts[0].sport} — {activeTryouts[0].title}
              </p>
              <p className="mt-1 text-sm text-stone">
                {activeTryouts[0].displayDate} · {activeTryouts[0].time} · {activeTryouts[0].location}
              </p>
            </div>
            <Link
              href="/tryouts"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-sm bg-softball-yellow px-5 py-2.5 text-sm font-bold text-charcoal uppercase"
            >
              View tryout details
            </Link>
          </div>
        </section>
      ) : null}

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Find your team",
                body: "View baseball & softball teams and age divisions.",
                href: "/teams",
                cta: "View teams",
                external: false,
              },
              {
                title: "Tryouts & evaluations",
                body: "Dates, times, and registration information when posted.",
                href: "/tryouts",
                cta: "View tryouts",
                external: false,
              },
              {
                title: "Register to play",
                body: "Continue to Monrovia's existing registration system.",
                href: monroviaExternal.register,
                cta: "Register",
                external: true,
              },
            ].map((card) =>
              card.external ? (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring group flex flex-col rounded-lg border border-barn-border bg-barn-white p-6 shadow-sm transition hover:border-mobs-green/40"
                >
                  <h2 className="font-display text-lg font-bold text-charcoal uppercase">{card.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-barn-muted">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mobs-green uppercase group-hover:underline">
                    {card.cta}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </a>
              ) : (
                <Link
                  key={card.title}
                  href={card.href}
                  className="focus-ring group flex flex-col rounded-lg border border-barn-border bg-barn-white p-6 shadow-sm transition hover:border-mobs-green/40"
                >
                  <h2 className="font-display text-lg font-bold text-charcoal uppercase">{card.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-barn-muted">{card.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mobs-green uppercase group-hover:underline">
                    {card.cta}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-barn-border bg-barn-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-mobs-green">Registration</p>
              <h2 className="mt-2 font-display text-3xl font-black text-charcoal uppercase sm:text-4xl">
                Current programs
              </h2>
            </div>
            <ExternalLinkButton href={monroviaExternal.register} className="shrink-0">
              Register
            </ExternalLinkButton>
          </div>
          <div className="mt-8 rounded-lg border border-dashed border-barn-border bg-barn-cream/60 p-8 text-center">
            <p className="text-barn-muted">{programsEmptyMessage}</p>
            <p className="mt-4 text-sm text-barn-muted">
              When programs open, registration stays on the league&apos;s existing Stack Sports portal.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ExternalLinkButton href={monroviaExternal.programsListing} variant="secondary">
                View on monroviaball.com
              </ExternalLinkButton>
              <Link
                href="/programs"
                className="focus-ring inline-flex min-h-11 items-center rounded-sm px-4 text-sm font-semibold text-mobs-green hover:underline"
              >
                Programs page
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow text-mobs-green">Stay in the loop</p>
          <h2 className="mt-2 font-display text-3xl font-black text-charcoal uppercase sm:text-4xl">
            Important dates
          </h2>
          {upcoming.length > 0 ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((item) => (
                <li key={item.id} className="rounded-lg border border-barn-border bg-barn-white p-5">
                  <p className="text-xs font-bold tracking-wide text-mobs-green uppercase">{item.date}</p>
                  <h3 className="mt-2 font-display text-lg font-bold text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm text-barn-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 max-w-2xl text-barn-muted">
              New league dates and events will be posted here as they are announced. See the{" "}
              <Link href="/schedule" className="font-semibold text-mobs-green hover:underline">
                schedule page
              </Link>{" "}
              for the official calendar.
            </p>
          )}
          {archive.length > 0 ? (
            <details className="mt-8 rounded-lg border border-barn-border bg-barn-white p-5">
              <summary className="cursor-pointer font-display text-sm font-bold tracking-wide text-charcoal uppercase">
                Past updates (archive)
              </summary>
              <ul className="mt-4 space-y-3 border-t border-barn-border pt-4">
                {archive.map((item) => (
                  <li key={item.id} className="text-sm text-barn-muted">
                    <span className="font-semibold text-charcoal">{item.date}</span> — {item.title}: {item.body}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </section>

      <section className="section-pad border-y border-barn-border bg-barn-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="font-display text-2xl font-black text-charcoal uppercase sm:text-3xl">Quick links</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex min-h-12 items-center justify-between rounded-md border border-barn-border px-4 py-3 text-sm font-semibold text-charcoal hover:border-mobs-green/50 hover:text-mobs-green"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-hidden />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="focus-ring flex min-h-12 items-center justify-between rounded-md border border-barn-border px-4 py-3 text-sm font-semibold text-charcoal hover:border-mobs-green/50 hover:text-mobs-green"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4 shrink-0 opacity-60" aria-hidden />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad bg-mobs-green text-barn-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-softball-yellow">About MOBS</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase sm:text-4xl">
              Built for players & families
            </h2>
            <p className="mt-5 text-base leading-relaxed text-barn-cream/85">{missionStatement}</p>
            <Link
              href="/about"
              className="focus-ring mt-8 inline-flex min-h-11 items-center rounded-sm border border-softball-yellow/50 px-5 py-2.5 text-sm font-bold tracking-wide text-softball-yellow uppercase hover:bg-softball-yellow/10"
            >
              About MOBS
            </Link>
          </div>
          <div className="rounded-xl border border-white/15 bg-charcoal/40 p-8">
            <h3 className="font-display text-xl font-bold uppercase">Volunteer with us</h3>
            <p className="mt-3 text-sm leading-relaxed text-stone">
              Community youth sports depend on coaches, concession help, field work, and more. MOBS posts volunteer
              needs through the league portal when programs are active.
            </p>
            <Link
              href="/volunteer"
              className="focus-ring mt-6 inline-flex min-h-11 items-center rounded-sm bg-softball-yellow px-5 py-2.5 text-sm font-bold text-charcoal uppercase"
            >
              Help make the season happen
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-barn-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-mobs-green">Community partners</p>
              <h2 className="mt-2 font-display text-3xl font-black text-charcoal uppercase">Our sponsors</h2>
            </div>
            <Link
              href="/sponsors"
              className="text-sm font-bold text-mobs-green uppercase hover:underline"
            >
              View all sponsors
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {sponsors.slice(0, 12).map((s) => (
              <li key={s.name}>
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring flex min-h-[4.5rem] items-center justify-center rounded-md border border-barn-border bg-barn-white px-3 py-4 text-center text-xs font-semibold text-charcoal hover:border-mobs-green/40"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span className="flex min-h-[4.5rem] items-center justify-center rounded-md border border-barn-border bg-barn-white px-3 py-4 text-center text-xs font-semibold text-charcoal">
                    {s.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-pad border-t border-white/10 bg-charcoal">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow text-softball-yellow">Find us</p>
              <h2 className="mt-2 font-display text-3xl font-black text-barn-cream uppercase">League office</h2>
              <address className="mt-4 not-italic text-stone">
                <p className="font-semibold text-barn-cream">{site.name}</p>
                <p>{site.address.line1}</p>
                <p>
                  {site.address.city}, {site.address.state} {site.address.postalCode}
                </p>
                <p className="mt-3">
                  <a href={`mailto:${site.email}`} className="text-softball-yellow hover:underline">
                    {site.email}
                  </a>
                </p>
                <p className="mt-3">
                  <a
                    href={monroviaExternal.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-softball-yellow hover:underline"
                  >
                    Facebook
                  </a>
                </p>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="focus-ring inline-flex min-h-11 items-center rounded-sm border border-white/25 px-5 py-2.5 text-sm font-bold text-barn-cream uppercase"
                >
                  Contact
                </Link>
                <Link
                  href="/schedule"
                  className="focus-ring inline-flex min-h-11 items-center rounded-sm bg-softball-yellow px-5 py-2.5 text-sm font-bold text-charcoal uppercase"
                >
                  Locations & calendar
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <iframe
                title="Map to Monrovia Organized Baseball & Softball"
                src={site.mapEmbedUrl}
                className="h-64 w-full min-h-[16rem] border-0 sm:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
