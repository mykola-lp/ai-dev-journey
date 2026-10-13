"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  productId,
  quantity = 1,
  className = "",
}: {
  productId: string;
  quantity?: number;
  className?: string;
}) {
  const t = useTranslations("product");
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    // Cards wrap this button in a <Link>; stop the click from also
    // triggering navigation to the product page.
    e.preventDefault();
    e.stopPropagation();
    addItem(productId, quantity);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
        justAdded
          ? "bg-forest-dark text-paper"
          : "bg-forest text-paper hover:bg-forest-dark"
      } ${className}`}
    >
      {justAdded ? t("added") : t("addToCart")}
    </button>
  );
}
