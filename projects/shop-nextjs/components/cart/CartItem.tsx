"use client";

import { useTranslations } from "next-intl";
import type { Locale, Product } from "@/lib/types";
import { localized } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { ProductSwatch } from "@/components/product/ProductSwatch";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function CartItem({
  product,
  quantity,
  locale,
}: {
  product: Product;
  quantity: number;
  locale: Locale;
}) {
  const t = useTranslations("cart");
  const { setQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 border-b border-sand py-4">
      <Link href={`/product/${product.id}`} className="shrink-0">
        <ProductSwatch color={product.accentColor} icon={product.icon} className="h-16 w-16 rounded-sm" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/product/${product.id}`} className="block truncate font-display text-base text-ink hover:underline">
          {localized(product.name, locale)}
        </Link>
        <p className="text-xs text-stone">
          {t("unitPrice")}: {formatPrice(product.price, locale)}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <span className="sr-only">{t("quantity")}</span>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(product.id, Number(e.target.value))}
          className="w-16 rounded-sm border border-sand px-2 py-1 text-center"
        />
      </label>

      <span className="w-20 shrink-0 text-right font-display text-base text-ink">
        {formatPrice(product.price * quantity, locale)}
      </span>

      <button
        type="button"
        onClick={() => removeItem(product.id)}
        className="shrink-0 text-sm text-rust underline decoration-rust/40 underline-offset-2 hover:text-rust-dark"
      >
        {t("remove")}
      </button>
    </div>
  );
}
