"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { tournamentPayment, tournamentPaymentDetails } from "@/content/tournament-payment";

type Props = {
  tournamentId: string;
  tournament: string;
  variant?: "standard" | "series";
  depositAmount?: string;
  registrationPhone?: string;
};
const standardFields = [
  ["teamName", "Team name", true], ["ageGroup", "Age group", true], ["organization", "Organization / club name", true], ["homeCityState", "Home city / state", true],
  ["headCoachName", "Head coach name", true], ["headCoachEmail", "Head coach email", true], ["headCoachCell", "Head coach cell #", true], ["alternateContactName", "Alternate contact name", false], ["alternateContactEmail", "Alternate contact email", false], ["alternateContactCell", "Alternate contact cell #", false],
] as const;

const discountSeriesTournaments = [
  "May Madness — April 30–May 3, 2027",
  "Spring Fling — May 14–16, 2027",
  "Stars & Stripes Classic — May 28–30, 2027",
  "June Sluggfest — June 4–6, 2027",
  "Father’s Day Battle — June 18–20, 2027",
  "June Rumble — June 25–27, 2027",
] as const;

const firecrackerTournament = "Firecracker Frenzy — July 3–5, 2027";

const seriesContactFields = [
  ["homeCityState", "Home city / state", true],
  ["headCoachName", "Head coach name", true], ["headCoachEmail", "Head coach email", true], ["headCoachCell", "Head coach cell #", true],
  ["alternateContactName", "Alternate contact name", false], ["alternateContactEmail", "Alternate contact email", false], ["alternateContactCell", "Alternate contact cell #", false],
] as const;

