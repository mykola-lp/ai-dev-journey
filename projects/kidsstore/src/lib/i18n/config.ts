export const locales = ["uk", "en", "de", "fr", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

export const localeMeta: Record<
  Locale,
  { label: string; currency: string; currencyLocale: string }
> = {
  uk: { label: "UA", currency: "UAH", currencyLocale: "uk-UA" },
  en: { label: "EN", currency: "USD", currencyLocale: "en-US" },
  de: { label: "DE", currency: "EUR", currencyLocale: "de-DE" },
  fr: { label: "FR", currency: "EUR", currencyLocale: "fr-FR" },
  pl: { label: "PL", currency: "EUR", currencyLocale: "pl-PL" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function formatPrice(amount: number, locale: Locale): string {
  const meta = localeMeta[locale];
  return new Intl.NumberFormat(meta.currencyLocale, {
    style: "currency",
    currency: meta.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
