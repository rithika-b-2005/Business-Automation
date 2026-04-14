import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetOtpEmail } from "@/lib/email"
import { sendSmsOtp } from "@/lib/sms"

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json()

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone number is required." }, { status: 400 })
    }

    // Find user
    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findUnique({ where: { phone } })

    if (!user) {
      return NextResponse.json({ error: "No account found with that email or phone." }, { status: 404 })
    }

    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    if (email) {
      await prisma.passwordResetOtp.upsert({
        where: { email },
        update: { otp, expiresAt, resetToken: null, phone: null },
        create: { email, otp, expiresAt },
      })
      await sendPasswordResetOtpEmail(email, user.firstName, otp)
    } else {
      await prisma.passwordResetOtp.upsert({
        where: { phone },
        update: { otp, expiresAt, resetToken: null, email: null },
        create: { phone, otp, expiresAt },
      })
      await sendSmsOtp(phone!, otp)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[forgot-password]", err)
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 })
  }
}
