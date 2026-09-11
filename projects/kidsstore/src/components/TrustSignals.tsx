import type { Dictionary } from "@/lib/i18n/getDictionary";

function LeafIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 text-sage" fill="none" aria-hidden="true">
      <path d="M8 32C8 16 20 8 32 8c0 16-12 24-24 24Z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 30 26 12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 text-terracotta" fill="none" aria-hidden="true">
      <path
        d="M20 6 32 11v9c0 9-5.5 14.5-12 17-6.5-2.5-12-8-12-17v-9L20 6Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M14 20l4 4 8-9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-8 w-8 text-ink/70" fill="none" aria-hidden="true">
      <path
        d="M9 20a11 11 0 0 1 19-7.5M31 20a11 11 0 0 1-19 7.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M28 8v5h-5M12 32v-5h5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function TrustSignals({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: <LeafIcon />, ...dict.trust.materials },
    { icon: <ShieldIcon />, ...dict.trust.safety },
    { icon: <LoopIcon />, ...dict.trust.returns },
  ];

  return (
    <section className="border-y border-ink/10 px-6 py-24 md:px-12 md:py-28">
      <h2 className="max-w-lg text-2xl leading-snug md:text-3xl">{dict.trust.heading}</h2>

      <dl className="mt-12 grid gap-10 divide-y divide-ink/10 md:grid-cols-3 md:gap-8 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <div key={item.title} className="pt-8 first:pt-0 md:px-6 md:pt-0 md:first:pl-0">
            {item.icon}
            <dt className="mt-4 text-lg">{item.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink/60">{item.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
