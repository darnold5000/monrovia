import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireSluggersStaff } from "@/lib/sluggers-admin-auth";

export const metadata: Metadata = { title: "Sluggers Staff Portal", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSluggersStaff();
  return <div className="min-h-screen bg-obsidian text-ivory"><AdminNav />{children}</div>;
}
