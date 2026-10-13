import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every route except API handlers, Next internals and files
  // that already contain a dot (favicon.ico, images, etc.).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
