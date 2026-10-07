import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "sluggers-media";

function managedPath(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!supabaseUrl || url.origin !== new URL(supabaseUrl).origin) return null;
  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  if (!url.pathname.startsWith(prefix)) return null;
  const path = decodeURIComponent(url.pathname.slice(prefix.length));
  return path && path.split("/").length >= 3 ? path : null;
}

export function collectManagedMediaPaths(data: Record<string, unknown> | null | undefined): string[] {
  return [...new Set(Object.values(data ?? {}).map(managedPath).filter((path): path is string => Boolean(path)))];
}

export async function cleanupManagedMedia(
  db: SupabaseClient,
  data: Record<string, unknown> | null | undefined,
  keepPaths: string[] = [],
  tenantId?: string,
) {
  const keep = new Set(keepPaths);
  const tenantPrefix = tenantId ? `${tenantId}/` : "";
  const paths = collectManagedMediaPaths(data).filter((path) =>
    (!tenantPrefix || path.startsWith(tenantPrefix)) && !keep.has(path),
  );
  if (!paths.length) return;

  const { error } = await db.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error("Sluggers media cleanup failed", { bucket: BUCKET, paths, message: error.message });
  }
}

export function managedMediaPath(value: unknown) {
  return managedPath(value);
}
