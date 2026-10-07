import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inquirySchema } from "./contact";
import { reservationRequestSchema } from "./reservation-request";
import { tournamentRegistrationSchema } from "./tournament-registration";
import { tournamentPaymentDetails } from "@/content/tournament-payment";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: "email-id" }, error: null });
  vi.stubEnv("RESEND_API_KEY", "test-api-key");
  vi.stubEnv("RESEND_FROM_EMAIL", "verified@example.com");
  vi.stubEnv("SLUGGERS_CONTACT_EMAIL", "bill@example.com");
  vi.stubEnv("BARN_EMAIL_SANDBOX", "false");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("transactional email routing", () => {
  it("routes staff notifications to Bill and replies to each customer", async () => {
    const {
      sendInquiryNotification,
      sendReservationRequestNotification,
      sendTournamentRegistrationNotification,
    } = await import("./email");

    const inquiry = inquirySchema.parse({
      firstName: "Jamie",
      lastName: "Player",
      email: "jamie@example.com",
      phone: "330-555-0100",
      whoIsTraining: "my_child",
      primaryGoal: "hitting",
      preferredContact: "email",
      message: "I would like lesson information.",
      consent: true,
    });
    const reservation = reservationRequestSchema.parse({
      serviceType: "playing-field-rental",
      preferredDate: "2027-01-15",
      firstName: "Taylor",
      lastName: "Coach",
      phone: "330-555-0101",
      email: "taylor@example.com",
      consent: true,
    });
    const registration = tournamentRegistrationSchema.parse({
      tournamentId: "winter-classic",
      tournament: "Winter Classic",
      teamName: "Sluggers Test",
      ageGroup: "12U",
      homeCityState: "Poland, OH",
      headCoachName: "Casey Coach",
      headCoachEmail: "casey@example.com",
      headCoachCell: "330-555-0102",
    });

    await sendInquiryNotification(inquiry);
    await sendReservationRequestNotification(reservation);
    await sendTournamentRegistrationNotification(
      registration,
      tournamentPaymentDetails("standard"),
    );

    expect(sendMock).toHaveBeenCalledTimes(3);
    expect(sendMock.mock.calls.map(([message]) => ({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
    }))).toEqual([
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "bill@example.com",
        replyTo: "jamie@example.com",
      },
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "bill@example.com",
        replyTo: "taylor@example.com",
      },
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "bill@example.com",
        replyTo: "casey@example.com",
      },
    ]);
  });

  it("routes visitor confirmations to each customer and replies to Bill", async () => {
    const {
      sendInquiryAcknowledgement,
      sendReservationRequestAcknowledgement,
      sendTournamentRegistrationAcknowledgement,
    } = await import("./email");
    const registration = tournamentRegistrationSchema.parse({
      tournamentId: "winter-classic",
      tournament: "Winter Classic",
      teamName: "Sluggers Test",
      ageGroup: "12U",
      homeCityState: "Poland, OH",
      headCoachName: "Casey Coach",
      headCoachEmail: "casey@example.com",
      headCoachCell: "330-555-0102",
    });

    await sendInquiryAcknowledgement({ firstName: "Jamie", email: "jamie@example.com" });
    await sendReservationRequestAcknowledgement({ firstName: "Taylor", email: "taylor@example.com" });
    await sendTournamentRegistrationAcknowledgement(
      registration,
      tournamentPaymentDetails("standard"),
    );

    expect(sendMock).toHaveBeenCalledTimes(3);
    expect(sendMock.mock.calls.map(([message]) => ({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
    }))).toEqual([
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "jamie@example.com",
        replyTo: "bill@example.com",
      },
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "taylor@example.com",
        replyTo: "bill@example.com",
      },
      {
        from: "Sluggers Indoor Baseball & Softball <verified@example.com>",
        to: "casey@example.com",
        replyTo: "bill@example.com",
      },
    ]);
  });
});
