import { audienceSegments } from "@/content/training";

export function WhoItIsFor() {
  return (
    <section className="section-pad mx-auto max-w-6xl">
      <div className="max-w-2xl">
        <p className="eyebrow">Who it&apos;s for</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.06em] text-ivory uppercase sm:text-4xl">
          Ready to train with intention
        </h2>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {audienceSegments.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-gunmetal bg-card px-5 py-4 text-sm leading-relaxed text-stone"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
