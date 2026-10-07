import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function BirthdayPartyPromo() {
  return (
    <section
      className="border-b border-gold/25 bg-charcoal px-5 py-6 sm:px-8 sm:py-7"
      aria-labelledby="birthday-party-promo-heading"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <p className="eyebrow text-gold">Real parties. Real fun.</p>
          <p
            id="birthday-party-promo-heading"
            className="mt-2 font-display text-xl font-bold uppercase leading-tight text-barn-cream sm:text-2xl"
          >
            See what birthday parties at Sluggers look like.
          </p>
        </div>
        <Link
          href="/birthday-parties"
          className="inline-flex min-h-11 shrink-0 items-center justify-center bg-gold px-7 py-4 text-center text-sm font-bold tracking-[.14em] text-obsidian uppercase hover:bg-gold/90"
        >
          View the Birthday Party Gallery <ArrowUpRight className="ml-1.5 size-4 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
