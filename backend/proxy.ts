import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public paths that don't require authentication
const PUBLIC_PATHS = ["/", "/register", "/careers", "/careers/apply", "/contact", "/explore", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/jobs", "/api/contact"]

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth")?.value
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith("/api/auth/") || pathname.startsWith("/api/jobs") || pathname.startsWith("/api/contact") || pathname.startsWith("/careers") || pathname.startsWith("/contact") || pathname.startsWith("/explore"))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect logged-in users away from login/register pages
  if (token && (pathname === "/" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/landing", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img|.*\\.png$|.*\\.svg$|.*\\.ico$).*)"],
}
