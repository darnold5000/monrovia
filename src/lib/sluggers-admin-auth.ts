import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSluggersTenantId, isSluggersCmsConfigured } from "@/lib/sluggers-config";
import { isSluggersTenantRecord } from "@/lib/sluggers-tenant";

export type SluggersAdminRole = "platform_admin" | "tenant_owner" | "tenant_member" | "staff";

/**
 * Gate CMS administration with the production Signal Works permission model.
 * The service client is used only after the authenticated user's permission
 * has been verified through the cookie-bound Supabase client.
 */
export async function requireSluggersStaff() {
  if (!isSluggersCmsConfigured()) {
    redirect("/login?error=cms_unavailable");
  }

  const tenantId = getSluggersTenantId();
  const serviceDb = createServiceClient();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: tenant } = await serviceDb
    .from("tenants")
    .select("id, slug, display_name")
    .eq("id", tenantId)
    .maybeSingle();

  const tenantValidationPassed = Boolean(tenant && tenant.id === tenantId && isSluggersTenantRecord(tenant));
  console.info("[sluggers tenant validation]", {
    configuredTenantId: tenantId,
    resolvedTenantId: tenant?.id ?? null,
    resolvedTenantSlug: tenant?.slug ?? null,
    resolvedTenantDisplayName: tenant?.display_name ?? null,
    tenantValidationPassed,
    authenticatedUserId: user?.id ?? null,
  });

  if (!tenantValidationPassed) {
    redirect("/login?error=tenant_misconfigured");
  }

  if (!user) redirect("/login?returnTo=/admin");

  const { data: allowed, error: permissionError } = await supabase.rpc("has_tenant_permission", {
    target_tenant_id: tenantId,
    permission_name: "manage_website",
  });

  console.info("[sluggers tenant permission]", {
    configuredTenantId: tenantId,
    authenticatedUserId: user.id,
    permissionPassed: Boolean(allowed && !permissionError),
  });

  if (permissionError || !allowed) {
    redirect("/login?error=staff_not_authorized");
  }

  const { data: membership } = await serviceDb
    .from("tenant_memberships")
    .select("roles(slug)")
    .eq("tenant_id", tenantId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const role = ((membership?.roles as { slug?: string } | null)?.slug ?? "staff") as SluggersAdminRole;
  return { user, db: serviceDb, tenantId, role };
}
