"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { deserializeAttribution, ATTRIBUTION_COOKIE } from "@/lib/attribution/parse";
import { trackEventRepeatable } from "@/lib/analytics";
import { site } from "@/content/site";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function InquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [started, setStarted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whoIsTraining: "",
    primaryGoal: "",
    preferredContact: "",
    preferredTimes: "",
    message: "",
    consent: false,
    company: "",
  });

  useEffect(() => {
    if (!started) return;
    trackEventRepeatable("inquiry_started");
  }, [started]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    if (!started) setStarted(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) {
      toast.error("Please agree to be contacted about your inquiry.");
      return;
    }

    setSubmitting(true);
    try {
      const attribution = deserializeAttribution(readCookie(ATTRIBUTION_COOKIE));
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consent: true,
          attribution: attribution ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        trackEventRepeatable("inquiry_error", { status: res.status });
        toast.error(data.error ?? "Could not send inquiry");
        return;
      }
      trackEventRepeatable("inquiry_submitted");
      setSent(true);
      toast.success("Inquiry sent");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        whoIsTraining: "",
        primaryGoal: "",
        preferredContact: "",
        preferredTimes: "",
        message: "",
        consent: false,
        company: "",
      });
      setStarted(false);
    } catch {
      trackEventRepeatable("inquiry_error", { status: 0 });
      toast.error("Could not send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div
        className="rounded-sm border border-gold/30 bg-charcoal p-6"
        role="status"
      >
        <h2 className="font-display text-xl tracking-wide text-ivory uppercase">
          Inquiry sent
        </h2>
        <p className="mt-2 text-sm text-stone">
          Thanks — we received your message and will follow up soon. You can also call or
          text us directly.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 border-gunmetal bg-transparent text-ivory hover:bg-gunmetal"
          onClick={() => setSent(false)}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-5 rounded-xl border border-gunmetal border-t-4 border-t-gold bg-card p-5 sm:p-6"
    >
      <div>
        <h2 className="font-display text-xl tracking-wide text-ivory uppercase">
          Send a message
        </h2>
        <p className="mt-1 text-sm text-stone">
          Questions about training, ages, rentals, or availability? We&apos;ll get back to you.
        </p>
      </div>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <Label htmlFor="website_url_hp">Website</Label>
        <Input
          id="website_url_hp"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            required
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            onFocus={() => !started && setStarted(true)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            required
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="whoIsTraining">Who is training?</Label>
          <select
            id="whoIsTraining"
            required
            value={form.whoIsTraining}
            onChange={(e) => update("whoIsTraining", e.target.value)}
            className="contact-select"
          >
            <option value="" disabled>Select an option</option>
            <option value="my_child">My child</option>
            <option value="myself">Myself</option>
            <option value="my_team">My team</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="primaryGoal">Primary training goal</Label>
          <select
            id="primaryGoal"
            required
            value={form.primaryGoal}
            onChange={(e) => update("primaryGoal", e.target.value)}
            className="contact-select"
          >
            <option value="" disabled>Select an option</option>
            <option value="hitting">Hitting</option>
            <option value="pitching">Pitching</option>
            <option value="fielding">Fielding</option>
            <option value="player_development">Player development</option>
            <option value="team_practice_facility_use">Team practice / facility use</option>
            <option value="tournament_question">Tournament question</option>
            <option value="other">Other</option>
            <option value="not_sure">Not sure yet</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="preferredContact">Preferred contact method</Label>
          <select
            id="preferredContact"
            required
            value={form.preferredContact}
            onChange={(e) => update("preferredContact", e.target.value)}
            className="contact-select"
          >
            <option value="" disabled>Select an option</option>
            <option value="call">Call</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="no_preference">No preference</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="preferredTimes">Preferred days/times</Label>
          <Input
            id="preferredTimes"
            placeholder="e.g. weekday evenings"
            value={form.preferredTimes}
            onChange={(e) => update("preferredTimes", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            required
            minLength={5}
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={form.consent}
          onCheckedChange={(v) => update("consent", v === true)}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed text-stone">
          By submitting, you agree that {site.shortName} may contact you about your
          inquiry. Message and data rates may apply.
        </Label>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-11 w-full bg-gold font-semibold text-obsidian hover:bg-gold/90 sm:w-auto sm:px-8"
      >
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
