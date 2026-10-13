import type { Product, Locale } from "@/lib/types";
import { localized } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { ProductSwatch } from "./ProductSwatch";
import { AddToCartButton } from "./AddToCartButton";
import { DragHandle } from "./DragHandle";
import { formatPrice } from "@/lib/format";
import type { DragHandleProps } from "./dragTypes";

export function ProductListItem({
  product,
  locale,
  dragHandleProps,
}: {
  product: Product;
  locale: Locale;
  dragHandleProps?: DragHandleProps;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-sand py-3">
      <DragHandle {...dragHandleProps?.attributes} {...dragHandleProps?.listeners} />
      <Link href={`/product/${product.id}`} className="shrink-0">
        <ProductSwatch color={product.accentColor} icon={product.icon} className="h-14 w-14 rounded-sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/product/${product.id}`} className="block truncate font-display text-base text-ink hover:underline">
          {localized(product.name, locale)}
        </Link>
        <p className="truncate text-xs text-stone">{localized(product.category, locale)}</p>
      </div>
      <span className="hidden shrink-0 font-display text-base text-ink sm:block">
        {formatPrice(product.price, locale)}
      </span>
      <AddToCartButton productId={product.id} className="shrink-0" />
    </div>
  );
}
