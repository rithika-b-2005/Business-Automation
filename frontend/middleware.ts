import { NextRequest, NextResponse } from "next/server"

const ACCESS_COOKIE  = "access_token"
const REFRESH_COOKIE = "refresh_token"
const JWT_SECRET  = new TextEncoder().encode(process.env.JWT_SECRET!)

// Routes that do NOT require authentication
const PUBLIC = [
  "/",
  "/register",
  "/contact",
  "/demo",
  "/careers",
  "/landing",  // landing is public (marketing page)
]

const PUBLIC_PREFIXES = [
  "/api/auth/",
  "/_next/",
  "/img/",
  "/favicon",
]

function isPublic(pathname: string) {
  if (PUBLIC.includes(pathname)) return true
  return PUBLIC_PREFIXES.some(p => pathname.startsWith(p))
}

// Routes that require a valid session
const PROTECTED_PREFIXES = ["/explore", "/dashboard"]

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
}

async function verifyJWT(token: string): Promise<{ valid: boolean; expired: boolean }> {
  try {
    // Lazy-load jose to avoid build-time module resolution
    // eslint-disable-next-line global-require
    const { jwtVerify } = require("jose")
    await jwtVerify(token, JWT_SECRET)
    return { valid: true, expired: false }
  } catch (e: any) {
    if (e?.code === "ERR_JWT_EXPIRED") return { valid: false, expired: true }
    return { valid: false, expired: false }
  }
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone()
  url.pathname = "/"
  url.search = ""
  // Only store pathname so we don't double-encode full URLs
  if (req.nextUrl.pathname !== "/") {
    url.searchParams.set("redirect", req.nextUrl.pathname)
  }
  const res = NextResponse.redirect(url)
  res.cookies.set(ACCESS_COOKIE,  "", { httpOnly: true, path: "/", maxAge: 0 })
  res.cookies.set(REFRESH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  return res
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip unprotected routes entirely
  if (isPublic(pathname) || !isProtected(pathname)) {
    return NextResponse.next()
  }

  const accessToken  = req.cookies.get(ACCESS_COOKIE)?.value
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value

  // 1. Valid access token → allow through
  if (accessToken) {
    const { valid, expired } = await verifyJWT(accessToken)
    if (valid) return NextResponse.next()
    if (!expired) return redirectToLogin(req) // tampered token
  }

  // 2. No valid access token — try refresh
  if (!refreshToken) return redirectToLogin(req)

  try {
    const refreshRes = await fetch(new URL("/api/auth/refresh", req.nextUrl.origin).toString(), {
      method:  "POST",
      headers: { cookie: `${REFRESH_COOKIE}=${refreshToken}` },
    })

    if (!refreshRes.ok) return redirectToLogin(req)

    const { accessToken: newAccess, refreshToken: newRefresh } = await refreshRes.json()

    const cookieOpts = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path:     "/",
    }
    const response = NextResponse.next()
    response.cookies.set(ACCESS_COOKIE,  newAccess,  { ...cookieOpts, maxAge: 60 * 15 })
    response.cookies.set(REFRESH_COOKIE, newRefresh, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch {
    return redirectToLogin(req)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
