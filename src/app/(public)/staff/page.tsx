import { StaffPortraitPhoto } from "@/components/public/staff-portrait-photo";
import { createMetadata } from "@/lib/seo";
import { getPublicStaff } from "@/lib/sluggers-staff";

export const metadata = createMetadata({
  title: "Training Staff",
  description: "Meet the Sluggers Indoor Baseball & Softball coaches and instructors serving players and teams in Poland, Ohio.",
  path: "/staff",
});

export default async function StaffPage() {
  const staff = await getPublicStaff();

  return (
    <div className="page-interior">
      <section className="interior-hero border-b border-barn-border pb-7 sm:pb-8 lg:pb-9">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Training staff</p>
          <h1 className="interior-heading mt-2">Meet the Sluggers coaches</h1>
          <p className="mt-3 max-w-2xl text-sm text-barn-muted sm:text-base">
            Experienced coaches and instructors helping baseball and softball players train with purpose.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2">
            {staff.map((member) => (
              <article key={member.id} className="flex gap-4 rounded-sm border border-barn-border bg-white p-4 sm:p-5">
                <StaffPortraitPhoto name={member.name} photo={member.photo} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.12em] text-gold uppercase">{member.role}</p>
                  <h2 className="font-display text-lg font-bold uppercase text-barn-navy">{member.name}</h2>
                  <p className="mt-1 text-sm text-barn-muted">{member.bio}</p>
                  <p className="mt-2 text-sm font-semibold text-barn-navy">Please contact <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`} className="text-barn-green underline decoration-gold/60 underline-offset-2 hover:text-gold">{member.phone}</a></p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {member.specialties.map((specialty) => (
                      <span key={specialty} className="rounded-sm border border-barn-border bg-barn-cream/60 px-2 py-0.5 text-[0.65rem] font-semibold text-barn-navy">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
