import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login"];
const USER_ID_PATTERN = /^[A-Za-z0-9]{6,}$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const isApiPath = pathname.startsWith("/api/");
  const cookieValue = request.cookies.get("userId")?.value ?? "";
  const hasValidUserId = USER_ID_PATTERN.test(cookieValue);

  if (isApiPath) {
    return NextResponse.next();
  }

  if (!hasValidUserId && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasValidUserId && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
