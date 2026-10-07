import { Resend } from "resend";
import {
  escapeHtml,
  firstName,
  formatBrandedFromAddress,
  resolveResendFromEmail,
} from "@/lib/signalworks/email";
import { site } from "@/content/site";
import {
  contactLabels,
  goalLabels,
  type InquiryPayload,
  whoLabels,
} from "@/lib/contact";
import { applyEmailSandbox } from "@/lib/email-sandbox";
import { reservationServiceLabels, type ReservationRequestPayload } from "@/lib/reservation-request";
import type { TournamentRegistrationPayload } from "@/lib/tournament-registration";
import { tournamentPayment, tournamentPaymentDetails } from "@/content/tournament-payment";

type TournamentPaymentDetails = ReturnType<typeof tournamentPaymentDetails>;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function fromAddress() {
  return resolveResendFromEmail({ RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL });
}

function staffFromAddress() {
  return formatBrandedFromAddress(site.name, fromAddress());
}

function requireResend() {
  if (!resend) {
    console.error("[email] RESEND_API_KEY is not set");
    throw new Error("EMAIL_NOT_CONFIGURED");
  }
  return resend;
}

async function sendEmail(
  payload: Parameters<NonNullable<typeof resend>["emails"]["send"]>[0],
  label: string,
) {
  const client = requireResend();
  const outbound = applyEmailSandbox(payload);
  const { error } = await client.emails.send(outbound);
  if (error) {
    console.error(`[email] ${label} failed:`, error.message);
    throw new Error(error.message || `EMAIL_SEND_FAILED:${label}`);
  }
}

function attributionBlock(attribution?: InquiryPayload["attribution"]) {
  if (!attribution) return "";
  const rows = [
    ["UTM Source", attribution.utmSource],
    ["UTM Medium", attribution.utmMedium],
    ["UTM Campaign", attribution.utmCampaign],
    ["Landing Page", attribution.landingPage],
    ["Referrer", attribution.referrer],
  ]
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
  return rows ? `<h3>Attribution</h3>${rows}` : "";
}

function staffEmail() {
  const email = process.env.SLUGGERS_CONTACT_EMAIL ?? process.env.BARN_CONTACT_EMAIL;
  if (!email) throw new Error("STAFF_EMAIL_NOT_CONFIGURED");
  return email;
}

export async function sendInquiryNotification(payload: InquiryPayload) {
  const fullName = `${payload.firstName} ${payload.lastName}`;
  await sendEmail({
    from: staffFromAddress(),
    to: staffEmail(),
    replyTo: payload.email,
    subject: `${site.name} inquiry — ${fullName}`,
    html: `<div style="font-family:sans-serif;max-width:600px"><h2>New training inquiry</h2><p><strong>Name:</strong> ${escapeHtml(fullName)}</p><p><strong>Email:</strong> ${escapeHtml(payload.email)}</p><p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p><p><strong>Who is training:</strong> ${escapeHtml(whoLabels[payload.whoIsTraining])}</p><p><strong>Primary goal:</strong> ${escapeHtml(goalLabels[payload.primaryGoal])}</p><p><strong>Preferred contact:</strong> ${escapeHtml(contactLabels[payload.preferredContact])}</p><p><strong>Preferred days/times:</strong> ${escapeHtml(payload.preferredTimes || "—")}</p><p><strong>Message:</strong></p><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>${attributionBlock(payload.attribution)}</div>`,
  }, "inquiry-notification");
}

export async function sendReservationRequestNotification(payload: ReservationRequestPayload) {
  const fullName = `${payload.firstName} ${payload.lastName}`;
  await sendEmail({
    from: staffFromAddress(),
    to: staffEmail(),
    replyTo: payload.email,
    subject: `Reservation request — ${fullName}`,
    html: `<div style="font-family:sans-serif;max-width:600px"><h2>New reservation request</h2><p><strong>Status:</strong> Pending — not automatically booked</p><p><strong>Service:</strong> ${escapeHtml(reservationServiceLabels[payload.serviceType])}</p><p><strong>Other details:</strong> ${escapeHtml(payload.otherDetails || "—")}</p><p><strong>Preferred date:</strong> ${escapeHtml(payload.preferredDate)}</p><p><strong>Preferred time:</strong> ${escapeHtml(payload.preferredTime || "—")}</p><p><strong>Name:</strong> ${escapeHtml(fullName)}</p><p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p><p><strong>Email:</strong> ${escapeHtml(payload.email)}</p><p><strong>Team / player information:</strong> ${escapeHtml(payload.teamInfo || "—")}</p><p><strong>Notes:</strong></p><p style="white-space:pre-wrap">${escapeHtml(payload.notes || "—")}</p></div>`,
  }, "reservation-request-notification");
}

