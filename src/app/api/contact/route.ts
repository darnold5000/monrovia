import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { inquirySchema } from "@/lib/contact";
import { sendInquiryAcknowledgement, sendInquiryNotification } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.parse(body);

    if ((parsed.company ?? "").trim()) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!rateLimit(`inquiry:${ip}:${parsed.email}`)) {
      return NextResponse.json(
        { error: "Please wait a moment before sending again." },
        { status: 429 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[api/contact] RESEND_API_KEY is not set");
      return NextResponse.json(
        {
          error:
            `Email is not configured yet. Please call or text ${site.shortName} directly.`,
          code: "EMAIL_NOT_CONFIGURED",
        },
        { status: 503 },
      );
    }

    const results = await Promise.allSettled([
      sendInquiryNotification(parsed),
      sendInquiryAcknowledgement({
        firstName: parsed.firstName,
        email: parsed.email,
      }),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length === results.length) {
      console.error("[api/contact] all email sends failed");
      return NextResponse.json(
        {
          error:
            "Could not send your inquiry right now. Please try again or call us.",
          code: "EMAIL_SEND_FAILED",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const flat = error.flatten();
      const first =
        Object.values(flat.fieldErrors).flat().find(Boolean) ||
        flat.formErrors[0] ||
        "Please check the form and try again.";
      return NextResponse.json({ error: first, details: flat }, { status: 400 });
    }
    console.error("[api/contact] unexpected", error);
    return NextResponse.json(
      { error: "Could not send your inquiry. Please try again." },
      { status: 500 },
    );
  }
}
