"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, X } from "lucide-react";
import { googleCalendarEmbedUrl, type SluggersCalendar, type SluggersCalendarId } from "@/content/sluggers-links";
import type { ReservationRequestPayload } from "@/lib/reservation-request";

type ServiceType = ReservationRequestPayload["serviceType"];

const serviceOptions: Array<{ value: ServiceType; label: string }> = [
  { value: "team-practice", label: "Team Baseball / Softball Practice" },
  { value: "playing-field-rental", label: "Playing Field Rental" },
  { value: "upstairs-hitting-lane", label: "Upstairs Hitting Lane" },
  { value: "baseball-lesson", label: "Baseball Lesson" },
  { value: "softball-lesson", label: "Softball Lesson" },
  { value: "small-group-training", label: "Small Group Training" },
  { value: "other", label: "Other" },
];

function isServiceType(value: string | undefined): value is ServiceType {
  return serviceOptions.some((option) => option.value === value);
}

export function AvailabilityClient({
  calendars,
  timezone,
  initialCalendar,
  initialService,
}: {
  calendars: readonly SluggersCalendar[];
  timezone: string;
  initialCalendar: SluggersCalendarId;
  initialService?: string;
}) {
  const firstCalendar = calendars.find((calendar) => calendar.id === initialCalendar) ?? calendars[0];
  const [calendarId, setCalendarId] = useState<SluggersCalendarId>(firstCalendar.id);
  const [serviceType, setServiceType] = useState<ServiceType>(
    isServiceType(initialService) ? initialService : firstCalendar.defaultService as ServiceType,
  );
  const [showForm, setShowForm] = useState(false);

  function selectCalendar(id: SluggersCalendarId) {
    const calendar = calendars.find((item) => item.id === id)!;
    setCalendarId(id);
    setServiceType(calendar.defaultService as ServiceType);
  }

  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Facility calendars">
        {calendars.map((calendar) => {
          const selected = calendar.id === calendarId;
          return (
            <button
              key={calendar.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectCalendar(calendar.id)}
              className={`rounded-sm border px-5 py-4 text-left transition ${selected ? "border-barn-green bg-barn-green text-barn-cream" : "border-barn-green bg-white text-barn-green hover:bg-barn-cream"}`}
            >
              <span className="text-xs font-bold tracking-[.14em] uppercase">{calendar.name}</span>
              <span className={`mt-1 block text-sm ${selected ? "text-barn-cream/80" : "text-barn-muted"}`}>{calendar.description}</span>
            </button>
          );
        })}
      </div>

      <section className="mt-7 overflow-hidden rounded-sm border border-barn-green bg-white shadow-sm" aria-live="polite">
        <div className="border-b border-barn-green bg-barn-navy-dark px-5 py-4 text-barn-cream sm:px-7">
          <p className="eyebrow text-gold">Current schedule</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase">{calendars.find((calendar) => calendar.id === calendarId)?.name}</h2>
          <p className="mt-1 text-sm text-barn-cream/75">Google Calendar · {timezone}</p>
        </div>
        <div className="bg-barn-cream p-2 sm:p-4">
          <div className="px-2 pb-3 pt-1 sm:px-3">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-gold uppercase">View availability</p>
            <p className="mt-1 text-xs text-barn-muted">Click any booking or “more” link to see all scheduled times for that day.</p>
          </div>
          <iframe
            key={calendarId}
            title={`${calendars.find((calendar) => calendar.id === calendarId)?.name} Google Calendar`}
            src={googleCalendarEmbedUrl(calendars.find((calendar) => calendar.id === calendarId)!.googleCalendarId, timezone)}
            className="h-[560px] w-full border-0 sm:h-[800px] lg:h-[900px]"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-4 border-t border-barn-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h3 className="font-display text-lg font-bold uppercase text-barn-navy">See a time that may work?</h3>
            <p className="mt-1 text-sm text-barn-muted">Requests are reviewed and confirmed by Sluggers. Nothing is booked automatically.</p>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="btn-primary-green inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-3 text-sm">
            Request a Reservation <ArrowUpRight className="size-4" />
          </button>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-barn-muted">
        <p>Google Calendar is the source of truth for the current schedule.</p>
        <a href={googleCalendarEmbedUrl(calendars.find((calendar) => calendar.id === calendarId)!.googleCalendarId, timezone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-barn-green hover:text-barn-navy">Open full calendar <ArrowUpRight className="size-4" /></a>
      </div>

      {showForm ? (
          <ReservationRequestForm
            calendarId={calendarId}
            calendars={calendars}
            serviceType={serviceType}
          onClose={() => setShowForm(false)}
        />
      ) : null}
    </>
  );
}

function ReservationRequestForm({
  calendarId,
  calendars,
  serviceType: initialService,
  onClose,
}: {
  calendarId: SluggersCalendarId;
  calendars: readonly SluggersCalendar[];
  serviceType: ServiceType;
  onClose: () => void;
}) {
  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", preferredDate: "", preferredTime: "", otherDetails: "", teamInfo: "", notes: "", consent: false, company: "" });
  const selectedCalendar = calendars.find((calendar) => calendar.id === calendarId);

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/reservation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, serviceType }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not send your request.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send your request. Please try again or contact Sluggers directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-barn-navy-dark/75 px-4 py-8" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
      <div className="mx-auto max-w-3xl rounded-sm border border-barn-green bg-barn-cream shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-barn-green bg-barn-navy-dark px-5 py-5 text-barn-cream sm:px-7">
          <div>
            <p className="eyebrow text-gold">Request only</p>
            <h2 id="reservation-title" className="mt-1 font-display text-2xl font-bold uppercase">Request a Reservation</h2>
            <p className="mt-2 text-sm text-barn-cream/80">Tell us what you&apos;re looking for and we&apos;ll confirm availability with you.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close reservation request" className="rounded-sm p-2 text-barn-cream hover:bg-barn-green"><X className="size-5" /></button>
        </div>
        {sent ? (
          <div className="p-7 sm:p-10" role="status">
            <CheckCircle2 className="size-10 text-barn-green" />
            <h3 className="mt-4 font-display text-2xl font-bold uppercase text-barn-navy">Request received</h3>
            <p className="mt-3 text-barn-muted">Thanks! Sluggers has received your request and will contact you to confirm availability. Your time is not reserved until Sluggers confirms it.</p>
            <button type="button" onClick={onClose} className="btn-primary-green mt-6 px-5 py-3 text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-7">
            <p className="text-sm text-barn-muted">Viewing: <strong className="text-barn-navy">{selectedCalendar?.name}</strong></p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy sm:col-span-2">Service type *<select required value={serviceType} onChange={(event) => setServiceType(event.target.value as ServiceType)} className="field mt-1.5 w-full"><option value="team-practice">Team Baseball / Softball Practice</option>{serviceOptions.slice(1).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
              {serviceType === "other" ? <label className="space-y-1.5 text-sm font-semibold text-barn-navy sm:col-span-2">Tell us more<input required value={form.otherDetails} onChange={(event) => update("otherDetails", event.target.value)} className="field mt-1.5 w-full" /></label> : null}
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">Preferred date *<input required type="date" value={form.preferredDate} onChange={(event) => update("preferredDate", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">Preferred time<input placeholder="e.g. 6:00 PM" value={form.preferredTime} onChange={(event) => update("preferredTime", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">First name *<input required value={form.firstName} onChange={(event) => update("firstName", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">Last name *<input required value={form.lastName} onChange={(event) => update("lastName", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">Phone *<input required type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy">Email *<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy sm:col-span-2">Team / player information<input placeholder="Team name, age group, athlete name, etc." value={form.teamInfo} onChange={(event) => update("teamInfo", event.target.value)} className="field mt-1.5 w-full" /></label>
              <label className="space-y-1.5 text-sm font-semibold text-barn-navy sm:col-span-2">Notes<textarea rows={4} placeholder="Anything else Sluggers should know about your request?" value={form.notes} onChange={(event) => update("notes", event.target.value)} className="field mt-1.5 w-full" /></label>
            </div>
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden><label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} /></label></div>
            <label className="flex items-start gap-3 text-sm text-barn-muted"><input required type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} className="mt-1 size-4 accent-barn-green" />I agree that Sluggers may contact me about this reservation request. I understand this is not an automatic booking.</label>
            {error ? <p className="text-sm font-semibold text-red-700" role="alert">{error}</p> : null}
            <button type="submit" disabled={submitting} className="btn-primary-green w-full px-5 py-3 text-sm disabled:opacity-60">{submitting ? "Sending request…" : "Send Request"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
