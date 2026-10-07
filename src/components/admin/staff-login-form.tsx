"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function StaffLoginForm({ returnTo = "/admin" }: { returnTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Could not sign in. Check your staff email and password.");
        return;
      }
      router.push(returnTo.startsWith("/") ? returnTo : "/admin");
      router.refresh();
    } catch {
      toast.error("Staff sign in is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="staff-email" className="booking-label">Staff email</Label>
        <Input id="staff-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="h-[3.25rem] text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="staff-password" className="booking-label">Password</Label>
        <PasswordInput id="staff-password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required className="h-[3.25rem] text-base" />
      </div>
      <Button type="submit" disabled={loading} className="h-[3.25rem] w-full bg-gold font-bold text-obsidian hover:bg-gold/90">
        {loading ? "Signing in…" : "Staff sign in"}
      </Button>
    </form>
  );
}
