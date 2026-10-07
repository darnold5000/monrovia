"use client";

import Image from "next/image";
import Link from "next/link";
import { media } from "@/config/media";
import { getTrainingAreaBookHref, trainingAreas } from "@/content/training";
import { trackEventRepeatable } from "@/lib/analytics";

export function HomeTraining() {
  return (
    <section id="training" className="section-pad mx-auto max-w-6xl">
      <div className="max-w-2xl">
        <p className="eyebrow">Training</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.06em] text-ivory uppercase sm:text-4xl">
          Focused coaching for real results
        </h2>
        <p className="mt-4 text-stone">
          From speed and agility to strength and conditioning — coaching built around
          your goals in a focused training environment.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {trainingAreas.map((area) => (
          <Link
            key={area.id}
            href={getTrainingAreaBookHref(area.id)}
            onClick={() =>
              trackEventRepeatable("training_service_click", { service: area.id })
            }
            className="focus-ring group overflow-hidden rounded-sm border border-gunmetal bg-card transition hover:border-gold/40"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={media.training[area.id as keyof typeof media.training]}
                alt={`${area.title} at Sluggers`}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold tracking-[0.08em] text-ivory uppercase">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{area.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
