import { cta } from "@/content/navigation";
import { site } from "@/content/site";
import { TrackedLink } from "@/components/public/tracked-link";

export function HomeFinalCta() {
  return (
    <section className="section-pad border-t border-gunmetal bg-charcoal noise-surface">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="eyebrow">Take the first step</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-[0.08em] text-ivory uppercase">
          Ready to earn it?
        </h2>
        <p className="mt-4 text-stone">
          Tell us what you are training for and take the first step toward a stronger,
          more capable version of yourself.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <TrackedLink
            href={cta.primary.href}
            event="hero_start_training_click"
            properties={{ location: "final_cta" }}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-sm bg-gold px-8 py-3 text-sm font-semibold text-obsidian"
          >
            {cta.primary.label}
          </TrackedLink>
          <TrackedLink
            href={site.phoneHref}
            event="phone_click"
            properties={{ location: "final_cta" }}
            className="focus-ring inline-flex min-h-11 items-center justify-center rounded-sm border border-gold/40 px-8 py-3 text-sm font-semibold text-ivory"
          >
            Call Now
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
