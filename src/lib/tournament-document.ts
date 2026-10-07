const IMAGE_EXTENSIONS = new Set(["avif", "gif", "jpeg", "jpg", "png", "webp"]);

export function tournamentDocumentExtension(url: string) {
  try {
    const pathname = new URL(url, "https://sluggers.local").pathname;
    return pathname.split(".").pop()?.toLowerCase() ?? "";
  } catch {
    return "";
  }
}

export function isTournamentDocumentImage(url: string) {
  return IMAGE_EXTENSIONS.has(tournamentDocumentExtension(url));
}
