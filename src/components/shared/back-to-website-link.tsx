import Link from "next/link";
import { cn } from "@/lib/utils";

export function BackToWebsiteLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("text-sm text-stone transition hover:text-ivory", className)}
    >
      ← Back to website
    </Link>
  );
}
