import jwt from "jsonwebtoken"
import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET!

export type AccessTokenPayload = {
  sub: string
  email?: string | null
  firstName: string
  role: string
  platformAccess: string[]
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
}

export function verifyAccessToken(token: string): AccessTokenPayload & { iat: number; exp: number } {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload & { iat: number; exp: number }
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex")
}

export const COOKIE = {
  ACCESS:           "access_token",
  REFRESH:          "refresh_token",
  ACCESS_MAX_AGE:   60 * 15,             // 15 min
  REFRESH_MAX_AGE:  60 * 60 * 24 * 7,   // 7 days
  BASE: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax"  as const,
    path:     "/",
  },
}