export async function sendTournamentRegistrationNotification(payload: TournamentRegistrationPayload, payment: TournamentPaymentDetails) {
  const selectedTournaments = payload.selectedTournaments?.length
    ? `<h3>Selected tournaments</h3><ul>${payload.selectedTournaments.map((tournament) => `<li>${escapeHtml(tournament)}</li>`).join("")}</ul>`
    : "";
  await sendEmail({
    from: staffFromAddress(), to: staffEmail(), replyTo: payload.headCoachEmail,
    subject: `Tournament registration — ${payload.teamName}`,
    html: `<div style="font-family:sans-serif;max-width:650px"><h2>New tournament registration</h2><p><strong>Tournament:</strong> ${escapeHtml(payload.tournament)}</p>${selectedTournaments}<p><strong>Team name:</strong> ${escapeHtml(payload.teamName)}</p><p><strong>Age group:</strong> ${escapeHtml(payload.ageGroup)}</p><p><strong>Organization / club:</strong> ${escapeHtml(payload.organization || "—")}</p><p><strong>Home city / state:</strong> ${escapeHtml(payload.homeCityState)}</p><h3>Head coach</h3><p>${escapeHtml(payload.headCoachName)}<br/>${escapeHtml(payload.headCoachEmail)}<br/>${escapeHtml(payload.headCoachCell)}</p><h3>Alternate team contact</h3><p>${escapeHtml(payload.alternateContactName || "—")}<br/>${escapeHtml(payload.alternateContactEmail || "—")}<br/>${escapeHtml(payload.alternateContactCell || "—")}</p><p><strong>Special requests / notes:</strong><br/>${escapeHtml(payload.specialRequests || "—")}</p><p><strong>Payment:</strong> A ${escapeHtml(payment.depositAmount)} deposit is required to secure registration. Send payment instructions and a secure payment link to ${escapeHtml(payload.headCoachEmail)}. Call Sluggers at ${escapeHtml(payment.phoneDisplay)} ${escapeHtml(payment.phoneContext)}</p></div>`,
  }, "tournament-registration-notification");
}

export async function sendTournamentRegistrationAcknowledgement(payload: TournamentRegistrationPayload, payment: TournamentPaymentDetails) {
  const selectedTournaments = payload.selectedTournaments?.length
    ? `<h3>Selected tournaments</h3><ul>${payload.selectedTournaments.map((tournament) => `<li>${escapeHtml(tournament)}</li>`).join("")}</ul>`
    : `<p><strong>Tournament:</strong> ${escapeHtml(payload.tournament)}</p>`;
  const venmoImageUrl = new URL(tournamentPayment.venmoImage, site.url).toString();

  await sendEmail({
    from: staffFromAddress(),
    to: payload.headCoachEmail,
    replyTo: staffEmail(),
    subject: `Sluggers tournament registration received — ${payload.teamName}`,
    html: `<div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#173f2f"><h1>Registration received</h1><p>Sluggers received the tournament registration for <strong>${escapeHtml(payload.teamName)}</strong>.</p>${selectedTournaments}<h2 style="margin-top:24px">Payment instructions</h2><p style="line-height:1.6">${escapeHtml(payment.depositInstructions)}</p><p style="margin-top:24px;text-align:center"><a href="${escapeHtml(tournamentPayment.venmoUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(venmoImageUrl)}" width="310" alt="Venmo QR code for ${escapeHtml(tournamentPayment.venmoHandle)}" style="display:block;width:100%;max-width:310px;height:auto;margin:0 auto;border:0" /></a><br/><a href="${escapeHtml(tournamentPayment.venmoUrl)}" target="_blank" rel="noopener noreferrer" style="color:#173f2f;font-weight:700">Pay with Venmo ${escapeHtml(tournamentPayment.venmoHandle)}</a></p><p style="margin-top:24px">Call us at <a href="${escapeHtml(payment.phoneHref)}" style="color:#173f2f;font-weight:700">${escapeHtml(payment.phoneDisplay)}</a> ${escapeHtml(payment.phoneContext)}</p><p>${escapeHtml(site.name)}<br/>${escapeHtml(site.email)}</p></div>`,
  }, "tournament-registration-acknowledgement");
}

export async function sendReservationRequestAcknowledgement(payload: { firstName: string; email: string }) {
  await sendEmail({
    from: staffFromAddress(),
    to: payload.email,
    replyTo: staffEmail(),
    subject: `Request received — ${site.name}`,
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h1>Request received</h1><p>Hi ${escapeHtml(firstName(payload.firstName))},</p><p>Sluggers received your reservation request. Your time is not reserved until Sluggers confirms availability with you.</p><p>${escapeHtml(site.name)}<br/>${site.phone}<br/>${site.email}</p></div>`,
  }, "reservation-request-acknowledgement");
}

export async function sendInquiryAcknowledgement(payload: { firstName: string; email: string }) {
  await sendEmail({
    from: staffFromAddress(),
    to: payload.email,
    replyTo: staffEmail(),
    subject: `We received your inquiry — ${site.name}`,
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto"><h1>Thanks for reaching out</h1><p>Hi ${escapeHtml(firstName(payload.firstName))},</p><p>We received your training inquiry and will follow up soon.</p><p>${escapeHtml(site.name)}<br/>${site.phone}<br/>${site.email}</p></div>`,
  }, "inquiry-ack");
}
