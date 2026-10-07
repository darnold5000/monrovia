import { instructors, type Instructor } from "@/content/instructors";
import { getPublicContentState } from "@/lib/sluggers-cms";

export type PublicStaffMember = Omit<Instructor, "active"> & {
  slug: string;
};

function normalized(value: string) {
  return value.trim().toLowerCase();
}

function staffPriority(name: string): number {
  const value = normalized(name);
  if (value.includes("bill") || value.includes("amero")) return 1;
  if (value.includes("tony") || value.includes("sarigianopolous")) return 2;
  if (value.includes("victoria") || value.includes("victoris")) return 3;
  return 10;
}

function defaultInstructor(slug: string, name: string) {
  const normalizedName = normalized(name);
  return instructors.find((instructor) =>
    instructor.id === slug
    || normalized(instructor.name) === normalizedName
    || (instructor.id === "victoria" && normalizedName.includes("victoria")),
  );
}

function parseSports(value: unknown, fallback: Instructor["sports"]): Instructor["sports"] {
  const sports = String(value ?? "")
    .toLowerCase()
    .split(",")
    .map((sport) => sport.trim())
    .filter((sport): sport is Instructor["sports"][number] => ["baseball", "softball", "fitness"].includes(sport));
  return sports.length ? sports : fallback;
}

export async function getPublicStaff(): Promise<PublicStaffMember[]> {
  const staffState = await getPublicContentState("staff");
  const managedStaffSlugs = new Set(staffState.managedSlugs);
  const managedDefaultIds = new Set(
    staffState.published
      .map((item) => defaultInstructor(item.slug, item.title)?.id)
      .filter((id): id is string => Boolean(id)),
  );
  const cmsStaff = staffState.published.map((item): PublicStaffMember => {
    const matched = defaultInstructor(item.slug, item.title);
    const legacyFallback = matched ?? instructors[0];
    const specialties = String(item.data.specialties ?? "")
      .split(",")
      .map((specialty) => specialty.trim())
      .filter(Boolean);

    const cmsPhoto = String(item.data.photoUrl ?? "");
    const cmsRole = String(item.data.role ?? "");
    const cmsBio = String(item.data.bio ?? "");
    const cmsPhone = String(item.data.phone ?? "");

    return {
      id: item.id,
      slug: item.slug,
      name: item.title,
      photo: staffState.cmsManaged
        ? cmsPhoto
        : matched
          ? legacyFallback.photo
          : cmsPhoto || legacyFallback.photo,
      role: staffState.cmsManaged ? cmsRole : cmsRole || legacyFallback.role,
      bio: staffState.cmsManaged ? cmsBio : cmsBio || legacyFallback.bio,
      phone: staffState.cmsManaged ? cmsPhone : cmsPhone || legacyFallback.phone,
      specialties: specialties.length
        ? specialties
        : staffState.cmsManaged
          ? []
          : legacyFallback.specialties,
      sports: staffState.cmsManaged
        ? parseSports(item.data.sport, [])
        : parseSports(item.data.sport, legacyFallback.sports),
    };
  });

  const staff = staffState.cmsManaged
    ? cmsStaff
    : [
      ...cmsStaff,
      ...instructors
        .filter((instructor) => instructor.active)
        .filter((instructor) =>
          !managedStaffSlugs.has(instructor.id)
          && !managedDefaultIds.has(instructor.id)
          && !cmsStaff.some((item) => normalized(item.name) === normalized(instructor.name)),
        )
        .map((instructor): PublicStaffMember => ({
        id: instructor.id,
        slug: instructor.id,
        name: instructor.name,
        photo: instructor.photo,
        role: instructor.role,
        bio: instructor.bio,
        phone: instructor.phone,
        specialties: instructor.specialties,
        sports: instructor.sports,
        })),
    ];

  return staff.sort((a, b) => staffPriority(a.name) - staffPriority(b.name) || a.name.localeCompare(b.name));
}
