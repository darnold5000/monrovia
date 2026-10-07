import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tenantId = process.env.TENANT_ID;
if (!url || !key || !tenantId) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or TENANT_ID.");

class DisabledWebSocket {}
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: DisabledWebSocket },
});
const { data: tenant, error: tenantError } = await db
  .from("tenants")
  .select("id, slug, display_name")
  .eq("id", tenantId)
  .maybeSingle();

if (tenantError) throw new Error(`Could not validate TENANT_ID: ${tenantError.message}`);
const normalizedName = tenant?.display_name?.trim().toLowerCase();
const normalizedSlug = tenant?.slug?.trim().toLowerCase();
const isSluggersTenant = normalizedName === "sluggers indoor baseball & softball"
  || normalizedName === "sluggers indoor baseball & softball complex"
  || normalizedName === "sluggers of ohio"
  || ["sluggers", "sluggers-indoor-baseball-softball", "sluggers-indoor-baseball-softball-complex", "sluggers-indoor-complex", "sluggers-of-ohio"].includes(normalizedSlug);

if (!tenant || tenant.id !== tenantId || !isSluggersTenant) {
  throw new Error(
    `Refusing to seed: TENANT_ID ${tenantId} is not the Sluggers tenant (found ${tenant?.slug ?? "no tenant"} / ${tenant?.display_name ?? "no tenant"}).`,
  );
}

const item = (content_type, slug, title, data, sort_order = 0, published = true) => ({ tenant_id: tenantId, content_type, slug, title, data: { cmsManaged: true, ...data }, sort_order, published });

