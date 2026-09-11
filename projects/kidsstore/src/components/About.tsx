import type { Dictionary } from "@/lib/i18n/getDictionary";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-16">
        <h2 className="text-2xl leading-snug md:col-span-5 md:col-start-1 md:text-3xl">
          {dict.about.heading}
        </h2>
        <p className="max-w-prose text-base leading-relaxed text-ink/70 md:col-span-6 md:col-start-7">
          {dict.about.body}
        </p>
      </div>
    </section>
  );
}
