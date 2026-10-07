import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { sendReservationRequestAcknowledgement, sendReservationRequestNotification } from "@/lib/email";
import { reservationRequestSchema } from "@/lib/reservation-request";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const parsed = reservationRequestSchema.parse(await request.json());
    if (parsed.company?.trim()) return NextResponse.json({ ok: true });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(`reservation-request:${ip}:${parsed.email}`)) {
      return NextResponse.json({ error: "Please wait a moment before sending again." }, { status: 429 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: `Email is not configured yet. Please contact ${site.shortName} directly.`, code: "EMAIL_NOT_CONFIGURED" }, { status: 503 });
    }

    const results = await Promise.allSettled([
      sendReservationRequestNotification(parsed),
      sendReservationRequestAcknowledgement({ firstName: parsed.firstName, email: parsed.email }),
    ]);
    if (results.every((result) => result.status === "rejected")) {
      return NextResponse.json({ error: "Could not send your request right now. Please try again or call us.", code: "EMAIL_SEND_FAILED" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const flat = error.flatten();
      const first = Object.values(flat.fieldErrors).flat().find(Boolean) || flat.formErrors[0] || "Please check the form.";
      return NextResponse.json({ error: first }, { status: 400 });
    }
    console.error("[api/reservation-request] unexpected", error);
    return NextResponse.json({ error: "Could not send your request. Please try again." }, { status: 500 });
  }
}
