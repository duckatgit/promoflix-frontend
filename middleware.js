import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get("token") || ""; // Retrieve token from cookies (adjust if stored differently)

  const ispublicPaths =
    path === "/auth/login" || path === "/auth/signup" || path === "/auth/otp";

  // If token exists, redirect to `/home/instance`
  if (token && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home/instance", request.url));
  }

  if (ispublicPaths && token) {
    return NextResponse.redirect(new URL("/home/instance", request.url));
  }

  if (!token && !ispublicPaths) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Allow navigation to public routes or when token is valid
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*", // Match all `/home` routes
    "/auth/login",
    "/auth/signup",
    "/auth/otp",
  ],
};
