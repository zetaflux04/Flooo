import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken, verifyUserToken } from "@/lib/jwt";

const userProtected = ["/cart", "/checkout", "/orders", "/profile", "/order-success"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin-login" || pathname.startsWith("/admin-login/")) {
    const adminToken = request.cookies.get("adminToken")?.value;
    if (adminToken && (await verifyAdminToken(adminToken))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/register") {
    const userToken = request.cookies.get("userToken")?.value;
    if (userToken && (await verifyUserToken(userToken))) {
      const redirect = request.nextUrl.searchParams.get("redirect");
      const target =
        redirect &&
        redirect !== "/login" &&
        redirect !== "/register" &&
        !redirect.startsWith("/admin")
          ? redirect
          : "/";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const adminToken = request.cookies.get("adminToken")?.value;
    if (!adminToken || !(await verifyAdminToken(adminToken))) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    return NextResponse.next();
  }

  if (userProtected.some((p) => pathname.startsWith(p))) {
    const userToken =
      request.cookies.get("userToken")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    if (!userToken || !(await verifyUserToken(userToken))) {
      const login = new URL("/login", request.url);
      login.searchParams.set("redirect", pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/order-success/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
    "/admin-login",
    "/admin-login/:path*",
  ],
};
