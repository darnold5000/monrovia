import Image from "next/image";
import { media } from "@/config/media";
import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  alt: string;
  className?: string;
  /** sm = inline/card thumb; md = facility row; lg = training card header */
  size?: "sm" | "md" | "lg";
};

const frameClass: Record<NonNullable<MediaPlaceholderProps["size"]>, string> = {
  sm: "media-placeholder media-placeholder-sm",
  md: "media-placeholder media-placeholder-md",
  lg: "media-placeholder media-placeholder-lg",
};

const innerClass: Record<NonNullable<MediaPlaceholderProps["size"]>, string> = {
  sm: "media-placeholder-inner-sm",
  md: "media-placeholder-inner-md",
  lg: "media-placeholder-inner-lg",
};

export function MediaPlaceholder({ alt, className, size = "md" }: MediaPlaceholderProps) {
  return (
    <div className={cn(frameClass[size], className)}>
      <div className={cn("relative", innerClass[size])}>
        <Image src={media.brand.logo} alt={alt} fill className="object-contain" sizes="80px" />
      </div>
      <p className="mt-2 text-center text-[0.65rem] font-semibold tracking-[0.14em] text-barn-muted uppercase">
        Photo coming soon
      </p>
    </div>
  );
}
