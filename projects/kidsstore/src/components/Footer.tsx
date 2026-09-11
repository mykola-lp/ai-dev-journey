import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/getDictionary";

import LocaleSwitcher from "./LocaleSwitcher";

const socials = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Facebook", href: "https://facebook.com" },
];

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="border-t border-ink/10 px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg">{dict.hero.kicker}</p>
          <p className="mt-2 max-w-sm text-sm text-ink/60">{dict.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-4 text-sm">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-ink/60 transition-colors hover:text-ink"
              >
                {s.name}
              </a>
            ))}
          </div>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-xs text-ink/40">
        © {new Date().getFullYear()} KidsStore. {dict.footer.copyright}
      </p>
    </footer>
  );
}
