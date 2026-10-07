import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Sponsor } from "@/content/monrovia-data";
import { cn } from "@/lib/utils";

type SponsorCardProps = {
  sponsor: Sponsor;
  className?: string;
  showName?: boolean;
};

export function SponsorCard({ sponsor, className, showName = true }: SponsorCardProps) {
  const content = (
    <>
      <div className="flex min-h-[4.5rem] flex-1 items-center justify-center px-4 py-3">
        {sponsor.logo ? (
          <Image
            src={sponsor.logo}
            alt={sponsor.name}
            width={125}
            height={80}
            className="max-h-14 w-full max-w-[140px] object-contain"
          />
        ) : (
          <span className="text-center text-sm font-semibold text-charcoal">{sponsor.name}</span>
        )}
      </div>
      {showName && sponsor.logo ? (
        <p className="border-t border-barn-border px-3 py-2 text-center text-xs font-medium text-barn-muted">
          {sponsor.name}
        </p>
      ) : null}
      {sponsor.href ? (
        <ArrowUpRight
          className="absolute top-2 right-2 size-4 text-barn-muted opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      ) : null}
    </>
  );

  const shell = cn(
    "group relative flex flex-col overflow-hidden rounded-lg border border-barn-border bg-barn-white transition hover:border-mobs-green/40 hover:shadow-sm",
    className,
  );

  if (sponsor.href) {
    return (
      <a
        href={sponsor.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(shell, "focus-ring")}
      >
        {content}
      </a>
    );
  }

  return <div className={shell}>{content}</div>;
}
