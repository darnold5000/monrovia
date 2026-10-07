"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, resetPageViewDedupe } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    resetPageViewDedupe();
    trackEvent("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
