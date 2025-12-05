import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("admin_auth");

  // If the request makes it to this function, it must be in the 'matcher' list.
  if (!isAuthenticated) {
    // Redirect everything matched in the config below to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Explicitly list all paths that require authentication here:
export const config = {
  matcher: [
    "/admin_dashboard", 
    "/settings",
    "/admin",
    "/dashboard/:path*",
  ],
};
