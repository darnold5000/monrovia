"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { isTournamentDocumentImage } from "@/lib/tournament-document";

type TournamentDocumentActionProps = {
  url: string;
  tournamentName: string;
  downloadName?: string;
};

export function TournamentDocumentAction({ url, tournamentName, downloadName }: TournamentDocumentActionProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isImage = isTournamentDocumentImage(url);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  if (!isImage) {
    return (
      <a href={url} download={downloadName ?? "sluggers-tournament-registration-form.pdf"} className="btn-primary-green w-full text-center">
        Download Form
      </a>
    );
  }

  const downloadUrl = `/api/tournament-document/download?${new URLSearchParams({ url, tournament: tournamentName })}`;

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)} className="btn-primary-green w-full text-center">
        View Flyer
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[110] overflow-y-auto bg-obsidian/90 px-3 py-4 sm:px-6 sm:py-8"
          onMouseDown={close}
        >
          <div className="mx-auto flex min-h-full max-w-6xl items-start justify-center">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="tournament-flyer-title"
              className="relative w-fit max-w-full overflow-hidden rounded-sm border border-gold/50 bg-barn-cream shadow-2xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-barn-green px-4 py-3 text-barn-cream sm:px-5">
                <h2 id="tournament-flyer-title" className="font-display text-base font-bold uppercase sm:text-lg">
                  {tournamentName} Flyer
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="focus-ring inline-flex size-11 shrink-0 items-center justify-center rounded-sm border border-barn-cream/40 text-barn-cream hover:border-gold hover:text-gold"
                  aria-label="Close flyer"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="flex max-w-full justify-center bg-obsidian p-2 sm:p-4">
                {/* The natural image dimensions are intentional because CMS flyers can use different aspect ratios. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`${tournamentName} tournament flyer`} className="block h-auto max-w-full" />
              </div>

              <div className="sticky bottom-0 flex justify-center bg-barn-green px-4 py-4 sm:px-5">
                <a href={downloadUrl} className="inline-flex min-h-11 items-center justify-center gap-2 bg-gold px-6 py-3 text-sm font-bold tracking-[.08em] text-obsidian uppercase hover:bg-gold/90">
                  <Download className="size-4" aria-hidden="true" />
                  Download Flyer
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
