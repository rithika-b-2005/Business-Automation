import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail, sendRegistrationAlertEmail } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

export async function POST(request: Request) {
  try {
    const { email, phone, otp } = await request.json()

    if ((!email && !phone) || !otp) {
      return NextResponse.json({ error: "Identifier and OTP are required." }, { status: 400 })
    }

    const record = email
      ? await prisma.registrationOtp.findUnique({ where: { email } })
      : await prisma.registrationOtp.findUnique({ where: { phone } })

    if (!record) {
      return NextResponse.json({ error: "No pending verification found. Please request a new OTP." }, { status: 404 })
    }
    if (new Date() > record.expiresAt) {
      await prisma.registrationOtp.delete({ where: { id: record.id } })
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 410 })
    }
    if (record.otp !== otp) {
      return NextResponse.json({ error: "Incorrect OTP. Please try again." }, { status: 401 })
    }

    const user = await prisma.user.create({
      data: {
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email ?? null,
        phone: record.phone ?? null,
        company: record.company,
        password: record.password,
      },
      select: { id: true, firstName: true, lastName: true, email: true, phone: true },
    })

    await prisma.registrationOtp.delete({ where: { id: record.id } })

    const identifier = record.email ?? record.phone ?? ""
    Promise.allSettled([
      ...(record.email ? [sendWelcomeEmail(record.email, record.firstName)] : []),
      sendRegistrationAlertEmail({ firstName: record.firstName, lastName: record.lastName, email: identifier, company: record.company }),
      sendAdminWhatsApp(`New Registration\nName: ${record.firstName} ${record.lastName}\n${record.email ? `Email: ${record.email}` : `Phone: ${record.phone}`}${record.company ? `\nCompany: ${record.company}` : ""}`),
    ]).catch(() => {})

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error("[verify-otp]", err)
    return NextResponse.json({ error: "Failed to verify OTP." }, { status: 500 })
  }
}
