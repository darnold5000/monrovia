"use client";

import Link from "next/link";
import { monroviaExternal } from "@/lib/monrovia-urls";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-charcoal/95 p-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Link
          href={monroviaExternal.login}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center rounded-sm border border-white/25 px-3 py-3 text-sm font-semibold text-barn-cream"
        >
          Login
        </Link>
        <Link
          href={monroviaExternal.register}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex min-h-11 flex-[1.35] items-center justify-center rounded-sm bg-softball-yellow px-3 py-3 text-sm font-bold text-charcoal uppercase"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
