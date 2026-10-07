import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import type { ResolvedSluggersSite } from "@/lib/sluggers-site";

type FacilityMapEmbedProps = {
  className?: string;
};

export function FacilityMapEmbed({ className, siteConfig = site }: FacilityMapEmbedProps & { siteConfig?: ResolvedSluggersSite }) {
  return (
    <div className={cn("overflow-hidden rounded-sm border border-barn-border bg-white", className)}>
      <iframe
        title={`Map showing ${siteConfig.name} at ${siteConfig.address.full}`}
        src={siteConfig.mapEmbedUrl}
        className="h-[280px] w-full grayscale-[30%] contrast-[1.05] sm:h-[300px] lg:h-[320px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
