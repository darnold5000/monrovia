import { media } from "@/config/media";
import { site } from "@/content/site";

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export const galleryImages: GalleryImage[] = [
  {
    src: media.facility.main,
    alt: `Main training area at ${site.shortName}`,
    label: "Main Turf",
  },
  {
    src: media.facility.mainTurfWide,
    alt: `Main turf team practice at ${site.shortName}`,
    label: "Team practice",
  },
  {
    src: media.facility.upstairs,
    alt: `Upstairs pitching lane at ${site.shortName}`,
    label: "Pitching lane",
  },
  {
    src: media.facility.upstairsTraining,
    alt: `Upstairs hitting and pitching area at ${site.shortName}`,
    label: "Upstairs training",
  },
];
