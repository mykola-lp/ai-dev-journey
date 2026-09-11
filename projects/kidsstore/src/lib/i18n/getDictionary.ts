import type { Locale } from "./config";

const dictionaries = {
  uk: () => import("./dictionaries/uk.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["uk"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.uk;
  return loader();
}
