import type { Metadata } from "next";

import Footer from "@/components/Footer";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { defaultLocale, isLocale, type Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

import "../globals.css";

// Loaded via <link> rather than next/font/google: next/font fetches Google's
// CSS at build time, which fails in network-restricted CI/sandbox setups.
// A plain stylesheet link degrades gracefully (falls back to serif/sans-serif)
// and still supports Cyrillic (Fraunces itself has no cyrillic subset, so
// Cyrillic headline glyphs will render in the fallback serif — expected).
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,600;0,900;1,400&family=Inter:wght@400;500;600&display=swap";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 md:px-12">
          <a
            href={locale === defaultLocale ? "/" : `/${locale}`}
            className="font-display text-lg tracking-tight"
          >
            {dict.hero.kicker}
          </a>
          <LocaleSwitcher currentLocale={locale} />
        </header>
        <main>{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
