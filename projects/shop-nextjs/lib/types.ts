export type Locale = "uk" | "en";

/** Any user-facing string that needs both a uk and an en version. */
export interface LocalizedText {
  uk: string;
  en: string;
}

/** Which built-in line icon represents this product on its placeholder swatch. */
export type IconKey = "chair" | "table" | "lamp" | "textile" | "storage" | "decor";

export interface Product {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  /** Stable, un-translated key used for filtering/grouping. */
  categoryKey: string;
  price: number;
  /** Hex colour for the product's placeholder swatch (see ProductSwatch). */
  accentColor: string;
  icon: IconKey;
}

/** The three interchangeable ways a product can be rendered on the home page. */
export type ViewMode = "grid4" | "grid2" | "list";

export function localized(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text.en;
}
