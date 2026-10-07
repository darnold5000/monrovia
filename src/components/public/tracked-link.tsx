"use client";

import Link from "next/link";
import type { AnalyticsEvent } from "@/lib/analytics";
import { trackEventRepeatable } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  event: AnalyticsEvent;
  properties?: Record<string, string | number | boolean>;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
};

export function TrackedLink({
  href,
  event,
  properties,
  className,
  children,
  external,
}: TrackedLinkProps) {
  const handleClick = () => trackEventRepeatable(event, properties);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
