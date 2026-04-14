import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendOtpEmail } from "@/lib/email"
import { sendSmsOtp } from "@/lib/sms"

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phone, company, password } = await request.json()

    if (!firstName || !lastName || (!email && !phone) || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
    }

    // Check for existing account
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
      }
    }
    if (phone) {
      const existing = await prisma.user.findUnique({ where: { phone } })
      if (existing) {
        return NextResponse.json({ error: "An account with this phone number already exists." }, { status: 409 })
      }
    }

    const hashed = await bcrypt.hash(password, 12)
    const otp = generateOtp()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    if (email) {
      await prisma.registrationOtp.upsert({
        where: { email },
        update: { firstName, lastName, company: company || null, password: hashed, otp, expiresAt, phone: null },
        create: { email, firstName, lastName, company: company || null, password: hashed, otp, expiresAt },
      })
      await sendOtpEmail(email, firstName, otp)
    } else {
      await prisma.registrationOtp.upsert({
        where: { phone },
        update: { firstName, lastName, company: company || null, password: hashed, otp, expiresAt, email: null },
        create: { phone, firstName, lastName, company: company || null, password: hashed, otp, expiresAt },
      })
      await sendSmsOtp(phone, otp)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[send-otp]", err)
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 })
  }
}
