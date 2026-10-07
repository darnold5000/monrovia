"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { navigation, cta } from "@/content/navigation";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { cn } from "@/lib/utils";
import { SiteBrandMark } from "@/components/shared/site-brand-mark";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
    setDesktopDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (!desktopDropdown) return;
    const onPointerDown = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setDesktopDropdown(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [desktopDropdown]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  const closeMenus = () => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
    setDesktopDropdown(null);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-charcoal/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[96rem] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <SiteBrandMark href="/" priority className="min-w-0 shrink-0" />

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex xl:gap-2" aria-label="Main">
          {navigation.map((link) => {
            if ("children" in link && link.children) {
              const active = link.children.some((c) => isActive(c.href)) || isActive(link.href);
              const open = desktopDropdown === link.href;
              return (
                <div key={link.href} className="relative" ref={open ? dropdownRef : undefined}>
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      onClick={() => setDesktopDropdown(null)}
                      className={cn(
                        "focus-ring rounded-sm px-2 py-2 text-sm font-semibold",
                        active ? "text-softball-yellow" : "text-barn-cream/90 hover:text-softball-yellow",
                      )}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-haspopup="true"
                      aria-label={`${link.label} menu`}
                      className="focus-ring rounded-sm p-1.5 text-barn-cream/90 hover:text-softball-yellow"
                      onClick={() => setDesktopDropdown((current) => (current === link.href ? null : link.href))}
                    >
                      <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} aria-hidden />
                    </button>
                  </div>
                  {open ? (
                    <div className="absolute left-0 top-full z-50 min-w-[11rem] pt-1">
                      <div className="rounded-sm border border-white/10 bg-charcoal py-1 shadow-xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setDesktopDropdown(null)}
                            className="block px-4 py-2.5 text-sm text-barn-cream/90 hover:bg-white/5 hover:text-softball-yellow"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "focus-ring shrink-0 rounded-sm px-2 py-2 text-sm font-semibold",
                  isActive(link.href) ? "text-softball-yellow" : "text-barn-cream/90 hover:text-softball-yellow",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href={monroviaExternal.login}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-sm px-3 py-2 text-sm font-semibold text-barn-cream/80 hover:text-barn-cream"
          >
            {cta.login.label}
          </Link>
          <Link
            href={monroviaExternal.register}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex min-h-11 items-center rounded-sm bg-softball-yellow px-4 py-2.5 text-sm font-bold tracking-wide text-charcoal uppercase hover:bg-softball-yellow/90"
          >
            {cta.register.label}
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-white/20 text-barn-cream lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-white/10 bg-charcoal lg:hidden",
          mobileOpen ? "block max-h-[calc(100dvh-4rem)] overflow-y-auto" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-[96rem] flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {navigation.map((link) => {
            if ("children" in link && link.children) {
              return (
                <div key={link.href} className="flex flex-col">
                  <button
                    type="button"
                    className="focus-ring flex items-center justify-between rounded-sm px-3 py-3 text-base font-semibold text-barn-cream"
                    aria-expanded={mobileAboutOpen}
                    onClick={() => setMobileAboutOpen((v) => !v)}
                  >
                    {link.label}
                    <ChevronDown className={cn("size-4 transition", mobileAboutOpen && "rotate-180")} aria-hidden />
                  </button>
                  {mobileAboutOpen ? (
                    <div className="mb-2 flex flex-col border-l border-white/15 pl-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="focus-ring rounded-sm px-3 py-2.5 text-base text-barn-cream/90 hover:text-softball-yellow"
                          onClick={closeMenus}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-sm px-3 py-3 text-base font-semibold text-barn-cream hover:text-softball-yellow"
                onClick={closeMenus}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={monroviaExternal.login}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-2 rounded-sm px-3 py-3 text-center text-base font-semibold text-barn-cream/80"
            onClick={closeMenus}
          >
            Login
          </Link>
          <Link
            href={monroviaExternal.register}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-1 inline-flex min-h-12 items-center justify-center rounded-sm bg-softball-yellow px-4 py-3 text-center text-base font-bold text-charcoal uppercase"
            onClick={closeMenus}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
