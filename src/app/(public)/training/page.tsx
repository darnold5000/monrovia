import Link from "next/link";
import Image from "next/image";
import { StaffPortraitPhoto } from "@/components/public/staff-portrait-photo";
import { createMetadata } from "@/lib/seo";
import {
  trainingCategories,
  trainingOfferings,
  type TrainingOffering,
} from "@/content/instructors";
import { trainingPhilosophy } from "@/content/training";
import { cn } from "@/lib/utils";
import { getPublicContentState } from "@/lib/sluggers-cms";
import { getPublicStaff } from "@/lib/sluggers-staff";

function sportLabel(sport: TrainingOffering["sport"]): string {
  return sport === "baseball" ? "Baseball" : "Softball";
}

type PublicTrainingOffering = TrainingOffering & {
  durationLabel?: string;
  displayPrice?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

function TrainingOfferingCard({ offering }: { offering: PublicTrainingOffering }) {
  const service = offering.sport === "baseball" && offering.skill === "Pitching"
    ? "baseball-lesson"
    : offering.sport === "softball" && offering.skill === "Pitching"
      ? "softball-lesson"
      : "small-group-training";
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-barn-border bg-white">
      <div className="relative aspect-[4/3] bg-barn-cream">
        <Image
          src={offering.image}
          alt={offering.title}
          fill
          className="object-cover"
          style={{ objectPosition: offering.imagePosition ?? "center" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.65rem] font-bold tracking-[0.14em] text-barn-muted uppercase">
          {sportLabel(offering.sport)}
        </p>
        <p className="mt-1 text-xs font-bold tracking-[0.14em] text-gold uppercase">{offering.skill}</p>
        <h3 className="mt-1 font-display text-base font-bold uppercase leading-tight text-barn-navy">
          {offering.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-barn-muted">
          {offering.description}
        </p>
        <p className="mt-2 text-xs text-barn-muted">{offering.durationLabel ?? `${offering.durationMinutes} min`} · {offering.displayPrice ?? "Contact for availability and pricing"}</p>
        <Link
          href={offering.ctaUrl ?? `/availability?calendar=upstairs&service=${service}`}
          className="btn-primary-green mt-3 inline-flex w-full justify-center px-4 py-2.5 text-sm"
        >
          {offering.ctaLabel ?? "Request a Lesson"}
        </Link>
      </div>
    </article>
  );
}

function SkillPills({ skills, className }: { skills: readonly string[]; className?: string }) {
  return (
    <div className={cn("mt-2 flex flex-wrap gap-1.5", className)}>
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-sm border border-barn-border bg-white px-2 py-0.5 text-[0.65rem] font-semibold text-barn-navy"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function TrainingCategoryBlock({
  eyebrow,
  title,
  skills,
}: {
  eyebrow: string;
  title: string;
  skills: readonly string[];
}) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-1 font-display text-lg font-bold uppercase text-barn-navy sm:text-xl">{title}</h2>
      <SkillPills skills={skills} />
    </div>
  );
}

export const metadata = createMetadata({
  title: "Training",
  description:
    "Baseball and softball hitting, pitching, and player development instruction at Sluggers Indoor Baseball & Softball in Poland, Ohio.",
  path: "/training",
});

