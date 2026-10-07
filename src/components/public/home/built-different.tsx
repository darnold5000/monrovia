import Image from "next/image";
import { media } from "@/config/media";
import { trainingPhilosophy } from "@/content/training";

export function BuiltDifferentSection() {
  return (
    <section className="section-pad border-y border-gunmetal bg-charcoal noise-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-gunmetal">
          <Image
            src={media.facility.racks}
            alt="Sluggers indoor baseball and softball training"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">Built Different</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.06em] text-ivory uppercase sm:text-4xl">
            Training with purpose
          </h2>
          <div className="gold-divider my-6 max-w-xs" />
          <p className="text-base leading-relaxed text-stone sm:text-lg">
            {trainingPhilosophy.description}
          </p>
        </div>
      </div>
    </section>
  );
}
