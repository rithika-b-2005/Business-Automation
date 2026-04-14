import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

export async function GET(request: Request) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date()
    const istOffset = 5.5 * 60 * 60 * 1000
    const istNow = new Date(now.getTime() + istOffset)
    const startOfDayIST = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate()))
    const todayStart = new Date(startOfDayIST.getTime() - istOffset)

    const [newUsers, newDemos, newApplications, newContacts] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.demoBooking.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.jobApplication.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: todayStart } } }),
    ])

    const dateStr = istNow.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
    const msg = [
      `📋 Daily Digest — ${dateStr}`,
      ``,
      `Today's Activity:`,
      `  👤 Registrations: ${newUsers}`,
      `  📅 Demo Bookings: ${newDemos}`,
      `  💼 Job Applications: ${newApplications}`,
      `  ✉️ Contact Messages: ${newContacts}`,
    ].join("\n")

    await sendAdminWhatsApp(msg)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[cron/daily-digest]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
