import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProducts, getCategories } from "@/lib/products";
import { ShopClient } from "@/components/shop/ShopClient";
import type { Locale } from "@/lib/types";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const categories = getCategories();
  // Used as the top end of the price-range filter; rounding up keeps the
  // slider's max a clean number instead of an arbitrary product price.
  const priceCeiling = Math.ceil(Math.max(...getAllProducts().map((p) => p.price)) / 10) * 10;

  return (
    <div className="flex flex-col gap-10">
      <section className="max-w-2xl">
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone">{t("heroSubtitle")}</p>
      </section>

      <ShopClient locale={locale} categories={categories} priceCeiling={priceCeiling} />
    </div>
  );
}
