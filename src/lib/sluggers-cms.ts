import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";
import { getSluggersTenantId, isSluggersCmsConfigured } from "@/lib/sluggers-config";
import { isSluggersTenantRecord } from "@/lib/sluggers-tenant";

export const contentTypes = [
  "tournament",
  "tournament_resource",
  "staff",
  "travel_team_coach",
  "business_staff",
  "training_offering",
  "program",
  "facility_section",
  "facility_stat",
  "homepage",
  "site_settings",
] as const;

export type ContentType = (typeof contentTypes)[number];

export type ContentItem = {
  id: string;
  tenant_id: string;
  content_type: ContentType;
  slug: string;
  title: string;
  data: Record<string, unknown>;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function listContent(
  db: SupabaseClient,
  tenantId: string,
  contentType?: ContentType,
) {
  let query = db
    .from("tenant_content_items")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (contentType) query = query.eq("content_type", contentType);
  return query;
}

export async function saveContent(
  db: SupabaseClient,
  tenantId: string,
  input: {
    id?: string;
    content_type: ContentType;
    slug: string;
    title: string;
    data: Record<string, unknown>;
    published: boolean;
    sort_order: number;
  },
) {
  if (input.id) {
    return db
      .from("tenant_content_items")
      .update({
        content_type: input.content_type,
        slug: input.slug,
        title: input.title,
        data: input.data,
        published: input.published,
        sort_order: input.sort_order,
      })
      .eq("id", input.id)
      .eq("tenant_id", tenantId)
      .select()
      .single();
  }

  return db
    .from("tenant_content_items")
    .insert({ ...input, tenant_id: tenantId })
    .select()
    .single();
}

export async function deleteContent(db: SupabaseClient, tenantId: string, id: string) {
  return db
    .from("tenant_content_items")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);
}

export function dataString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

export function dataBoolean(data: Record<string, unknown>, key: string) {
  return data[key] === true;
}

export type PublicContentState = {
  published: ContentItem[];
  managedSlugs: string[];
  cmsManaged: boolean;
};

/**
 * Public reads are deliberately best-effort so an unconfigured CMS never blanks the site.
 * managedSlugs includes unpublished records so a hidden CMS item is not reintroduced by a
 * code-defined fallback with the same slug.
 */
export async function getPublicContentState(contentType: ContentType): Promise<PublicContentState> {
  if (!isSluggersCmsConfigured()) return { published: [], managedSlugs: [], cmsManaged: false };
  try {
    const db = createServiceClient();
    const tenantId = getSluggersTenantId();
    const { data: tenant } = await db.from("tenants").select("slug, display_name").eq("id", tenantId).maybeSingle();
    if (!isSluggersTenantRecord(tenant)) return { published: [], managedSlugs: [], cmsManaged: false };
    const { data } = await db
      .from("tenant_content_items")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("content_type", contentType)
      .order("sort_order", { ascending: true });
    const items = (data ?? []) as ContentItem[];
    return {
      published: items.filter((item) => item.published),
      managedSlugs: items.map((item) => item.slug),
      cmsManaged: items.some((item) => item.data.cmsManaged === true),
    };
  } catch {
    return { published: [], managedSlugs: [], cmsManaged: false };
  }
}

export async function listPublishedContent(contentType: ContentType): Promise<ContentItem[]> {
  return (await getPublicContentState(contentType)).published;
}
