import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDemoConfirmedEmail, sendDemoRescheduleEmail } from "@/lib/email"

function twiml(msg: string) {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`,
    { headers: { "Content-Type": "text/xml" } }
  )
}

export async function POST(request: Request) {
  try {
    const text = await request.text()
    const params = new URLSearchParams(text)
    const body = (params.get("Body") ?? "").trim()

    // Expect admin to reply: "YES abc12345" or "NO abc12345"
    // Also accepts bare "YES" / "NO" → acts on the most recent pending booking
    const upper = body.toUpperCase()
    const parts = upper.split(/\s+/)
    const action = parts[0] // YES or NO
    const shortId = parts[1] ?? null // last 8 chars of booking ID, optional

    if (action !== "YES" && action !== "NO") {
      return twiml("Send YES <id> to confirm a demo or NO <id> to decline.")
    }

    let booking
    if (shortId) {
      // find booking whose id ends with the given short id
      const all = await prisma.demoBooking.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      })
      booking = all.find(b => b.id.slice(-8).toUpperCase() === shortId.toUpperCase())
    } else {
      // fall back to most recent pending
      booking = await prisma.demoBooking.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      })
    }

    if (!booking) {
      return twiml("No pending demo booking found with that ID.")
    }

    if (action === "YES") {
      const chars = "abcdefghijklmnopqrstuvwxyz"
      const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
      const meetLink = `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`
      await prisma.demoBooking.update({ where: { id: booking.id }, data: { status: "confirmed" } })
      await sendDemoConfirmedEmail({
        firstName: booking.firstName,
        email: booking.email,
        date: booking.date,
        timeSlot: booking.timeSlot,
        meetLink,
      })
      return twiml(`Confirmed! ${booking.firstName} ${booking.lastName} has been notified via email.`)
    } else {
      await prisma.demoBooking.update({ where: { id: booking.id }, data: { status: "declined" } })
      await sendDemoRescheduleEmail({
        firstName: booking.firstName,
        email: booking.email,
        date: booking.date,
        timeSlot: booking.timeSlot,
      })
      return twiml(`Declined. ${booking.firstName} ${booking.lastName} has been asked to reschedule.`)
    }
  } catch (err) {
    console.error("[whatsapp webhook]", err)
    return twiml("Something went wrong. Please try again.")
  }
}
