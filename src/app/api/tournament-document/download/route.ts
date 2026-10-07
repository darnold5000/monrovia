import { NextRequest, NextResponse } from "next/server";
import { isTournamentDocumentImage, tournamentDocumentExtension } from "@/lib/tournament-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_MEDIA_PREFIXES = ["/documents/", "/images/sluggers/tournaments/"];

function approvedTournamentMediaUrl(source: string, request: NextRequest) {
  if (!isTournamentDocumentImage(source)) return null;

  let target: URL;
  try {
    target = new URL(source, request.nextUrl.origin);
  } catch {
    return null;
  }

  if (target.origin === request.nextUrl.origin && LOCAL_MEDIA_PREFIXES.some((prefix) => target.pathname.startsWith(prefix))) {
    return target;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const tenantId = process.env.TENANT_ID;
  if (!supabaseUrl || !tenantId) return null;

  try {
    const supabaseOrigin = new URL(supabaseUrl).origin;
    const expectedPath = `/storage/v1/object/public/sluggers-media/${tenantId}/tournament/`;
    return target.origin === supabaseOrigin && target.pathname.startsWith(expectedPath) ? target : null;
  } catch {
    return null;
  }
}

function downloadFilename(tournament: string, extension: string) {
  const base = tournament.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 100)
    || "sluggers-tournament";
  return `${base}-flyer.${extension}`;
}

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url") ?? "";
  const tournament = request.nextUrl.searchParams.get("tournament") ?? "Sluggers tournament";
  const target = approvedTournamentMediaUrl(source, request);
  if (!target) return NextResponse.json({ error: "That tournament flyer cannot be downloaded." }, { status: 400 });

  try {
    const upstream = await fetch(target, { cache: "no-store", redirect: "error" });
    if (!upstream.ok) return NextResponse.json({ error: "The tournament flyer could not be loaded." }, { status: 502 });

    const contentType = upstream.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!contentType.startsWith("image/")) return NextResponse.json({ error: "The tournament file is not an image." }, { status: 415 });

    const extension = tournamentDocumentExtension(source) || contentType.split("/")[1] || "jpg";
    const filename = downloadFilename(tournament, extension === "jpeg" ? "jpg" : extension);
    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": String(body.byteLength),
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[api/tournament-document/download] failed", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "The tournament flyer could not be downloaded." }, { status: 502 });
  }
}
