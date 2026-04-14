import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendDemoConfirmedEmail, sendDemoRescheduleEmail } from "@/lib/email"

function generateMeetLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz"
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  return `https://meet.google.com/${rand(3)}-${rand(4)}-${rand(3)}`
}

const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

async function replyTelegram(chatId: number, text: string) {
  if (!BOT_TOKEN) return
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

export async function POST(request: Request) {
  try {
    const update = await request.json()

    const message = update?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId: number = message.chat?.id
    const text: string = (message.text ?? "").trim()

    // Only respond to admin
    if (String(chatId) !== String(ADMIN_CHAT_ID)) {
      return NextResponse.json({ ok: true })
    }

    const upper = text.toUpperCase()
    const parts = upper.split(/\s+/)
    const action = parts[0]  // YES or NO
    const shortId = parts[1] ?? null  // last 8 chars of booking ID (optional)

    if (action !== "YES" && action !== "NO") {
      await replyTelegram(chatId,
        "Send YES <id> to confirm a demo or NO <id> to decline.\nExample: YES abc12345"
      )
      return NextResponse.json({ ok: true })
    }

    // Find the booking
    let booking
    if (shortId) {
      const pending = await prisma.demoBooking.findMany({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      })
      booking = pending.find(b => b.id.slice(-8).toUpperCase() === shortId)
    } else {
      booking = await prisma.demoBooking.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      })
    }

    if (!booking) {
      await replyTelegram(chatId, "No pending demo booking found with that ID.")
      return NextResponse.json({ ok: true })
    }

    if (action === "YES") {
      const meetLink = generateMeetLink()
      await prisma.demoBooking.update({ where: { id: booking.id }, data: { status: "confirmed", meetLink } })
      await sendDemoConfirmedEmail({
        firstName: booking.firstName,
        email: booking.email,
        date: booking.date,
        timeSlot: booking.timeSlot,
        meetLink,
      })
      await replyTelegram(chatId,
        `Confirmed! ${booking.firstName} ${booking.lastName} has been notified.\nDate: ${booking.date} at ${booking.timeSlot} IST\nMeet link: ${meetLink}`
      )
    } else {
      await prisma.demoBooking.update({ where: { id: booking.id }, data: { status: "declined" } })
      await sendDemoRescheduleEmail({
        firstName: booking.firstName,
        email: booking.email,
        date: booking.date,
        timeSlot: booking.timeSlot,
      })
      await replyTelegram(chatId,
        `Declined. ${booking.firstName} ${booking.lastName} has been asked to reschedule.`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[telegram webhook]", err)
    return NextResponse.json({ ok: true })
  }
}
