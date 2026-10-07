import Image from "next/image";
import { MediaPlaceholder } from "@/components/shared/media-placeholder";

export type PublicProfile = {
  id: string;
  name: string;
  photoUrl: string;
  teamName?: string;
  role?: string;
  email?: string;
  phone?: string;
};

type ProfilePlaceholderGridProps = {
  count: number;
  profileLabel: string;
  description: string;
  columns?: 2 | 3 | 4;
  profiles?: PublicProfile[];
};

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function ProfilePlaceholderGrid({
  count,
  profileLabel,
  description,
  columns = 2,
  profiles = [],
}: ProfilePlaceholderGridProps) {
  const profileSlots: Array<PublicProfile | null> = profiles.length
    ? profiles
    : Array.from({ length: count }, () => null);

  return (
    <div className={`grid gap-5 md:grid-cols-2 ${columns === 3 ? "xl:grid-cols-3" : columns === 4 ? "lg:grid-cols-4" : ""}`}>
      {profileSlots.map((profile, index) => (
        <article
          key={profile?.id ?? `${profileLabel}-${index + 1}`}
          className="overflow-hidden rounded-sm border border-barn-border bg-white"
        >
          <div className="relative aspect-[3/4] border-b border-barn-border bg-barn-cream">
            {profile?.photoUrl ? (
              <Image
                src={profile.photoUrl}
                alt={profile.name}
                fill
                className="object-cover object-top"
                sizes={columns === 4 ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" : columns === 3 ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
              />
            ) : (
              <MediaPlaceholder
                alt={`${profile?.name ?? `${profileLabel} ${index + 1}`} photo placeholder`}
                size="lg"
                className="!h-full !min-h-0 !max-h-none rounded-none border-0"
              />
            )}
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold tracking-[0.12em] text-gold uppercase">
              {profile?.teamName || profile?.role || (profile ? profileLabel : `${profileLabel} ${index + 1}`)}
            </p>
            <h2 className="mt-1 font-display text-xl font-bold uppercase text-barn-navy">
              {profile?.name ?? "Name coming soon"}
            </h2>
            {profile?.email || profile?.phone ? (
              <div className="mt-3 space-y-1 text-sm text-barn-muted">
                {profile.email ? <p><a href={`mailto:${profile.email}`} className="underline decoration-gold/60 underline-offset-2 hover:text-gold">{profile.email}</a></p> : null}
                {profile.phone ? <p><a href={phoneHref(profile.phone)} className="underline decoration-gold/60 underline-offset-2 hover:text-gold">{profile.phone}</a></p> : null}
              </div>
            ) : !profile ? (
              <p className="mt-3 text-sm leading-relaxed text-barn-muted">{description}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
