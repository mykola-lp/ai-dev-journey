import type { IconKey } from "@/lib/types";

/**
 * The test task runs fully offline with no external services, so instead
 * of sourcing stock photography we represent each product with a flat
 * colour swatch (from the product's own `accentColor`) plus a small line
 * icon for its category. It reads more like catalogue swatches than a
 * broken <img>, and it keeps the whole app self-contained.
 */
const ICONS: Record<IconKey, JSX.Element> = {
  chair: (
    <path d="M7 4v9m10-9v14M7 13h10M5 21l2-4h10l2 4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  table: (
    <path d="M3 8h18M6 8v11M18 8v11M3 8l1.5-4h15L21 8" strokeLinecap="round" strokeLinejoin="round" />
  ),
  lamp: (
    <path d="M9 4h6l2 6H7l2-6zM12 10v7m-4 4h8l-1.5-4h-5L8 21z" strokeLinecap="round" strokeLinejoin="round" />
  ),
  textile: (
    <path d="M4 6c2 2 2 4 0 6s-2 4 0 6M20 6c-2 2-2 4 0 6s2 4 0 6M9 5v14M15 5v14" strokeLinecap="round" strokeLinejoin="round" />
  ),
  storage: (
    <path d="M4 4h16v16H4zM4 10h16M9 10v10" strokeLinecap="round" strokeLinejoin="round" />
  ),
  decor: (
    <path d="M12 3c3 3 5 6 5 9a5 5 0 1 1-10 0c0-3 2-6 5-9zM7 21h10" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export function ProductSwatch({
  color,
  icon,
  className = "",
}: {
  color: string;
  icon: IconKey;
  className?: string;
}) {
  // Pick readable icon ink: light swatches get dark strokes, dark swatches
  // get a warm off-white stroke.
  const isLight = isLightColor(color);
  const stroke = isLight ? "#211D18" : "#F7F4EC";

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={1.4}
        className="h-10 w-10 opacity-80"
      >
        {ICONS[icon]}
      </svg>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Standard perceived-brightness formula.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 170;
}
