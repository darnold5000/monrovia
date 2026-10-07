import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  sendTournamentRegistrationAcknowledgement,
  sendTournamentRegistrationNotification,
} from "@/lib/email";
import { tournamentRegistrationSchema } from "@/lib/tournament-registration";
import { rateLimit } from "@/lib/rate-limit";
import { tournamentPaymentDetails } from "@/content/tournament-payment";
import { getPublicContentState } from "@/lib/sluggers-cms";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const parsed = tournamentRegistrationSchema.parse(await request.json());
    if (parsed.company?.trim()) return NextResponse.json({ ok: true });
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(`tournament-registration:${ip}:${parsed.headCoachEmail}`)) return NextResponse.json({ error: "Please wait a moment before submitting again." }, { status: 429 });
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: "Registration email is not configured yet. Please call Sluggers directly." }, { status: 503 });
    const tournamentState = await getPublicContentState("tournament");
    const tournament = tournamentState.published.find((item) => item.slug === parsed.tournamentId);
    const registrationVariant: "standard" | "series" = tournament
      ? String(tournament.data.registrationVariant ?? "standard") === "series" ? "series" : "standard"
      : parsed.tournamentId === "sluggers-softball-tournament-series-2027" ? "series" : "standard";
    const registration = { ...parsed, registrationVariant };
    const payment = tournamentPaymentDetails(registrationVariant, {
      depositAmount: typeof tournament?.data.depositAmount === "string" ? tournament.data.depositAmount : "",
      phone: typeof tournament?.data.registrationPhone === "string" ? tournament.data.registrationPhone : "",
    });
    await Promise.all([
      sendTournamentRegistrationNotification(registration, payment),
      sendTournamentRegistrationAcknowledgement(registration, payment),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) { const flat = error.flatten(); return NextResponse.json({ error: Object.values(flat.fieldErrors).flat().find(Boolean) ?? "Please check the form." }, { status: 400 }); }
    console.error("[api/tournament-registration] unexpected", error); return NextResponse.json({ error: "Could not send registration. Please try again." }, { status: 500 });
  }
}
