"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Product, Locale, ViewMode } from "@/lib/types";
import { ProductCardClassic } from "./ProductCardClassic";
import { ProductCardBig } from "./ProductCardBig";
import { ProductListItem } from "./ProductListItem";

export function SortableProductItem({
  product,
  locale,
  view,
}: {
  product: Product;
  locale: Locale;
  view: ViewMode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : "auto",
  };

  const dragHandleProps = { attributes, listeners };

  return (
    <div ref={setNodeRef} style={style}>
      {view === "grid4" && (
        <ProductCardClassic product={product} locale={locale} dragHandleProps={dragHandleProps} />
      )}
      {view === "grid2" && (
        <ProductCardBig product={product} locale={locale} dragHandleProps={dragHandleProps} />
      )}
      {view === "list" && (
        <ProductListItem product={product} locale={locale} dragHandleProps={dragHandleProps} />
      )}
    </div>
  );
}
