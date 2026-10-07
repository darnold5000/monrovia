import Link from "next/link";
import { requireSluggersStaff } from "@/lib/sluggers-admin-auth";

const cards = [
  ["Tournaments", "/admin/tournaments", "Add, edit, or remove upcoming tournaments."],
  ["Tournament Documents", "/admin/tournament-resources", "Update rules, age charts, and other PDFs."],
  ["Training", "/admin/training", "Update training options, descriptions, and photos."],
  ["Training Staff", "/admin/staff", "Manage instructor photos, bios, and specialties."],
  ["Sluggers Travel Teams", "/admin/travel-teams", "Manage travel team coach photos and contact information."],
  ["Our Staff", "/admin/our-staff", "Manage staff photos and roles."],
  ["Facility", "/admin/facility", "Update facility information, photos, and highlights."],
  ["Homepage", "/admin/homepage", "Change homepage photos and featured text."],
  ["Contact & Social", "/admin/settings", "Update phone, email, address, directions, and social links."],
] as const;

export default async function AdminDashboardPage() {
  const { db, tenantId } = await requireSluggersStaff();
  const { data: items, error: contentError } = await db
    .from("tenant_content_items")
    .select("content_type, published")
    .eq("tenant_id", tenantId);
  if (contentError) console.error("Sluggers admin dashboard content summary failed", { tenantId, code: contentError.code, message: contentError.message });
  const published = (type: string) => items?.filter((item) => item.content_type === type && item.published).length ?? 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="eyebrow">Website administration</p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase text-barn-cream">Sluggers Staff Portal</h1>
      <p className="mt-3 max-w-2xl text-stone">Keep your website current.</p>
      {contentError ? <p className="mt-6 border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-100">We couldn’t load the website summary. Please try again.</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Summary label="Visible tournaments" value={published("tournament")} />
        <Summary label="Training staff" value={published("staff")} />
        <Summary label="Travel team coaches" value={published("travel_team_coach")} />
        <Summary label="Our staff" value={published("business_staff")} />
        <Summary label="Training options" value={published("training_offering")} />
        <Summary label="Tournament documents" value={published("tournament_resource")} />
      </div>
      <div className="mt-8 border-t border-gunmetal pt-5 text-sm text-stone">
        <p>Less-used tools: <Link href="/admin/programs" className="font-semibold text-gold hover:text-barn-cream">Programs</Link> · <Link href="/admin/facility-stats" className="font-semibold text-gold hover:text-barn-cream">Facility Highlights</Link></p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([title, href, description]) => (
          <Link key={href} href={href} className="border border-gunmetal bg-card p-5 transition hover:-translate-y-0.5 hover:border-gold">
            <h2 className="font-display text-xl font-bold uppercase text-barn-navy">{title}</h2>
            <p className="mt-2 text-sm text-stone">{description}</p>
            <span className="mt-5 inline-block text-xs font-bold tracking-[.14em] text-gold uppercase">Manage →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div className="border border-gunmetal bg-card p-4"><p className="text-xs text-stone">{label}</p><p className="mt-2 font-display text-3xl text-gold">{value}</p></div>;
}
