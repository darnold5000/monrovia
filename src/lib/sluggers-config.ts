export function getSluggersTenantId(): string {
  const tenantId = process.env.TENANT_ID?.trim();
  if (!tenantId) throw new Error("TENANT_ID is not configured.");
  return tenantId;
}

export function isSluggersCmsConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.TENANT_ID,
  );
}
