"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackToWebsiteLink } from "@/components/shared/back-to-website-link";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/tournaments", "Tournaments"],
  ["/admin/tournament-resources", "Documents"],
  ["/admin/training", "Training"],
  ["/admin/staff", "Training Staff"],
  ["/admin/travel-teams", "Travel Teams"],
  ["/admin/our-staff", "Our Staff"],
  ["/admin/facility", "Facility"],
  ["/admin/homepage", "Homepage"],
  ["/admin/settings", "Contact & Social"],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gunmetal bg-obsidian">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-sm tracking-[.14em] text-gold uppercase">Sluggers Staff Portal</p>
          <BackToWebsiteLink className="mt-1 inline-block" />
        </div>
        <nav className="flex w-full flex-wrap gap-x-4 gap-y-3 text-sm lg:w-auto lg:justify-end">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "border-b-2 border-gold pb-1 font-semibold text-gold" : "text-barn-cream hover:text-gold"}>
              {label}
            </Link>
          ))}
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-barn-cream hover:text-gold">Sign out</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
