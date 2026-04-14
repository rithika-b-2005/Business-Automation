import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDemoReminder } from "@/lib/email"

export async function GET(request: Request) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date()
    const h23 = new Date(now.getTime() + 23 * 60 * 60 * 1000)
    const h25 = new Date(now.getTime() + 25 * 60 * 60 * 1000)
    const m45 = new Date(now.getTime() + 45 * 60 * 1000)
    const m75 = new Date(now.getTime() + 75 * 60 * 1000)

    const [bookings24h, bookings1h] = await Promise.all([
      prisma.demoBooking.findMany({ where: { status: "confirmed", reminder24hSent: false, scheduledAt: { gte: h23, lte: h25 } } }),
      prisma.demoBooking.findMany({ where: { status: "confirmed", reminder1hSent: false, scheduledAt: { gte: m45, lte: m75 } } }),
    ])

    await Promise.allSettled(bookings24h.map(async (b) => {
      await sendDemoReminder({ to: b.email, firstName: b.firstName, date: b.date, timeSlot: b.timeSlot, meetLink: b.meetLink, hoursUntil: 24 })
      await prisma.demoBooking.update({ where: { id: b.id }, data: { reminder24hSent: true } })
    }))

    await Promise.allSettled(bookings1h.map(async (b) => {
      await sendDemoReminder({ to: b.email, firstName: b.firstName, date: b.date, timeSlot: b.timeSlot, meetLink: b.meetLink, hoursUntil: 1 })
      await prisma.demoBooking.update({ where: { id: b.id }, data: { reminder1hSent: true } })
    }))

    return NextResponse.json({ sent24h: bookings24h.length, sent1h: bookings1h.length })
  } catch (err) {
    console.error("[cron/demo-reminder]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
