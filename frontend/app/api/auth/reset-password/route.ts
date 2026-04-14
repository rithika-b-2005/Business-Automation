import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { resetToken, password } = await request.json()

    if (!resetToken || !password) {
      return NextResponse.json({ error: "Reset token and new password are required." }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
    }

    const record = await prisma.passwordResetOtp.findUnique({ where: { resetToken } })

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset link. Please start again." }, { status: 404 })
    }
    if (new Date() > record.expiresAt) {
      await prisma.passwordResetOtp.delete({ where: { id: record.id } })
      return NextResponse.json({ error: "Reset session expired. Please start again." }, { status: 410 })
    }

    const hashed = await bcrypt.hash(password, 12)

    if (record.email) {
      await prisma.user.update({ where: { email: record.email }, data: { password: hashed } })
    } else if (record.phone) {
      await prisma.user.update({ where: { phone: record.phone }, data: { password: hashed } })
    }

    await prisma.passwordResetOtp.delete({ where: { id: record.id } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[reset-password]", err)
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 })
  }
}
