import { site } from "@/content/site";

type Social = typeof site.social;

export function SocialLinks({ className = "", social = site.social }: { className?: string; social?: Social }) {
  const socialLinks = [
    { href: social.facebook, label: "MOBS on Facebook", glyph: "f" },
    { href: social.instagram, label: "MOBS on Instagram", glyph: "◎" },
    { href: social.x, label: "MOBS on X", glyph: "𝕏" },
    { href: social.yelp, label: "MOBS on Yelp", glyph: "y" },
  ].filter((item) => item.href.length > 0);

  if (socialLinks.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Social media">
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className="inline-flex size-9 items-center justify-center rounded-full border border-barn-cream/30 text-sm font-bold text-barn-cream transition hover:border-softball-yellow hover:text-softball-yellow"
        >
          <span aria-hidden="true">{item.glyph}</span>
        </a>
      ))}
    </div>
  );
}
