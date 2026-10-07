import { createMetadata } from "@/lib/seo";
import { boardMembers } from "@/content/monrovia-data";
import { PageHero } from "@/components/public/page-hero";

export const metadata = createMetadata({
  title: "Board Members",
  description: "Monrovia Organized Baseball & Softball board of directors and league leadership.",
  path: "/about/board",
});

export default function BoardPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Board"
        description="Roster published on monroviaball.com. Vacant roles are shown without invented names."
      />

      <section className="section-pad bg-barn-cream">
        <ul className="mx-auto grid max-w-4xl gap-3 px-5 sm:px-8 sm:grid-cols-2">
          {boardMembers.map((member) => (
            <li
              key={member.role}
              className="rounded-lg border border-barn-border bg-barn-white px-5 py-4"
            >
              <p className="text-xs font-bold tracking-wide text-mobs-green uppercase">{member.role}</p>
              <p className="mt-1 font-display text-lg font-bold text-charcoal">
                {member.name ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
