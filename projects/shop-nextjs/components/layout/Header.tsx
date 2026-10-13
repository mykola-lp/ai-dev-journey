"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/context/CartContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const { totalItems } = useCart();

  return (
    <header className="border-b border-sand">
      <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-xl text-ink">
          {tCommon("siteName")}
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-ink hover:text-forest">
            {tNav("home")}
          </Link>
          <Link href="/cart" className="flex items-center gap-1.5 text-ink hover:text-forest">
            {tNav("cart")}
            {totalItems > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rust px-1 text-xs text-paper">
                {totalItems}
              </span>
            )}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
