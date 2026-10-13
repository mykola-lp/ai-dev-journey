"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Product, Locale, ViewMode } from "@/lib/types";
import { useView } from "@/context/ViewContext";
import { SortableProductItem } from "./SortableProductItem";

const CONTAINER_CLASS: Record<ViewMode, string> = {
  grid4: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
  grid2: "grid grid-cols-1 gap-5 sm:grid-cols-2",
  list: "flex flex-col",
};

export function ProductGrid({
  products,
  locale,
  view,
}: {
  products: Product[];
  locale: Locale;
  view: ViewMode;
}) {
  const { reorder } = useView();

  // Pointer sensor needs a small drag distance before activating, so a
  // plain click on the card (navigating to the product) never gets
  // swallowed as an accidental drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorder(String(active.id), String(over.id));
  }

  const strategy = view === "list" ? verticalListSortingStrategy : rectSortingStrategy;
  const ids = products.map((p) => p.id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={strategy}>
        <div className={CONTAINER_CLASS[view]}>
          {products.map((product) => (
            <SortableProductItem key={product.id} product={product} locale={locale} view={view} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