export default async function TrainingPage() {
  const [activeInstructors, trainingState] = await Promise.all([
    getPublicStaff(),
    getPublicContentState("training_offering"),
  ]);
  const publicOfferings = trainingState.cmsManaged
    ? trainingState.published.map((item) => ({
        id: item.id,
        title: item.title,
        description: String(item.data.description ?? ""),
        sport: String(item.data.sport ?? "baseball").toLowerCase() as "baseball" | "softball",
        skill: String(item.data.category ?? "Training"),
        instructorId: "",
        durationMinutes: Number.parseInt(String(item.data.duration ?? "0"), 10) || 0,
        priceCents: 0,
        image: String(item.data.imageUrl ?? "") || trainingOfferings[0].image,
        imagePosition: String(item.data.imagePosition ?? "") || undefined,
        durationLabel: String(item.data.duration ?? "") || undefined,
        displayPrice: String(item.data.displayPrice ?? "") || undefined,
        ctaLabel: String(item.data.ctaLabel ?? "") || undefined,
        ctaUrl: String(item.data.ctaUrl ?? "") || undefined,
      }))
    : trainingOfferings;
  const baseballOfferings = publicOfferings.filter((offering) => offering.sport === "baseball");
  const softballOfferings = publicOfferings.filter((offering) => offering.sport === "softball");

  return (
    <div className="page-interior">
      <section className="interior-hero border-b border-barn-border pb-7 sm:pb-8 lg:pb-9">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:gap-8">
          <div>
            <p className="eyebrow">Training</p>
            <h1 className="interior-heading mt-2">{trainingPhilosophy.headline}</h1>
            <p className="mt-3 max-w-2xl text-sm text-barn-muted">{trainingPhilosophy.description}</p>
          </div>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2 lg:mt-0">
            {trainingPhilosophy.highlights.map((item) => (
              <li key={item} className="text-xs text-barn-muted sm:text-sm">
                · {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-9">
        <div className="mx-auto max-w-7xl">
          <div className="hidden grid-cols-4 gap-x-4 gap-y-5 xl:grid">
            <div className="col-span-2">
              <TrainingCategoryBlock
                eyebrow="Baseball"
                title="Baseball Training"
                skills={trainingCategories.baseball}
              />
            </div>
            <div className="col-span-2">
              <TrainingCategoryBlock
                eyebrow="Softball"
                title="Softball Training"
                skills={trainingCategories.softball}
              />
            </div>
            {publicOfferings.map((offering) => (
              <TrainingOfferingCard key={offering.id} offering={offering} />
            ))}
          </div>

          <div className="space-y-8 xl:hidden">
            <div>
              <TrainingCategoryBlock
                eyebrow="Baseball"
                title="Baseball Training"
                skills={trainingCategories.baseball}
              />
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {baseballOfferings.map((offering) => (
                  <TrainingOfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            </div>
            <div>
              <TrainingCategoryBlock
                eyebrow="Softball"
                title="Softball Training"
                skills={trainingCategories.softball}
              />
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {softballOfferings.map((offering) => (
                  <TrainingOfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeInstructors.length > 0 ? (
        <section className="border-t border-barn-border px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-7xl">
            <p className="eyebrow">Training staff</p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase text-barn-navy">Train with Sluggers coaches</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {activeInstructors.map((instructor) => (
                <article key={instructor.id} className="flex gap-4 rounded-sm border border-barn-border bg-white p-4 sm:p-5">
                  <StaffPortraitPhoto name={instructor.name} photo={instructor.photo} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.12em] text-gold uppercase">{instructor.role}</p>
                    <h3 className="font-display text-lg font-bold uppercase text-barn-navy">{instructor.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-barn-muted">{instructor.bio}</p>
                    <p className="mt-2 text-sm font-semibold text-barn-navy">Please contact <a href={`tel:${instructor.phone.replace(/[^\d+]/g, "")}`} className="text-barn-green underline decoration-gold/60 underline-offset-2 hover:text-gold">{instructor.phone}</a></p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {instructor.specialties.map((specialty) => (
                        <span key={specialty} className="rounded-sm border border-barn-border bg-barn-cream/60 px-2 py-0.5 text-[0.65rem] font-semibold text-barn-navy">{specialty}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Booking process and technology cards are retained for a future training-page refresh. */}
      {/* <section className="border-t border-barn-border px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-sm border border-barn-border bg-white p-4 sm:p-5">
            <p className="eyebrow">How booking works</p>
            <ol className="mt-3 space-y-2">
              {trainingProcess.map((step, index) => (
                <li key={step} className="flex gap-2.5 text-sm text-barn-muted">
                  <span className="font-display text-sm font-bold text-gold">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-sm border border-barn-border bg-white p-4 sm:p-5">
            <p className="eyebrow">Train with feedback</p>
            <h2 className="mt-1 font-display text-lg font-bold uppercase text-barn-navy sm:text-xl">
              Technology-supported development
            </h2>
            <p className="mt-2 text-sm text-barn-muted">
              Instruction can incorporate player-development technology such as{" "}
              {technologyHighlights.join(" and ")} where offered.
            </p>
          </div>
        </div>
      </section> */}

      <section className="interior-cta bg-obsidian">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <h2 className="font-display text-3xl font-black uppercase text-barn-cream sm:text-4xl">Ready to train?</h2>
          <Link
            href="/availability?calendar=upstairs&service=baseball-lesson"
            className="bg-gold px-6 py-3 text-sm font-bold tracking-[0.14em] text-obsidian uppercase"
          >
            Request a Lesson
          </Link>
        </div>
      </section>
    </div>
  );
}
