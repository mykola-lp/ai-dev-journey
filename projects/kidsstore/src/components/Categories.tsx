import type { Dictionary } from "@/lib/i18n/getDictionary";

export default function Categories({ dict }: { dict: Dictionary }) {
  const items = [
    { ...dict.categories.clothing, tint: "bg-terracotta/10", span: "md:col-span-7" },
    { ...dict.categories.toys, tint: "bg-sage/10", span: "md:col-span-5" },
    { ...dict.categories.accessories, tint: "bg-ink/[0.04]", span: "md:col-span-12" },
  ];

  return (
    <section id="categories" className="px-6 py-24 md:px-12 md:py-32">
      <h2 className="max-w-lg text-2xl leading-snug md:text-3xl">{dict.categories.heading}</h2>

      <div className="mt-12 grid gap-4 md:grid-cols-12">
        {items.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`group relative flex min-h-[220px] flex-col justify-end rounded-2xl p-8 transition-colors ${item.tint} ${item.span}`}
          >
            <h3 className="text-2xl transition-transform group-hover:translate-x-1">{item.name}</h3>
            <p className="mt-2 max-w-sm text-sm text-ink/60">{item.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
