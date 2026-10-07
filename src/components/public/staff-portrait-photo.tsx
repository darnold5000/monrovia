import Image from "next/image";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";

type StaffPortraitPhotoProps = {
  name: string;
  photo: string;
};

export function StaffPortraitPhoto({ name, photo }: StaffPortraitPhotoProps) {
  return (
    <div className="relative h-36 w-28 shrink-0 overflow-hidden rounded-sm border border-barn-border bg-barn-cream sm:h-40 sm:w-32">
      {photo ? (
        <Image src={photo} alt={name} fill className="object-contain object-center" sizes="128px" />
      ) : (
        <MediaPlaceholder
          alt={`${name} photo placeholder`}
          size="sm"
          className="!h-full !min-h-0 !max-h-none rounded-none border-0"
        />
      )}
    </div>
  );
}
