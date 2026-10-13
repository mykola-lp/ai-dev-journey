"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale, Product } from "@/lib/types";
import { useView } from "@/context/ViewContext";
import { ViewSwitcher } from "@/components/product/ViewSwitcher";
import { FilterBar, type CategoryOption } from "@/components/product/FilterBar";
import { ProductGrid } from "@/components/product/ProductGrid";

export function ShopClient({
  locale,
  categories,
  priceCeiling,
}: {
  locale: Locale;
  categories: CategoryOption[];
  priceCeiling: number;
}) {
  const t = useTranslations("home");
  const { view, sortByOrder, registerIds } = useView();

  const [category, setCategory] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);

  // Re-fetch from the Next.js API route whenever a filter changes. This is
  // the app's one client-side data fetch, and it's what satisfies the
  // "use API routes to get product data" requirement -- the catalogue is
  // never imported directly into a client component.
  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (maxPrice !== null) params.set("maxPrice", String(maxPrice));

    setProducts(null);
    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data: { products: Product[] }) => {
        if (cancelled) return;
        registerIds(data.products.map((p) => p.id));
        setProducts(data.products);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- registerIds is stable per render tree
  }, [category, maxPrice]);

  function resetFilters() {
    setCategory(null);
    setMaxPrice(null);
  }

  const ordered = products ? sortByOrder(products) : null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand pb-4">
        <FilterBar
          locale={locale}
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          maxPrice={maxPrice}
          priceCeiling={priceCeiling}
          onMaxPriceChange={setMaxPrice}
          onReset={resetFilters}
        />
        <ViewSwitcher />
      </div>

      <p className="text-sm text-stone">{t("dragHint")}</p>

      {ordered === null && <p className="py-12 text-center text-stone">{t("loading")}</p>}

      {ordered !== null && ordered.length === 0 && (
        <p className="py-12 text-center text-stone">{t("empty")}</p>
      )}

      {ordered !== null && ordered.length > 0 && (
        <ProductGrid products={ordered} locale={locale} view={view} />
      )}
    </section>
  );
}
