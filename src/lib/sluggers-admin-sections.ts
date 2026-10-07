import type { ContentType } from "@/lib/sluggers-cms";

export type AdminOption = { label: string; value: string };

export type AdminField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "url" | "email" | "tel" | "date" | "file" | "select" | "checkboxes" | "string-list";
  placeholder?: string;
  help?: string;
  accept?: string;
  targetKey?: string;
  advanced?: boolean;
  options?: readonly AdminOption[];
};

export type AdminSection = {
  type: ContentType;
  title: string;
  singular: string;
  description: string;
  emptyText: string;
  titleLabel: string;
  deriveTitleFrom?: string;
  singleton?: boolean;
  fields: readonly AdminField[];
};

const sportOptions = [
  { label: "Baseball", value: "baseball" },
  { label: "Softball", value: "softball" },
  { label: "Other", value: "other" },
] as const;

const trainingTypeOptions = [
  { label: "Hitting", value: "Hitting" },
  { label: "Pitching", value: "Pitching" },
  { label: "Fielding", value: "Fielding" },
  { label: "Player Development", value: "Player Development" },
  { label: "Fitness", value: "Fitness" },
  { label: "Other", value: "Other" },
] as const;

export const adminSections: Record<string, AdminSection> = {
  tournaments: {
    type: "tournament",
    title: "Tournaments",
    singular: "Tournament",
    titleLabel: "Tournament Name",
    description: "Add, edit, hide, or remove upcoming tournaments.",
    emptyText: "No tournaments yet. Add your first tournament to get started.",
    fields: [
      { key: "startDate", label: "Start Date", kind: "date" },
      { key: "endDate", label: "End Date", kind: "date" },
      {
        key: "locations",
        label: "Locations",
        kind: "string-list",
        help: "Enter each facility and its city/state as a separate location.",
      },
      { key: "ageGroups", label: "Age Groups", placeholder: "8U through High School" },
      { key: "format", label: "Game Guarantee / Format", placeholder: "4-game guarantee" },
      { key: "registrationFee", label: "Registration Fee", placeholder: "$450" },
      { key: "status", label: "Status", kind: "select", options: [
        { label: "Registration Open", value: "open" },
        { label: "Coming Soon", value: "coming-soon" },
        { label: "Closing Soon", value: "closing-soon" },
        { label: "Sold Out", value: "sold-out" },
        { label: "Closed", value: "closed" },
        { label: "Completed", value: "completed" },
      ] },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "registrationUrl", label: "Registration Link (optional)", help: "Leave blank to use the built-in online registration form." },
      { key: "depositAmount", label: "Online Registration Deposit Amount (optional)", placeholder: "$100", help: "Leave blank to use $100 for standard tournaments or $150 for the 2027 tournament series." },
      { key: "registrationPhone", label: "Online Registration Phone (optional)", placeholder: "330-501-7506", help: "Leave blank to use 330-501-7506 for standard tournaments or 330-549-6150 for the 2027 tournament series." },
      { key: "registrationVariant", label: "Online Registration Form", kind: "select", advanced: true, options: [
        { label: "Standard Tournament", value: "standard" },
        { label: "2027 Tournament Series", value: "series" },
      ] },
      { key: "flyerFile", targetKey: "flyerUrl", label: "Tournament Flyer", kind: "file", accept: "image/jpeg,image/png,image/webp", help: "JPG, PNG, or WebP up to 10 MB." },
      {
        key: "registrationFormFile",
        targetKey: "registrationFormUrl",
        label: "Registration Form",
        kind: "file",
        accept: "application/pdf,image/jpeg,image/png,image/webp",
        help: "Upload a PDF, JPG, PNG, or WebP file up to 10 MB. This is the file downloaded from the tournament card.",
      },
      { key: "flyerUrl", label: "External Flyer URL", kind: "url", advanced: true },
      { key: "registrationFormUrl", label: "External Registration Form URL", kind: "url", advanced: true },
    ],
  },
  "tournament-resources": {
    type: "tournament_resource",
    title: "Tournament Documents",
    singular: "Document",
    titleLabel: "Document Name",
    description: "Update playing rules, age charts, and other tournament PDFs.",
    emptyText: "No tournament documents yet. Add your first document to get started.",
    fields: [
      { key: "pdfFile", targetKey: "url", label: "Upload PDF", kind: "file", accept: "application/pdf", help: "PDF files up to 10 MB." },
      { key: "description", label: "Description (optional)", kind: "textarea" },
      { key: "url", label: "External Link", kind: "url", advanced: true, help: "Use only when the document is hosted outside this website." },
    ],
  },
  training: {
    type: "training_offering",
    title: "Training",
    singular: "Training Option",
    titleLabel: "Training Name",
    description: "Update training options, descriptions, photos, and contact links.",
    emptyText: "No training options yet. Add your first option to get started.",
    fields: [
      { key: "sport", label: "Sport", kind: "select", options: sportOptions },
      { key: "category", label: "Training Type", kind: "select", options: trainingTypeOptions },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "imageFile", targetKey: "imageUrl", label: "Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "duration", label: "Session Length", placeholder: "45 minutes" },
      { key: "displayPrice", label: "Price / Display Price", placeholder: "Contact for availability and pricing" },
      { key: "ctaUrl", label: "Learn More / Contact Link", placeholder: "/availability?calendar=upstairs" },
      { key: "imageUrl", label: "External Image URL", kind: "url", advanced: true },
      { key: "ctaLabel", label: "Button Label", advanced: true, placeholder: "Request a Lesson" },
    ],
  },
  staff: {
    type: "staff",
    title: "Staff",
    singular: "Staff Member",
    titleLabel: "Name",
    description: "Manage staff photos, bios, roles, and specialties.",
    emptyText: "No staff members yet. Add your first staff member to get started.",
    fields: [
      { key: "role", label: "Title / Role", placeholder: "Baseball & Softball Instructor" },
      { key: "photoFile", targetKey: "photoUrl", label: "Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "bio", label: "Bio", kind: "textarea" },
      { key: "specialties", label: "Specialties", kind: "checkboxes", options: [
        { label: "Hitting", value: "Hitting" },
        { label: "Pitching", value: "Pitching" },
        { label: "Fielding", value: "Fielding" },
        { label: "Catching", value: "Catching" },
        { label: "Player Development", value: "Player Development" },
        { label: "Strength", value: "Strength" },
        { label: "Conditioning", value: "Conditioning" },
        { label: "Athletic Performance", value: "Athletic Performance" },
      ] },
      { key: "email", label: "Email (optional)" },
      { key: "phone", label: "Phone (optional)" },
      { key: "sport", label: "Primary Discipline", kind: "select", advanced: true, options: [
        { label: "Baseball & Softball", value: "baseball,softball" },
        { label: "Baseball", value: "baseball" },
        { label: "Softball", value: "softball" },
        { label: "Fitness", value: "fitness" },
      ] },
      { key: "photoUrl", label: "External Photo URL", kind: "url", advanced: true },
    ],
  },
  "travel-teams": {
    type: "travel_team_coach",
    title: "Sluggers Travel Teams",
    singular: "Travel Team Coach",
    titleLabel: "Coach Name",
    description: "Add, update, hide, or remove travel team coaches and their contact information.",
    emptyText: "No travel team coaches yet. Add the first coach to get started.",
    fields: [
      { key: "photoFile", targetKey: "photoUrl", label: "Coach Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "teamName", label: "Team Name", placeholder: "Sluggers 8U Girls" },
      { key: "email", label: "Email", kind: "email", placeholder: "coach@example.com" },
      { key: "phone", label: "Phone Number", kind: "tel", placeholder: "330-555-0100" },
      { key: "photoUrl", label: "External Photo URL", kind: "url", advanced: true },
    ],
  },
  "our-staff": {
    type: "business_staff",
    title: "Our Staff",
    singular: "Staff Member",
    titleLabel: "Staff Member Name",
    description: "Add, update, hide, or remove staff photos and roles shown on the Our Staff page.",
    emptyText: "No staff members yet. Add the first staff member to get started.",
    fields: [
      { key: "photoFile", targetKey: "photoUrl", label: "Staff Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "role", label: "Role", placeholder: "Owner / Facility Manager" },
      { key: "photoUrl", label: "External Photo URL", kind: "url", advanced: true },
    ],
  },
  facility: {
    type: "facility_section",
    title: "Facility",
    singular: "Facility Section",
    titleLabel: "Section Name",
    description: "Update facility areas, descriptions, and photos.",
    emptyText: "No facility sections yet. Add the first section to get started.",
    fields: [
      { key: "description", label: "Description", kind: "textarea" },
      { key: "imageFile", targetKey: "imageUrl", label: "Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "imageUrl", label: "External Image URL", kind: "url", advanced: true },
      { key: "secondaryImageUrl", label: "Secondary Image URL", kind: "url", advanced: true },
    ],
  },
  "facility-stats": {
    type: "facility_stat",
    title: "Facility Highlights",
    singular: "Facility Highlight",
    titleLabel: "Highlight Name",
    deriveTitleFrom: "label",
    description: "Edit the short highlights shown near the top of the Facility page.",
    emptyText: "No facility highlights yet. Add the first highlight to get started.",
    fields: [
      { key: "label", label: "Label", placeholder: "9,000+ SQ FT" },
      { key: "value", label: "Value (optional)", placeholder: "Indoor Turf" },
    ],
  },
  homepage: {
    type: "homepage",
    title: "Homepage",
    singular: "Homepage",
    titleLabel: "Internal Name",
    singleton: true,
    description: "Change the main photo and featured homepage text.",
    emptyText: "Homepage content has not been set up yet.",
    fields: [
      { key: "heroImageFile", targetKey: "heroImageUrl", label: "Main Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "headline", label: "Main Headline" },
      { key: "heroDescription", label: "Short Supporting Text", kind: "textarea" },
      { key: "introHeading", label: "Introduction Heading" },
      { key: "introBody", label: "Introduction Text", kind: "textarea" },
      { key: "closingStatement", label: "Closing Statement", kind: "textarea" },
      { key: "featuredAnnouncement", label: "Optional Featured Announcement", kind: "textarea", help: "Leave blank to show no announcement." },
      { key: "heroImageUrl", label: "External Main Photo URL", kind: "url", advanced: true },
    ],
  },
  settings: {
    type: "site_settings",
    title: "Contact & Social",
    singular: "Contact & Social Settings",
    titleLabel: "Internal Name",
    singleton: true,
    description: "Update business contact details, directions, and social links.",
    emptyText: "Contact and social settings have not been set up yet.",
    fields: [
      { key: "businessName", label: "Business Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address", kind: "textarea" },
      { key: "facebook", label: "Facebook", kind: "url" },
      { key: "instagram", label: "Instagram", kind: "url" },
      { key: "x", label: "X / Twitter", kind: "url" },
      { key: "yelp", label: "Yelp", kind: "url" },
      { key: "mapsUrl", label: "Directions Link", kind: "url" },
      { key: "playingFieldCalendarId", label: "Playing Field Calendar ID", advanced: true },
      { key: "upstairsCalendarId", label: "Upstairs Hitting Lane Calendar ID", advanced: true },
      { key: "timezone", label: "Timezone", advanced: true, placeholder: "America/New_York" },
    ],
  },
  programs: {
    type: "program",
    title: "Programs",
    singular: "Program",
    titleLabel: "Program Name",
    description: "Prepare camps, clinics, events, and seasonal programs for future use.",
    emptyText: "No programs yet. Add one when Sluggers is ready to feature programs.",
    fields: [
      { key: "type", label: "Program Type", kind: "select", options: [
        { label: "Camp", value: "Camp" },
        { label: "Clinic", value: "Clinic" },
        { label: "Birthday Party", value: "Birthday Party" },
        { label: "Team Event", value: "Team Event" },
        { label: "League", value: "League" },
        { label: "Other", value: "Other" },
      ] },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "imageFile", targetKey: "imageUrl", label: "Photo", kind: "file", accept: "image/jpeg,image/png,image/webp" },
      { key: "dates", label: "Dates" },
      { key: "ageRange", label: "Age Range" },
      { key: "registrationUrl", label: "Registration / Contact Link", kind: "url" },
      { key: "status", label: "Status", kind: "select", options: [
        { label: "Coming Soon", value: "coming-soon" },
        { label: "Registration Open", value: "open" },
        { label: "Closed", value: "closed" },
      ] },
      { key: "imageUrl", label: "External Image URL", kind: "url", advanced: true },
    ],
  },
};

export function publicPathsForSection(section: string) {
  if (section === "tournaments") return ["/tournaments", "/"];
  if (section === "tournament-resources") return ["/tournaments"];
  if (section === "training") return ["/training"];
  if (section === "staff") return ["/training", "/staff"];
  if (section === "travel-teams") return ["/travel-teams"];
  if (section === "our-staff") return ["/our-staff"];
  if (section === "facility" || section === "facility-stats") return ["/facility"];
  if (section === "settings") return ["/", "/contact", "/availability"];
  return ["/"];
}
