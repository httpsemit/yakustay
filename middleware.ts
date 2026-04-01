import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/book",
  "/account",
  "/loyalty",
  "/referral",
  "/admin",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  // Check for session cookie set after login
  const session = req.cookies.get("session")?.value;
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/book/:path*",
    "/account/:path*",
    "/loyalty/:path*",
    "/referral/:path*",
    "/admin/:path*",
  ],
};
