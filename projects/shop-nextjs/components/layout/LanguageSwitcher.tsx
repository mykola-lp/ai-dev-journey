"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1" aria-label={t("label")}>
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          aria-current={locale === code}
          className={`rounded-sm px-2 py-1 text-sm uppercase transition-colors ${
            locale === code
              ? "bg-forest text-paper"
              : "text-stone hover:bg-sand hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
