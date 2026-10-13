import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // `requestLocale` comes from the [locale] URL segment via middleware.
  let locale = await requestLocale;

  // Guard against an unknown/missing locale (e.g. a stale bookmark)
  // by silently falling back to the default instead of 404ing.
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Messages are bundled JSON, not fetched from anywhere -- keeps the
    // app fully local per the assignment's constraints.
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
