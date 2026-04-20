import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken, COOKIE } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE.ACCESS)?.value

    // Also accept old 'auth' cookie for backward compat during transition
    const legacy = req.cookies.get("auth")?.value

    const raw = token || legacy
    if (!raw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyAccessToken(raw)
    return NextResponse.json({
      id:             payload.sub,
      email:          payload.email,
      firstName:      payload.firstName,
      role:           payload.role,
      platformAccess: payload.platformAccess ?? [],
    })
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
  }
}
