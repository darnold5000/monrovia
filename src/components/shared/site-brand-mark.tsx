import Image from "next/image";
import Link from "next/link";
import { media } from "@/config/media";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type SiteBrandMarkProps = {
  href?: string;
  className?: string;
  priority?: boolean;
  variant?: "dark" | "light";
  showWordmark?: boolean;
};

export function SiteBrandMark({
  href = "/",
  className,
  priority = false,
  variant = "dark",
  showWordmark = true,
}: SiteBrandMarkProps) {
  const textColor = variant === "light" ? "text-charcoal" : "text-barn-cream";
  const subColor = variant === "light" ? "text-mobs-green" : "text-softball-yellow";

  const mark = (
    <>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-barn-cream ring-1 ring-white/15 sm:h-12 sm:w-12">
        <Image
          src={media.brand.logo}
          alt={`${site.name} logo`}
          width={48}
          height={48}
          priority={priority}
          className="h-full w-full object-contain p-0.5"
        />
      </span>
      {showWordmark ? (
        <span className={cn("font-display text-base font-bold tracking-[0.06em] uppercase sm:text-lg", textColor)}>
          Monrovia
          <span className={cn("block text-[0.55rem] font-semibold tracking-[0.22em] sm:text-[0.6rem]", subColor)}>
            Baseball & Softball
          </span>
        </span>
      ) : null}
    </>
  );

  return (
    <Link href={href} className={cn("focus-ring flex items-center gap-3 rounded-sm", className)}>
      {mark}
    </Link>
  );
}
