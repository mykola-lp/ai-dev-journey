import type { Dictionary } from "@/lib/i18n/getDictionary";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 md:px-12">
      <svg
        aria-hidden="true"
        viewBox="0 0 600 600"
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[640px] w-[640px] -translate-y-1/2 text-sage/60 md:block"
        fill="none"
      >
        <path
          d="M120 300c0-140 90-230 230-230s230 100 230 230-100 250-230 250S120 440 120 300Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M210 300c0-95 45-160 140-160s140 75 140 160-55 170-140 170-140-75-140-170Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-terracotta/50"
        />
        <circle cx="330" cy="150" r="8" fill="currentColor" className="text-terracotta/70" />
      </svg>

      <div className="relative max-w-2xl animate-reveal">
        <p className="mb-6 text-sm text-ink/50">{dict.hero.kicker}</p>
        <h1 className="text-4xl leading-[1.1] tracking-tight md:text-6xl">{dict.hero.headline}</h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 md:text-lg">
          {dict.hero.sub}
        </p>
      </div>
    </section>
  );
}
