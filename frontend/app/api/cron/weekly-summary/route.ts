import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

export async function GET(request: Request) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, newUsers, demosTotal, demosConfirmed, demosPending, demosDeclined, applications, contacts] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.demoBooking.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.demoBooking.count({ where: { createdAt: { gte: weekAgo }, status: "confirmed" } }),
      prisma.demoBooking.count({ where: { createdAt: { gte: weekAgo }, status: "pending" } }),
      prisma.demoBooking.count({ where: { createdAt: { gte: weekAgo }, status: "declined" } }),
      prisma.jobApplication.findMany({ where: { createdAt: { gte: weekAgo } }, select: { matchScore: true } }),
      prisma.contactMessage.count({ where: { createdAt: { gte: weekAgo } } }),
    ])

    const scored = applications.filter(a => a.matchScore !== null)
    const avgScore = scored.length ? Math.round(scored.reduce((s, a) => s + a.matchScore!, 0) / scored.length) : null
    const dateStr = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" })

    const msg = [
      `📊 Weekly Summary — ${dateStr}`,
      ``,
      `👥 Registrations`,
      `  New this week: ${newUsers}  |  Total: ${totalUsers}`,
      ``,
      `📅 Demo Bookings (this week)`,
      `  Total: ${demosTotal}  |  Confirmed: ${demosConfirmed}  |  Pending: ${demosPending}  |  Declined: ${demosDeclined}`,
      ``,
      `💼 Job Applications (this week)`,
      `  Total: ${applications.length}  |  Avg Score: ${avgScore !== null ? avgScore + "%" : "N/A"}`,
      ``,
      `✉️ Contact Messages: ${contacts}`,
    ].join("\n")

    await sendAdminWhatsApp(msg)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[cron/weekly-summary]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
