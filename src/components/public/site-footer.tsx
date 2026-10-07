import Link from "next/link";
import { site } from "@/content/site";
import { navigation } from "@/content/navigation";
import { monroviaExternal } from "@/lib/monrovia-urls";
import { FooterCredit } from "@/components/public/footer-credit";
import { SocialLinks } from "@/components/public/social-links";

export function SiteFooter() {
  const exploreLinks: { href: string; label: string }[] = [];
  for (const link of navigation) {
    if ("children" in link && link.children) {
      for (const child of link.children) {
        exploreLinks.push({ href: child.href, label: child.label });
      }
    } else {
      exploreLinks.push({ href: link.href, label: link.label });
    }
  }

  return (
    <footer className="mt-auto border-t border-white/10 bg-obsidian text-barn-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-9 sm:px-6 sm:py-10 lg:grid-cols-3 lg:gap-12">
        <div>
          <p className="font-display text-xl font-bold tracking-[0.08em] text-barn-cream uppercase">
            {site.shortName}
          </p>
          <p className="mt-1 text-sm text-softball-yellow">{site.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-barn-cream/70">{site.tagline}</p>
          <SocialLinks className="mt-5" social={site.social} />
        </div>

        <div>
          <h2 className="mb-3 font-display text-xs tracking-[0.2em] text-softball-yellow uppercase">Explore</h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-barn-cream/70">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-softball-yellow">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={monroviaExternal.login}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-softball-yellow hover:text-barn-cream"
              >
                Staff Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display text-xs tracking-[0.2em] text-softball-yellow uppercase">Contact</h2>
          <address className="not-italic text-sm leading-relaxed text-barn-cream/70">
            <p>{site.address.line1}</p>
            <p>
              {site.address.city}, {site.address.state} {site.address.postalCode}
            </p>
            <p className="mt-2">
              <a href={`mailto:${site.email}`} className="hover:text-softball-yellow">
                {site.email}
              </a>
            </p>
            <p className="mt-2">
              <a
                href={site.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-softball-yellow hover:text-barn-cream"
              >
                Get Directions
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-barn-cream/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/privacy" className="hover:text-softball-yellow">
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-softball-yellow">
              Website Terms
            </Link>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <FooterCredit />
          </div>
        </div>
      </div>
    </footer>
  );
}
