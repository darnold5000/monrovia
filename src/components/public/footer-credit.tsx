import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";

export function FooterCredit() {
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-xs text-barn-cream/60">
      <span>Powered by the</span>
      <Link
        href={site.signalWorks.url}
        target="_blank"
        rel="noreferrer"
        title={site.signalWorks.title}
        className="inline-flex items-center gap-1.5 text-barn-cream/80 underline-offset-2 hover:text-gold hover:underline"
      >
        <Image
          src="/signal-works-icon.png"
          alt=""
          width={16}
          height={16}
          className="size-4"
        />
        {site.signalWorks.name}
      </Link>
    </p>
  );
}
