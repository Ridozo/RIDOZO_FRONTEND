import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("Middleware running:", pathname);

  // All auth routes are public
  const isAuthRoute = pathname.startsWith("/auth");

  const isOpenRoute = pathname.startsWith("/open");

  // If route is NOT public and no token → redirect to login
  if (!isAuthRoute && !isOpenRoute && !token) {
    return NextResponse.redirect(new URL("/auth/user-login", request.url));
  }

  // If logged in and trying to access auth pages → redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/user-dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