export function TournamentRegistrationForm({ tournamentId, tournament, variant = "standard", depositAmount = "", registrationPhone = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const payment = tournamentPaymentDetails(variant, { depositAmount, phone: registrationPhone });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true);
    const formData = new FormData(event.currentTarget);
    const selectedTournaments = formData.getAll("selectedTournaments").map(String);
    if (variant === "series" && selectedTournaments.length === 0) {
      toast.error("Select at least one tournament.");
      setSending(false);
      return;
    }
    const data: Record<string, FormDataEntryValue | string[]> = Object.fromEntries(formData);
    data.tournament = tournament;
    data.tournamentId = tournamentId;
    data.registrationVariant = variant;
    if (variant === "series") data.selectedTournaments = selectedTournaments;
    try {
      const response = await fetch("/api/tournament-registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Could not send registration.");
      setSent(true); toast.success("Registration submitted");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not send registration."); }
    finally { setSending(false); }
  }

  if (!open) return <button type="button" className="btn-primary-green w-full text-center" onClick={() => setOpen(true)}>Register online</button>;
  return <div className="fixed inset-0 z-[100] overflow-y-auto bg-obsidian/80 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`Register for ${tournament}`}><div className="mx-auto max-w-3xl rounded-sm border border-barn-border bg-barn-cream p-5 shadow-xl sm:p-8">
    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Tournament registration</p><h2 className="mt-2 font-display text-3xl font-black uppercase text-barn-navy">{tournament}</h2></div><button type="button" className="text-2xl text-barn-muted" onClick={() => setOpen(false)} aria-label="Close registration form">×</button></div>
    {sent ? <div className="mt-8 border border-barn-green/30 bg-white p-6"><h3 className="font-display text-2xl font-bold uppercase text-barn-navy">Registration received</h3><p className="mt-2 text-barn-muted">A confirmation and payment instructions have been sent to the head coach email address provided.</p><p className="mt-4 text-sm leading-relaxed text-barn-navy">{payment.depositInstructions}</p><a href={tournamentPayment.venmoUrl} target="_blank" rel="noopener noreferrer" className="mx-auto mt-5 block max-w-xs text-center"><Image src={tournamentPayment.venmoImage} alt={`Venmo QR code for ${tournamentPayment.venmoHandle}`} width={310} height={354} className="h-auto w-full object-contain" /><span className="mt-2 block text-sm font-bold text-barn-green underline decoration-gold/60 underline-offset-2">Pay with Venmo {tournamentPayment.venmoHandle}</span></a><Button type="button" className="mt-5 w-full bg-barn-green text-barn-cream" onClick={() => { setSent(false); setOpen(false); }}>Close</Button></div> : <form onSubmit={submit} className="mt-6 space-y-6"><input name="company" className="hidden" tabIndex={-1} autoComplete="off" />
      {variant === "series" ? <div><h3 className="form-section-heading">Select tournament(s)</h3><p className="mt-2 text-sm text-barn-muted">Choose one or more 2027 tournaments.</p><div className="mt-4 border-l-4 border-gold bg-white/50 p-4"><p className="text-xs font-bold tracking-[.12em] text-barn-green uppercase">The More You Play, The More You Save program</p><p className="mt-1 text-sm text-barn-muted">The first six tournaments qualify for multi-tournament discounts.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{discountSeriesTournaments.map((option) => <label key={option} className="flex min-h-12 items-center gap-3 rounded-sm border border-barn-border bg-white px-4 py-3 text-sm font-semibold text-barn-navy"><input type="checkbox" name="selectedTournaments" value={option} className="size-4 accent-[var(--barn-gold)]" />{option}</label>)}</div></div><div className="mt-4"><label className="flex min-h-12 items-center gap-3 rounded-sm border border-barn-border bg-white px-4 py-3 text-sm font-semibold text-barn-navy"><input type="checkbox" name="selectedTournaments" value={firecrackerTournament} className="size-4 accent-[var(--barn-gold)]" />{firecrackerTournament} *</label><p className="mt-2 text-xs leading-relaxed text-barn-muted">* Firecracker Frenzy is not part of the “The More You Play, The More You Save” program. It is an 8-game guarantee event priced separately at $990.</p></div></div> : null}
      <div><h3 className="form-section-heading">Team information</h3><div className="mt-3 grid gap-4 sm:grid-cols-2">{variant === "series" ? <><label className="block text-sm font-semibold text-barn-navy">Team name *<input name="teamName" type="text" required className="contact-form-input" /></label><label className="block text-sm font-semibold text-barn-navy">Age group *<select name="ageGroup" required defaultValue="" className="contact-form-input"><option value="" disabled>Select an age group</option>{["8U", "9U", "10U", "11U", "12U", "13U", "14U", "16U", "18U"].map((age) => <option key={age} value={age}>{age}</option>)}</select></label>{seriesContactFields.map(([name, label, required]) => <label key={name} className="block text-sm font-semibold text-barn-navy">{label}{required ? " *" : ""}<input name={name} type={name.toLowerCase().includes("email") ? "email" : "text"} required={required} className="contact-form-input" /></label>)}</> : standardFields.map(([name, label, required]) => <label key={name} className="block text-sm font-semibold text-barn-navy">{label}{required ? " *" : ""}<input name={name} type={name.toLowerCase().includes("email") ? "email" : "text"} required={required} className="contact-form-input" /></label>)}</div></div>
      {variant === "standard" ? <div><h3 className="form-section-heading">Special requests / notes</h3><textarea name="specialRequests" rows={3} className="contact-form-input mt-3 w-full" /></div> : null}<Button type="submit" disabled={sending} className="w-full bg-gold font-bold text-obsidian hover:bg-gold/90">{sending ? "Sending…" : "Submit registration"}</Button><p className="text-sm leading-relaxed text-barn-navy"><strong>A {payment.depositAmount} deposit is required to secure your registration.</strong> After submitting this form, payment instructions and a secure payment link will be sent to the email address provided. Call us at <a href={payment.phoneHref} className="font-semibold text-barn-green underline decoration-gold/60 underline-offset-2 hover:text-gold">{payment.phoneDisplay}</a> {payment.phoneContext}</p></form>}
  </div></div>;
}
