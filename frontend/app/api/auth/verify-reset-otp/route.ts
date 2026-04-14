import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { email, phone, otp } = await request.json()

    if ((!email && !phone) || !otp) {
      return NextResponse.json({ error: "Identifier and OTP are required." }, { status: 400 })
    }

    const record = email
      ? await prisma.passwordResetOtp.findUnique({ where: { email } })
      : await prisma.passwordResetOtp.findUnique({ where: { phone } })

    if (!record) {
      return NextResponse.json({ error: "No reset request found. Please start again." }, { status: 404 })
    }
    if (new Date() > record.expiresAt) {
      await prisma.passwordResetOtp.delete({ where: { id: record.id } })
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 410 })
    }
    if (record.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 401 })
    }

    // Generate a short-lived reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 min to complete reset

    await prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: { resetToken, expiresAt: tokenExpiry },
    })

    return NextResponse.json({ resetToken })
  } catch (err) {
    console.error("[verify-reset-otp]", err)
    return NextResponse.json({ error: "Verification failed." }, { status: 500 })
  }
}
