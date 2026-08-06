import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FALLBACK_PATH =
  "/wp-content/uploads/sites/32/2025/10/tech_12-min-768x381.jpg";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/category/tech") {
    return NextResponse.redirect(new URL("/category/tech-2", request.url));
  }

  if (
    pathname.startsWith("/wp-content/uploads/") &&
    (pathname.includes("-500x500.") ||
      pathname.includes("-1024x508.") ||
      pathname.includes("-1024x476."))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = FALLBACK_PATH;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/category/tech", "/wp-content/uploads/:path*"],
};
