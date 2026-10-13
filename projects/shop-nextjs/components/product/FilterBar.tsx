"use client";

import { useTranslations } from "next-intl";
import type { Locale, LocalizedText } from "@/lib/types";
import { localized } from "@/lib/types";

export interface CategoryOption {
  key: string;
  name: LocalizedText;
}

export function FilterBar({
  locale,
  categories,
  category,
  onCategoryChange,
  maxPrice,
  priceCeiling,
  onMaxPriceChange,
  onReset,
}: {
  locale: Locale;
  categories: CategoryOption[];
  category: string | null;
  onCategoryChange: (key: string | null) => void;
  maxPrice: number | null;
  priceCeiling: number;
  onMaxPriceChange: (value: number | null) => void;
  onReset: () => void;
}) {
  const t = useTranslations("filters");
  const isFiltered = category !== null || maxPrice !== null;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-stone">{t("categoryLabel")}</span>
        <select
          value={category ?? "all"}
          onChange={(e) => onCategoryChange(e.target.value === "all" ? null : e.target.value)}
          className="rounded-sm border border-sand bg-white px-2 py-1.5 text-ink"
        >
          <option value="all">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {localized(c.name, locale)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-stone">
          {t("priceLabel")} — {maxPrice ?? priceCeiling}
        </span>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={10}
          value={maxPrice ?? priceCeiling}
          onChange={(e) => {
            const value = Number(e.target.value);
            onMaxPriceChange(value >= priceCeiling ? null : value);
          }}
          className="accent-forest w-40"
        />
      </label>

      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-rust underline decoration-rust/40 underline-offset-2 hover:text-rust-dark"
        >
          {t("reset")}
        </button>
      )}
    </div>
  );
}
