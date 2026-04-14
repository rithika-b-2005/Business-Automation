import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail, sendRegistrationAlertEmail } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, company, password } = body

    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json({ error: "First name, last name, phone, and password are required." }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: "An account with this phone number already exists." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { firstName, lastName, phone, company: company || null, password: hashed },
      select: { id: true, firstName: true, lastName: true, phone: true, company: true },
    })

    Promise.allSettled([
      sendRegistrationAlertEmail({ firstName, lastName, email: phone, company }),
      sendAdminWhatsApp(`New Registration (Phone)\nName: ${firstName} ${lastName}\nPhone: ${phone}${company ? `\nCompany: ${company}` : ""}`),
    ]).catch(() => {})

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error("[register]", err)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
