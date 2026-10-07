"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { BirthdayPartyPhoto } from "@/content/birthday-parties";
type BirthdayPartyGalleryProps = {
  photos: BirthdayPartyPhoto[];
};

export function BirthdayPartyGallery({ photos }: BirthdayPartyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null) return null;
      return (index - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null) return null;
      return (index + 1) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrev]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm border border-barn-border bg-white text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-barn-green"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={1200}
              height={1600}
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition duration-300 group-hover:scale-[1.02] group-hover:opacity-95"
            />
          </button>
        ))}
      </div>

      {activePhoto && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Birthday party photo"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 flex size-11 items-center justify-center rounded-sm border border-white/20 text-barn-cream hover:border-gold hover:text-gold"
            aria-label="Close gallery"
          >
            <X className="size-6" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            className="absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-sm border border-white/20 text-barn-cream hover:border-gold hover:text-gold sm:left-4"
            aria-label="Previous photo"
          >
            <ChevronLeft className="size-7" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute top-1/2 right-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-sm border border-white/20 text-barn-cream hover:border-gold hover:text-gold sm:right-4"
            aria-label="Next photo"
          >
            <ChevronRight className="size-7" />
          </button>

          <figure
            className="relative max-h-[85vh] max-w-5xl w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={1600}
              height={2000}
              className="mx-auto max-h-[85vh] w-auto max-w-full object-contain"
              sizes="100vw"
              priority
            />
            <figcaption className="mt-3 text-center text-sm text-stone">
              {activeIndex + 1} of {photos.length}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
