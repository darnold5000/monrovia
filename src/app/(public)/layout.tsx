import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { MobileCtaBar } from "@/components/public/mobile-cta-bar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-softball-yellow focus:px-4 focus:py-2 focus:text-charcoal"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="pb-mobile-cta">
        {children}
      </main>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}
