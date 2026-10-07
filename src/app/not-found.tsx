import Link from "next/link";
import Image from "next/image";
import { media } from "@/config/media";
import { site } from "@/content/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-barn-cream">
      <header className="border-b border-barn-blue/40 px-4 py-4 sm:px-6">
        <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-sm">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-barn-cream ring-1 ring-white/20">
            <Image
              src={media.brand.logo}
              alt={`${site.shortName} logo`}
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
            />
          </span>
          <span className="font-display text-lg font-bold tracking-[0.08em] uppercase">Sluggers</span>
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="eyebrow">Page not found</p>
        <h1 className="mt-4 font-display text-4xl font-black uppercase sm:text-5xl">That page is not available</h1>
        <p className="mt-4 text-stone">
          The link may be outdated. Head back to {site.shortName} or book online.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="bg-gold px-6 py-3 text-sm font-bold tracking-[.14em] text-obsidian uppercase">
            Home
          </Link>
          <Link
            href="/availability"
            className="border border-barn-cream/30 px-6 py-3 text-sm font-bold tracking-[.14em] text-barn-cream uppercase hover:border-gold"
          >
            Book
          </Link>
        </div>
      </main>
    </div>
  );
}