const rows = [
  item("tournament", "hydrocephalus-fundraiser-2026", "Hydrocephalus Fundraiser Softball Tournament", { startDate: "2026-09-26", endDate: "2026-09-27", location: "Springfield High School", address: "New Middletown, Ohio", locations: ["Springfield High School, New Middletown, Ohio"], ageGroups: "8U through High School", registrationFee: "$440", format: "", status: "open", description: "Fundraiser tournament with proceeds supporting the Hydrocephalus Association.", flyerUrl: "/images/sluggers/tournaments/hydrocephalus-fundraiser-2026.png", registrationFormUrl: "/documents/sluggers-fall-tournaments-2026-registration-form.pdf", featured: true }, 1),
  item("tournament", "fall-brawl-2026", "Sluggers Fall Brawl", { startDate: "2026-10-17", endDate: "2026-10-18", location: "Springfield High School", address: "11335 Youngstown-Pittsburgh Road, New Middletown, Ohio", locations: ["Springfield High School, 11335 Youngstown-Pittsburgh Road, New Middletown, Ohio"], ageGroups: "8U through High School", registrationFee: "$450", format: "4-game guarantee", status: "open", description: "Season-ending fall classic for travel and school teams across Northeast Ohio.", flyerUrl: "/images/sluggers/tournaments/fall-brawl-2026.png", registrationFormUrl: "/documents/sluggers-fall-tournaments-2026-registration-form.pdf", featured: true }, 2),
  item("tournament", "sluggers-softball-tournament-series-2027", "2027 Sluggers Softball Tournament Series", { startDate: "2027-04-30", endDate: "2027-07-05", location: "Multiple Northeast Ohio locations", address: "Springfield High School, Fields of Dreams & McCune Fields", locations: ["Springfield High School, New Middletown, Ohio", "Fields of Dreams, Boardman, Ohio", "McCune Fields, Canfield, Ohio"], ageGroups: "8U–14U; select 16U & 18U divisions", registrationFee: "$495", format: "Seven tournament dates with multi-tournament discounts", status: "open", description: "Choose from May Madness, Spring Fling, Stars & Stripes Classic, June Sluggfest, Father’s Day Battle, June Rumble, and Firecracker Frenzy.", flyerUrl: "/images/sluggers/tournaments/2027-softball-tournament-series-discounts.jpg", registrationFormUrl: "/documents/2027-sluggers-softball-tournament-series-registration.pdf", registrationVariant: "series", featured: false }, 3),
  item("tournament_resource", "8u-playing-rules", "8U Playing Rules", { resourceType: "bundled PDF", url: "/documents/2027-playing-rules-8u.pdf" }, 1),
  item("tournament_resource", "tournament-rules-guidelines", "Tournament Rules and Guidelines", { resourceType: "bundled PDF", url: "/documents/2027-playing-rules-70-minutes.pdf" }, 2),
  item("tournament_resource", "2027-player-age-chart", "2027 Player Age Chart", { resourceType: "bundled PDF", url: "/documents/2027-player-age-chart.pdf" }, 3),
  item("staff", "bill-amero", "Bill Amero", { cmsManaged: true, role: "Baseball & Softball Instructor", bio: "Baseball and softball instruction focused on player development, mechanics, and game-ready training.", specialties: "Hitting, Pitching, Player Development", sport: "baseball,softball", phone: "330-549-6150", photoUrl: "/images/sluggers/coaches/bill-amero-2026.jpg" }, 1),
  item("staff", "tony-sarigianopolous", "Tony Sarigianopolous", { cmsManaged: true, role: "Fitness / Athletic Development", bio: "Fitness and athletic development training to support baseball and softball athletes at Sluggers.", specialties: "Strength, Conditioning, Athletic Performance", sport: "fitness", phone: "330-207-6269", photoUrl: "/images/sluggers/coaches/tony-sarigianopolous-2026.jpg" }, 2),
  item("staff", "victoria", "Victoria", { cmsManaged: true, role: "Softball Instructor", bio: "Softball Instructor.", specialties: "Hitting, Pitching, Fielding, Player Development", sport: "softball", phone: "330-207-6269", photoUrl: "/images/sluggers/coaches/victoria.jpg" }, 3),
  ...Array.from({ length: 6 }, (_, index) => item("travel_team_coach", `travel-team-coach-${index + 1}`, `Travel Team Coach ${index + 1}`, { photoUrl: "", teamName: "", email: "", phone: "" }, index + 1)),
  ...Array.from({ length: 4 }, (_, index) => item("business_staff", `staff-member-${index + 1}`, `Staff Member ${index + 1}`, { photoUrl: "", role: "" }, index + 1)),
  item("training_offering", "baseball-hitting", "Baseball Hitting Lesson", { sport: "baseball", category: "Hitting", description: "One-on-one hitting instruction focused on mechanics, timing, and game-ready practice.", imageUrl: "/images/sluggers/training/baseball-hitting.png", duration: "45 minutes", displayPrice: "Contact for availability and pricing", ctaLabel: "Request a Lesson", ctaUrl: "/availability?calendar=upstairs&service=small-group-training" }, 1),
  item("training_offering", "baseball-pitching", "Baseball Pitching Lesson", { sport: "baseball", category: "Pitching", description: "Pitching instruction built around mechanics, command, and player-specific development.", imageUrl: "/images/sluggers/training/baseball-pitching.png", imagePosition: "center 20%", duration: "60 minutes", displayPrice: "Contact for availability and pricing", ctaLabel: "Request a Lesson", ctaUrl: "/availability?calendar=upstairs&service=baseball-lesson" }, 2),
  item("training_offering", "softball-hitting", "Softball Hitting Lesson", { sport: "softball", category: "Hitting", description: "Softball hitting development with individualized instruction and quality reps.", imageUrl: "/images/sluggers/training/softball-hitting.png", duration: "45 minutes", displayPrice: "Contact for availability and pricing", ctaLabel: "Request a Lesson", ctaUrl: "/availability?calendar=upstairs&service=small-group-training" }, 3),
  item("training_offering", "softball-pitching", "Softball Pitching Lesson", { sport: "softball", category: "Pitching", description: "Softball pitching instruction focused on mechanics and confidence in the circle.", imageUrl: "/images/sluggers/training/softball-pitching.png", imagePosition: "center 25%", duration: "60 minutes", displayPrice: "Contact for availability and pricing", ctaLabel: "Request a Lesson", ctaUrl: "/availability?calendar=upstairs&service=softball-lesson" }, 4),
  item("facility_section", "main", "Main Turf", { description: "Sluggers supports team practices, hitting, pitching, scrimmages, individual work, and both baseball and softball development on the main turf.", imageUrl: "/images/sluggers/facility/main-turf-field.png", secondaryImageUrl: "/images/sluggers/facility/main-turf-wide.png" }, 1),
  item("facility_section", "upstairs", "Upstairs Hitting / Pitching Area", { description: "A dedicated upstairs training area suited for individual work, small groups, hitting stations, and pitching development.", imageUrl: "/images/sluggers/facility/upstairs-pitching-lane.png", secondaryImageUrl: "/images/sluggers/facility/upstairs-training.png" }, 2),
  item("facility_stat", "square-footage", "9,000+ SQ FT TURF", { label: "9,000+ SQ FT TURF", value: "" }, 1),
  item("facility_stat", "sports-supported", "BASEBALL & SOFTBALL", { label: "BASEBALL & SOFTBALL", value: "" }, 2),
  item("facility_stat", "small-group-training", "SMALL-GROUP TRAINING", { label: "SMALL-GROUP TRAINING", value: "" }, 3),
  item("facility_stat", "team-practice-rentals", "TEAM PRACTICE & RENTALS", { label: "TEAM PRACTICE & RENTALS", value: "" }, 4),
  item("homepage", "homepage", "Homepage Content", { eyebrow: "Poland, Ohio · Indoor Baseball & Softball", headline: "Sluggers Indoor Baseball & Softball", tagline: "Train. Compete. Develop.", heroDescription: "Indoor baseball and softball training, team practices, tournaments, and more in Poland, Ohio.", heroImageUrl: "/images/sluggers/facility/main-turf-wide.png", introEyebrow: "Welcome to Sluggers", introHeading: "Northeast Ohio's indoor home for baseball & softball", introBody: "Sluggers Indoor Baseball & Softball Complex is Northeast Ohio's premier indoor training facility for players and teams of all ages. We offer team practices, private hitting, pitching and fielding instruction, summer softball tournaments, birthday parties and more!", closingStatement: "At Sluggers, there's always something happening—so come join the action!", featuredAnnouncement: "" }),
  item("site_settings", "site-settings", "Site Settings", { businessName: "Sluggers Indoor Baseball & Softball", phone: "330-549-6150", email: "sluggers.ohio@gmail.com", address: "9862 South Ave.\nPoland, OH 44514", facebook: "https://www.facebook.com/SluggersIndoorComplex/", instagram: "https://www.instagram.com/Sluggersofohio", x: "https://x.com/SluggersofOhio1", yelp: "https://www.yelp.com/biz/sluggers-of-ohio-youngstown", mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=9862+South+Ave.,+Poland,+OH+44514", playingFieldCalendarId: "sluggers.ohio@gmail.com", upstairsCalendarId: "dfc83902467c36e1aa925eb56ba27cd29a1cd5c0900408bd498a1705e73462dc@group.calendar.google.com", timezone: "America/New_York" }),
];

const { error } = await db.from("tenant_content_items").upsert(rows, { onConflict: "tenant_id,content_type,slug" });
if (error) throw error;
console.log(`Seeded ${rows.length} Sluggers CMS records for ${tenantId}.`);
