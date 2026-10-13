import type { Product, Locale } from "@/lib/types";
import { localized } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { ProductSwatch } from "./ProductSwatch";
import { AddToCartButton } from "./AddToCartButton";
import { DragHandle } from "./DragHandle";
import { formatPrice } from "@/lib/format";
import type { DragHandleProps } from "./dragTypes";

export function ProductCardBig({
  product,
  locale,
  dragHandleProps,
}: {
  product: Product;
  locale: Locale;
  dragHandleProps?: DragHandleProps;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden border border-sand bg-white/40 sm:flex-row">
      <div className="absolute right-2 top-2 z-10 rounded-sm bg-paper/80 backdrop-blur-sm">
        <DragHandle {...dragHandleProps?.attributes} {...dragHandleProps?.listeners} />
      </div>
      <Link href={`/product/${product.id}`} className="block sm:w-1/2">
        <ProductSwatch color={product.accentColor} icon={product.icon} className="h-56 w-full sm:h-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-xs text-stone">{localized(product.category, locale)}</p>
        <Link href={`/product/${product.id}`} className="font-display text-2xl leading-snug text-ink hover:underline">
          {localized(product.name, locale)}
        </Link>
        <p className="text-sm leading-relaxed text-stone line-clamp-3">
          {localized(product.description, locale)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="font-display text-xl text-ink">{formatPrice(product.price, locale)}</span>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
