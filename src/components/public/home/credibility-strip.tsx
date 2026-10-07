import { Fragment } from "react";
import { credibilityItems } from "@/content/training";

export function CredibilityStrip() {
  return (
    <section className="w-full border-y border-gunmetal bg-charcoal">
      <div className="flex w-full items-center justify-between px-4 py-5 sm:px-8 lg:px-12 xl:px-16">
        {credibilityItems.map((item, index) => (
          <Fragment key={item}>
            {index > 0 ? (
              <span className="shrink-0 px-2 text-gold/60 sm:px-4" aria-hidden>
                •
              </span>
            ) : null}
            <span className="flex-1 text-center font-display text-[0.65rem] font-semibold tracking-[0.14em] text-gold uppercase sm:text-xs lg:text-sm">
              {item}
            </span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
