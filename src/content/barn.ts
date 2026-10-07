import { facilitySpaces } from "@/content/facility";
import { trainingOfferings } from "@/content/instructors";
import { media } from "@/config/media";

/** Backward-compatible service list for booking and training pages. */
export const services = [
  ...trainingOfferings.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    priceCents: o.priceCents,
    image: o.image,
  })),
  ...facilitySpaces.map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    priceCents: f.priceCents,
    image: media.facility.main,
  })),
] as const;

export { facilityFeatures } from "@/content/facility";
