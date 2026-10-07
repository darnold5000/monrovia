"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type TournamentPosterButtonProps = {
  src: string;
  alt: string;
  landscape?: boolean;
};

export function TournamentPosterButton({ src, alt, landscape = false }: TournamentPosterButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group flex w-full items-center justify-center focus:outline-none ${landscape ? "max-w-2xl" : "max-w-[11rem] lg:max-w-none"}`}
        aria-label={`View full ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          width={landscape ? 1320 : 480}
          height={landscape ? 928 : 720}
          className={`h-auto max-w-full object-contain transition group-hover:opacity-90 ${landscape ? "w-full" : "max-h-[min(320px,50vh)] w-auto"}`}
          sizes={landscape ? "(max-width: 1024px) 90vw, 18vw" : "(max-width: 1024px) 11rem, 18vw"}
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="focus-ring absolute right-4 top-4 rounded-sm border border-barn-cream/20 p-2 text-barn-cream"
            aria-label="Close poster"
          >
            <X className="size-5" />
          </button>
          <Image
            src={src}
            alt={alt}
            width={landscape ? 1320 : 960}
            height={landscape ? 928 : 1440}
            className="max-h-[90vh] max-w-full object-contain"
            sizes="90vw"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
