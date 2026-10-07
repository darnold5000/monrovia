#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tenantId = process.env.TENANT_ID;
if (!url || !key || !tenantId) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or TENANT_ID.");
}

class DisabledWebSocket {}
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: DisabledWebSocket },
});
const host = new URL(url).host;
const { data: tenant, error: tenantError } = await db
  .from("tenants")
  .select("id, slug, display_name, status")
  .eq("id", tenantId)
  .maybeSingle();

if (tenantError) throw new Error(`Tenant check failed: ${tenantError.message}`);

const { data: content, error: contentError } = await db
  .from("tenant_content_items")
  .select("content_type, published")
  .eq("tenant_id", tenantId);

const { data: buckets, error: bucketError } = await db.storage.listBuckets();
const counts = (content ?? []).reduce((result, row) => {
  const key = `${row.content_type}:${row.published ? "visible" : "hidden"}`;
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});

console.log(JSON.stringify({
  ok: !contentError && !bucketError,
  projectHost: host,
  tenant,
  cms: contentError
    ? { ready: false, error: contentError.message }
    : { ready: true, total: content?.length ?? 0, counts },
  mediaBucket: bucketError
    ? { ready: false, error: bucketError.message }
    : { ready: Boolean(buckets?.some((bucket) => bucket.id === "sluggers-media")) },
}, null, 2));
