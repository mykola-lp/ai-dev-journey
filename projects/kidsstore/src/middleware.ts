import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/lib/i18n/config";

// uk is the root/default locale: it is served at "/" with no prefix.
// Every other locale is served under its own prefix ("/en", "/de", ...).
// A request for the default locale's own prefix ("/uk/...") is redirected
// back to the unprefixed path so there is exactly one canonical URL per page.

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && isLocale(firstSegment)) {
    if (firstSegment === defaultLocale) {
      const rest = segments.slice(1).join("/");
      const url = request.nextUrl.clone();
      url.pathname = rest ? `/${rest}` : "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  const rewritten = NextResponse.rewrite(url);
  return rewritten;
}
