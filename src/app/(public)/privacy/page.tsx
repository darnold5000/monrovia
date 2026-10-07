import { createMetadata } from "@/lib/seo";
import { privacyPolicySections } from "@/lib/legal";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Monrovia Organized Baseball & Softball.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="section-pad mx-auto max-w-3xl pt-28 prose-invert">
      <h1 className="font-display text-4xl font-bold tracking-[0.06em] text-ivory uppercase">
        Privacy Policy
      </h1>
      <p className="mt-4 text-sm text-stone">
        For owner and legal review before launch.
      </p>
      <div className="mt-10 space-y-8">
        {privacyPolicySections().map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl text-gold">{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-3 text-sm leading-relaxed text-stone">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
