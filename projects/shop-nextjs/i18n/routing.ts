import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Single source of truth for supported locales.
 * "uk" (Ukrainian) is the default per the assignment; "en" is the second
 * language required by the "start with 2 languages" request.
 * Add more locale codes here + a matching messages/<locale>.json file
 * to extend the store to a third language later.
 */
export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  // "always" keeps the URL explicit (/uk/..., /en/...) which makes the
  // active language obvious in the address bar and avoids ambiguity
  // between the default locale and a locale-less route.
  localePrefix: "always",
});

// Locale-aware wrappers around next/link, next/navigation's router,
// usePathname, and redirect. Using these (instead of the plain next/*
// versions) automatically keeps the current locale prefix in the URL
// when the user navigates around the app.
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
