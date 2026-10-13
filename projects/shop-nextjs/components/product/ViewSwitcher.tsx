"use client";

import { useTranslations } from "next-intl";
import { useView } from "@/context/ViewContext";
import type { ViewMode } from "@/lib/types";

const OPTIONS: { mode: ViewMode; icon: JSX.Element }[] = [
  {
    mode: "grid4",
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
        <rect x="1" y="1" width="6" height="6" />
        <rect x="9" y="1" width="6" height="6" />
        <rect x="1" y="9" width="6" height="6" />
        <rect x="9" y="9" width="6" height="6" />
      </svg>
    ),
  },
  {
    mode: "grid2",
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
        <rect x="1" y="1" width="6.5" height="14" />
        <rect x="8.5" y="1" width="6.5" height="14" />
      </svg>
    ),
  },
  {
    mode: "list",
    icon: (
      <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor">
        <rect x="1" y="2" width="14" height="2.5" />
        <rect x="1" y="6.75" width="14" height="2.5" />
        <rect x="1" y="11.5" width="14" height="2.5" />
      </svg>
    ),
  },
];

export function ViewSwitcher() {
  const t = useTranslations("view");
  const { view, setView } = useView();

  return (
    <div role="radiogroup" aria-label={t("switcherLabel")} className="flex items-center gap-1 rounded-sm border border-sand p-1">
      {OPTIONS.map(({ mode, icon }) => (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={view === mode}
          title={t(mode)}
          onClick={() => setView(mode)}
          className={`flex h-8 w-8 items-center justify-center rounded-sm transition-colors ${
            view === mode
              ? "bg-forest text-paper"
              : "text-stone hover:bg-sand hover:text-ink"
          }`}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
