import { ArrowUpRight, FileText } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { multiTournamentDiscount, tournaments } from "@/content/tournaments";
import { formatPrice, formatTournamentDates } from "@/lib/format";
import { TournamentPosterButton } from "@/components/public/tournament-poster-button";
import { sluggersLinks } from "@/content/sluggers-links";
import { getPublicContentState } from "@/lib/sluggers-cms";
import { TournamentRegistrationForm } from "@/components/public/tournament-registration-form";
import { TournamentDocumentAction } from "@/components/public/tournament-document-action";

export const metadata = createMetadata({
  title: "Softball Tournaments",
  description:
    "Upcoming Sluggers softball tournaments, age divisions, and registration information in Northeast Ohio.",
  path: "/tournaments",
});

function statusLabel(status: string) {
  if (status === "closing-soon") return "Closing soon";
  if (status === "sold-out") return "Sold out";
  return "Registration open";
}

function emphasizeTournamentAmounts(text: string) {
  return text.split(/(\$495|\$620|\$990)/g).map((part, index) =>
    /^\$(?:495|620|990)$/.test(part) ? (
      <strong key={`${part}-${index}`} className="font-bold text-barn-navy">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default async function TournamentsPage() {
  const [tournamentState, resourceState] = await Promise.all([
    getPublicContentState("tournament"),
    getPublicContentState("tournament_resource"),
  ]);
  const managedTournamentSlugs = new Set(tournamentState.managedSlugs);
  const cmsTournaments = tournamentState.published.map((item) => ({
        id: item.slug,
        name: item.title,
        dateStart: String(item.data.startDate ?? ""),
        dates: formatTournamentDates(String(item.data.startDate ?? ""), String(item.data.endDate ?? "")),
        location: String(item.data.location ?? ""),
        address: String(item.data.address ?? ""),
        locations: Array.isArray(item.data.locations)
          ? item.data.locations.filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
          : [],
        ageGroups: String(item.data.ageGroups ?? ""),
        registrationFeeCents: 0,
        registrationFeeLabel: String(item.data.registrationFee ?? ""),
        gameGuarantee: String(item.data.format ?? "") || undefined,
        registrationStatus: String(item.data.status ?? "coming-soon"),
        details: String(item.data.description ?? ""),
        poster: String(item.data.flyerUrl ?? ""),
        registrationForm: String(item.data.registrationFormUrl ?? sluggersLinks.registrationForm),
        registrationFormDownload: String(item.data.registrationFormUrl ?? "").split("/").pop() || "sluggers-tournament-registration-form.pdf",
        registrationVariant: String(item.data.registrationVariant ?? "standard") === "series" ? "series" as const : "standard" as const,
        registrationUrl: String(item.data.registrationUrl ?? ""),
        depositAmount: String(item.data.depositAmount ?? ""),
        registrationPhone: String(item.data.registrationPhone ?? ""),
      }));
  const publicTournaments = (tournamentState.cmsManaged
    ? cmsTournaments
    : [
      ...cmsTournaments,
      ...tournaments.filter((tournament) => !managedTournamentSlugs.has(tournament.id)),
    ]).sort((a, b) => a.dateStart.localeCompare(b.dateStart));
  const publicResources = resourceState.cmsManaged
    ? resourceState.published.map((item) => [item.title, String(item.data.url ?? "")] as const)
    : ([
        ["8U Playing Rules", sluggersLinks.playingRules8U],
        ["Tournament Rules and Guidelines", sluggersLinks.tournamentRules],
        ["2027 Player Age Chart", sluggersLinks.playerAgeChart],
      ] as const);
  return (
    <div className="page-interior">
      <section className="interior-hero border-b border-barn-border pb-6 sm:pb-7 lg:pb-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Softball tournaments</p>
          <h1 className="interior-heading mt-2 max-w-4xl">Compete with Sluggers</h1>
          <p className="mt-3 max-w-2xl text-sm text-barn-muted sm:text-base">
            View upcoming softball tournament details, then use the official registration form and tournament resources below.
          </p>
        </div>
      </section>

      <section className="interior-section border-t border-barn-border bg-barn-cream">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Softball tournament resources</p>
          <h2 className="mt-2 interior-subheading">Playing rules, age requirements and tournament information</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {publicResources.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-sm border border-barn-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-barn-green">
                <FileText className="size-5 shrink-0 text-gold" />
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold uppercase text-barn-navy">{label}</span>
                  <span className="mt-1 block text-xs font-semibold tracking-[.12em] text-barn-green uppercase group-hover:text-barn-navy">View PDF <ArrowUpRight className="ml-1 inline size-3" /></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
        <div className="mx-auto grid max-w-7xl gap-5">
          {publicTournaments.map((tournament) => {
            const locations = "locations" in tournament && Array.isArray(tournament.locations) ? tournament.locations : [];
            const legacyLocationText = `${tournament.location}${"address" in tournament && tournament.address
                ? `, ${tournament.address}`
                : `, ${"city" in tournament ? tournament.city : ""}, ${"state" in tournament ? tournament.state : ""}`}`;
            const hasMultipleLocations = locations.length > 1 || tournament.id === "sluggers-softball-tournament-series-2027";

            return <article
              key={tournament.id}
              id={tournament.id}
              className="scroll-mt-24 overflow-hidden rounded-sm border border-barn-border bg-white lg:grid lg:grid-cols-[minmax(140px,19%)_1fr]"
            >
              <div className="flex items-center justify-center self-stretch border-b border-barn-border bg-barn-cream px-3 py-4 lg:border-r lg:border-b-0 lg:px-2 lg:py-5">
                <TournamentPosterButton
                  src={tournament.poster}
                  alt={`${tournament.name} tournament poster`}
                  landscape={tournament.id === "sluggers-softball-tournament-series-2027"}
                />
              </div>
              <div>
                <div className="border-b border-barn-green bg-barn-green px-5 py-3 sm:px-6">
                  <h2 className="font-display text-xl font-bold uppercase leading-tight text-barn-cream sm:text-2xl">
                    {tournament.name}
                  </h2>
                </div>
                <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <dl className="grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-barn-navy">Dates</dt>
                        <dd className="text-barn-muted">{tournament.dates}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-barn-navy">
                          {hasMultipleLocations ? "Locations" : "Location"}
                        </dt>
                        <dd className="text-barn-muted">
                          {locations.length
                            ? locations.map((location, index) => <span key={`${location}-${index}`} className="block">{location}</span>)
                            : legacyLocationText}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-barn-navy">Age groups</dt>
                        <dd className="text-barn-muted">{tournament.ageGroups}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-barn-navy">Status</dt>
                        <dd className="text-barn-muted">{statusLabel(tournament.registrationStatus)}</dd>
                      </div>
                    </dl>
                    {tournament.gameGuarantee ? (
                      <p className="mt-2 text-sm text-barn-muted">
                        <span className="font-semibold text-barn-navy">Format:</span> {tournament.gameGuarantee}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm text-barn-muted">{tournament.details}</p>
                  </div>
                  <div className="flex flex-col gap-3 lg:w-[190px]">
                    <p className="whitespace-nowrap font-display text-2xl font-bold text-barn-navy sm:text-3xl">
                      {tournament.registrationFeeLabel || formatPrice(tournament.registrationFeeCents)}
                    </p>
                    <TournamentDocumentAction
                      url={tournament.registrationForm}
                      tournamentName={tournament.name}
                      downloadName={tournament.registrationFormDownload}
                    />
                    {"registrationUrl" in tournament && tournament.registrationUrl ? (
                      <a href={tournament.registrationUrl} className="btn-primary-green w-full text-center">Register online</a>
                    ) : (
                      <TournamentRegistrationForm
                        tournamentId={tournament.id}
                        tournament={tournament.name}
                        variant={tournament.registrationVariant ?? "standard"}
                        depositAmount={"depositAmount" in tournament ? tournament.depositAmount : ""}
                        registrationPhone={"registrationPhone" in tournament ? tournament.registrationPhone : ""}
                      />
                    )}
                  </div>
                </div>
              </div>
            </article>;
          })}
        </div>
      </section>

      <section className="interior-section border-t border-barn-border bg-white">
        <div className="mx-auto max-w-7xl rounded-sm border border-gold/40 border-l-4 border-l-gold bg-barn-cream/60 px-5 py-5 sm:px-7 sm:py-6">
          <p className="eyebrow text-xs">Multi-tournament savings</p>
          <h2 className="mt-1.5 interior-subheading">{multiTournamentDiscount.headline}</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] lg:gap-8">
            <p className="max-w-[74ch] text-sm leading-relaxed text-barn-muted sm:text-base">
              {emphasizeTournamentAmounts(multiTournamentDiscount.description)}
            </p>
            <p className="border-t border-gold/35 pt-4 text-sm leading-relaxed text-barn-muted lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              {emphasizeTournamentAmounts(multiTournamentDiscount.note)}
            </p>
          </div>
        </div>
      </section>

      <section className="interior-cta bg-obsidian">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Upcoming softball tournaments</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase text-barn-cream sm:text-4xl">Ready to register?</h2>
          </div>
          <a href={sluggersLinks.registrationForm} target="_blank" rel="noreferrer" className="bg-gold px-6 py-3 text-sm font-bold tracking-[.14em] text-obsidian uppercase">
            Open Registration Form <ArrowUpRight className="ml-1 inline size-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
