"use client";

import { usePathname } from "next/navigation";

import { defaultLocale, type Locale, localeMeta, locales } from "@/lib/i18n/config";

function pathWithoutLocale(pathname: string, currentLocale: Locale): string {
  if (currentLocale === defaultLocale) return pathname;
  const prefix = `/${currentLocale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

function hrefFor(locale: Locale, restPath: string): string {
  if (locale === defaultLocale) return restPath || "/";
  return `/${locale}${restPath === "/" ? "" : restPath}`;
}

export default function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname() || "/";
  const restPath = pathWithoutLocale(pathname, currentLocale);

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm">
      {locales.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          <a
            href={hrefFor(locale, restPath)}
            aria-current={locale === currentLocale ? "true" : undefined}
            className={
              locale === currentLocale ? "text-ink" : "text-ink/45 transition-colors hover:text-ink"
            }
          >
            {localeMeta[locale].label}
          </a>
          {index < locales.length - 1 && <span className="text-ink/20">/</span>}
        </span>
      ))}
    </nav>
  );
}
