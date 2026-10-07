import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/content/site";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const origin = new URL(request.url).origin || site.url;
  const response = NextResponse.redirect(new URL("/login", origin));
  return response;
}
