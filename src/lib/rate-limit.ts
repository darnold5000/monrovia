const recent = new Map<string, number>();

export function rateLimit(key: string, windowMs = 30_000): boolean {
  const now = Date.now();
  const last = recent.get(key) ?? 0;
  if (now - last < windowMs) return false;
  recent.set(key, now);
  return true;
}
