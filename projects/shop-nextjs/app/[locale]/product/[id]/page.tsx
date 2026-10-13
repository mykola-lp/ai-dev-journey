import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProducts, getProductById } from "@/lib/products";
import { localized, type Locale } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { ProductSwatch } from "@/components/product/ProductSwatch";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { formatPrice } from "@/lib/format";

// Pre-render every product/locale combination at build time -- this is
// the SSG path the assignment asks for; the home page's client-side
// fetch against /api/products is the complementary dynamic path.
export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-stone">{t("notFound")}</p>
        <Link href="/" className="text-forest underline underline-offset-2 hover:text-forest-dark">
          {t("notFoundCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="w-fit text-sm text-stone hover:text-forest">
        ← {t("back")}
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <ProductSwatch color={product.accentColor} icon={product.icon} className="h-72 w-full rounded-md sm:h-full" />

        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone">{localized(product.category, locale)}</p>
          <h1 className="font-display text-3xl text-ink">{localized(product.name, locale)}</h1>
          <p className="font-display text-2xl text-ink">{formatPrice(product.price, locale)}</p>

          <div>
            <h2 className="text-sm font-medium text-ink">{t("description")}</h2>
            <p className="mt-1 leading-relaxed text-stone">{localized(product.description, locale)}</p>
          </div>

          <AddToCartButton productId={product.id} className="mt-2 w-fit px-6 py-3 text-base" />
        </div>
      </div>
    </div>
  );
}
