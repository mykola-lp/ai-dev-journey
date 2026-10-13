import type { Locale } from "./types";

const LOCALE_TAG: Record<Locale, string> = {
  uk: "uk-UA",
  en: "en-US",
};

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
