import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AttributionTracker } from "@/components/analytics/attribution-tracker";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { media } from "@/config/media";
import { site } from "@/content/site";
import {
  createMetadata,
  organizationSchema,
  sportsOrganizationSchema,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  ...createMetadata({
    title: "Youth Baseball & Softball in Monrovia, IN",
    description: site.description,
    path: "/",
  }),
  metadataBase: new URL(site.url),
  icons: {
    icon: media.brand.favicon,
    apple: media.brand.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [organizationSchema(), sportsOrganizationSchema()];

  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <AttributionTracker />
        </Suspense>
        <PageViewTracker />
        {children}
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
