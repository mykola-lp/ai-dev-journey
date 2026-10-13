/**
 * A dedicated drag handle (rather than making the whole card draggable)
 * so pointer-down on the product link or the "Add to cart" button never
 * gets mistaken for the start of a drag gesture.
 */
export function DragHandle(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`flex h-8 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-stone transition-colors hover:bg-sand active:cursor-grabbing ${props.className ?? ""}`}
      aria-label="Drag to reorder"
      role="button"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
        <circle cx="5" cy="3" r="1.3" />
        <circle cx="11" cy="3" r="1.3" />
        <circle cx="5" cy="8" r="1.3" />
        <circle cx="11" cy="8" r="1.3" />
        <circle cx="5" cy="13" r="1.3" />
        <circle cx="11" cy="13" r="1.3" />
      </svg>
    </div>
  );
}
