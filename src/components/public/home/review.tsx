import { Star } from "lucide-react";
import { site } from "@/content/site";
import { testimonials } from "@/content/testimonials";

export function HomeReview() {
  const review = testimonials[0];
  if (!review) return null;

  return (
    <section id="reviews" className="section-pad border-y border-gunmetal bg-charcoal">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="eyebrow">Google Review</p>
        <div className="mt-4 flex items-center justify-center gap-1 text-gold" aria-label={`${site.googleReview.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-5 fill-current" aria-hidden />
          ))}
        </div>
        <p className="mt-2 text-sm text-stone">
          {site.googleReview.rating.toFixed(1)} · {site.googleReview.count} Google review
        </p>
        <blockquote className="mt-8 font-display text-2xl leading-snug font-medium tracking-wide text-ivory sm:text-3xl">
          &ldquo;{review.quote}&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-stone">— Google review</p>
      </div>
    </section>
  );
}
