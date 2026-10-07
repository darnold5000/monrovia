import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { galleryImages } from "@/lib/gallery";

export function PhotoStrip() {
  return (
    <section className="section-pad bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Inside Sluggers</p>
            <h2 className="mt-3 font-display text-5xl font-black uppercase leading-none text-ivory">See the space.</h2>
          </div>
          <Link href="/facility" className="text-sm font-bold tracking-[.16em] text-barn-blue uppercase">View facility <ArrowUpRight className="ml-1 inline size-4" /></Link>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.slice(0, 4).map((image, index) => (
            <Link key={image.src} href="/facility" className={`group relative overflow-hidden border border-gunmetal ${index === 0 ? "sm:row-span-2 sm:aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-bold tracking-[.16em] text-white uppercase">{image.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
