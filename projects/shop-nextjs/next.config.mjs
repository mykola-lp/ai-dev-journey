import createNextIntlPlugin from "next-intl/plugin";

// Points at the request-config file that loads the right message bundle
// (uk.json / en.json) for every server render. See i18n/request.ts.
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keeping this empty on purpose: the task forbids relying on external
  // APIs/services, so there is no images.domains / rewrites / env wiring
  // to third-party hosts here. Everything the app needs ships locally.
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
