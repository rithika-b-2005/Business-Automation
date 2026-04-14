import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDemoAlertEmail } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

function scoreLead(companySize: string | null | undefined, message: string | null | undefined): {
  label: "Hot" | "Warm" | "Cold"; score: number
} {
  let score = 0
  const sizeMap: Record<string, number> = { "500+": 40, "201-500": 35, "51-200": 25, "11-50": 15, "1-10": 5 }
  score += sizeMap[companySize ?? ""] ?? 0
  if (message) {
    if (message.length > 200) score += 20
    else if (message.length > 80) score += 10
    if (/automat|integrat|scale|enterprise|urgent|asap|budget|roi|team of/i.test(message)) score += 20
  }
  const label = score >= 60 ? "Hot" : score >= 30 ? "Warm" : "Cold"
  return { label, score }
}

function parseScheduledAt(rawDate: string | null | undefined, timeSlot: string): Date | null {
  if (!rawDate) return null
  try {
    const [timePart, meridiem] = timeSlot.split(" ")
    const [hourStr, minStr] = timePart.split(":")
    let hour = parseInt(hourStr)
    const min = parseInt(minStr)
    if (meridiem === "PM" && hour !== 12) hour += 12
    if (meridiem === "AM" && hour === 12) hour = 0
    const paddedHour = String(hour).padStart(2, "0")
    const paddedMin  = String(min).padStart(2, "0")
    return new Date(`${rawDate}T${paddedHour}:${paddedMin}:00+05:30`)
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, company, companySize, message, date, timeSlot, rawDate } = body

    if (!firstName || !lastName || !email || !date || !timeSlot) {
      return NextResponse.json(
        { error: "First name, last name, email, date, and time slot are required." },
        { status: 400 }
      )
    }

    const scheduledAt = parseScheduledAt(rawDate, timeSlot)
    const { label: leadLabel } = scoreLead(companySize, message)

    const booking = await prisma.demoBooking.create({
      data: {
        firstName, lastName, email,
        company: company || null,
        companySize: companySize || null,
        message: message || null,
        date, timeSlot,
        scheduledAt,
        status: "pending",
      },
    })

    const shortId = booking.id.slice(-8)
    const leadEmoji = leadLabel === "Hot" ? "🔥" : leadLabel === "Warm" ? "🟡" : "❄️"

    Promise.allSettled([
      sendDemoAlertEmail(booking),
      sendAdminWhatsApp(
        `${leadEmoji} [${leadLabel} Lead] New Demo Booking [${shortId}]\nName: ${firstName} ${lastName}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}${companySize ? `\nSize: ${companySize}` : ""}\nDate: ${date}\nTime: ${timeSlot} IST\n\nReply YES ${shortId} to confirm or NO ${shortId} to decline.`
      ),
    ]).catch(() => {})

    return NextResponse.json({ booking }, { status: 201 })
  } catch (err) {
    console.error("[demo POST]", err)
    return NextResponse.json({ error: "Failed to book demo." }, { status: 500 })
  }
}
