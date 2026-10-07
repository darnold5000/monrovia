import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, description, className, children }: Props) {
  return (
    <section className={cn("border-b border-white/10 bg-charcoal pt-28 sm:pt-32", className)}>
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        {eyebrow ? <p className="eyebrow text-softball-yellow">{eyebrow}</p> : null}
        <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] text-barn-cream sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">{description}</p>
        ) : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
