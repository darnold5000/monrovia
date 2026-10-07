import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  showIcon?: boolean;
};

const variants = {
  primary: "bg-softball-yellow text-charcoal hover:bg-softball-yellow/90",
  secondary: "border border-white/25 bg-white/5 text-barn-cream hover:border-softball-yellow/50 hover:text-softball-yellow",
  ghost: "text-softball-yellow hover:text-barn-cream underline-offset-4 hover:underline",
};

export function ExternalLinkButton({
  href,
  children,
  variant = "primary",
  className,
  showIcon = variant !== "ghost",
}: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-bold tracking-wide uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
      {showIcon ? <ArrowUpRight className="size-4 shrink-0" aria-hidden /> : null}
    </Link>
  );
}
