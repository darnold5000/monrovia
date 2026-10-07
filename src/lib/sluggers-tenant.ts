export const SLUGGERS_TENANT_SLUGS = new Set([
  "sluggers",
  "sluggers-indoor-baseball-softball",
  "sluggers-indoor-baseball-softball-complex",
  "sluggers-indoor-complex",
  "sluggers-of-ohio",
]);

export function isSluggersTenantRecord(record: { slug?: string | null; display_name?: string | null; name?: string | null } | null | undefined) {
  if (!record) return false;
  return [record.display_name, record.name].some((value) => ["sluggers indoor baseball & softball", "sluggers indoor baseball & softball complex", "sluggers of ohio"].includes(value?.trim().toLowerCase() ?? ""))
    || SLUGGERS_TENANT_SLUGS.has(record.slug?.trim().toLowerCase() ?? "");
}
