"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/products";
import type { Locale } from "@/lib/types";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const { lines } = useCart();

  const resolvedLines = lines
    .map((line) => ({ line, product: getProductById(line.productId) }))
    // A product could theoretically be removed from the catalogue while
    // still sitting in someone's saved cart -- skip it rather than crash.
    .filter((entry): entry is { line: typeof entry.line; product: NonNullable<typeof entry.product> } =>
      Boolean(entry.product)
    );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl text-ink">{t("title")}</h1>

      {resolvedLines.length === 0 ? (
        <div className="flex flex-col items-start gap-3 py-8">
          <p className="text-stone">{t("empty")}</p>
          <Link href="/" className="text-forest underline underline-offset-2 hover:text-forest-dark">
            {t("emptyCta")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col">
            {resolvedLines.map(({ line, product }) => (
              <CartItem key={product.id} product={product} quantity={line.quantity} locale={locale} />
            ))}
          </div>
          <CartSummary locale={locale} />
        </div>
      )}
    </div>
  );
}
