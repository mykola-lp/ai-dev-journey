"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Locale } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export function CartSummary({ locale }: { locale: Locale }) {
  const t = useTranslations("cart");
  const { totalItems, totalPrice, clear } = useCart();
  const [done, setDone] = useState(false);

  function handleCheckout() {
    // Deliberately a no-op mock: the assignment forbids talking to any
    // real external service, so "checkout" just confirms and clears the
    // local cart instead of posting anywhere.
    clear();
    setDone(true);
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-sand bg-white/60 p-6">
      <div className="flex items-center justify-between">
        <span className="text-stone">{t("itemCount", { count: totalItems })}</span>
        <span className="font-display text-2xl text-ink">{formatPrice(totalPrice, locale)}</span>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={totalItems === 0}
        className="w-full rounded-sm bg-forest px-4 py-3 text-sm font-medium text-paper transition-colors hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("checkout")}
      </button>

      <p className="text-xs text-stone">{t("checkoutNote")}</p>

      {done && <p className="text-sm text-forest-dark">{t("checkoutDone")}</p>}
    </div>
  );
}
