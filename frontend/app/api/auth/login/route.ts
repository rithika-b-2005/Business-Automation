import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, phone, password } = body

    if ((!email && !phone) || !password) {
      return NextResponse.json({ error: "Email or phone and password are required." }, { status: 400 })
    }

    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      return NextResponse.json({ error: "No account found." }, { status: 404 })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 })
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email ?? user.phone, firstName: user.firstName },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone },
    })

    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
