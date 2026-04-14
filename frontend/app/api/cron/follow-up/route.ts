import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendFollowUpEmail } from "@/lib/email"

export async function GET(request: Request) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const now = new Date()
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    const fourDaysAgo  = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)

    const candidates = await prisma.user.findMany({
      where: { createdAt: { gte: fourDaysAgo, lt: threeDaysAgo } },
      select: { email: true, firstName: true },
    })
    if (candidates.length === 0) return NextResponse.json({ sent: 0 })

    const emails = candidates.map(u => u.email).filter((e): e is string => e !== null)
    const booked = await prisma.demoBooking.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    })
    const bookedSet = new Set(booked.map(b => b.email))
    const targets = candidates.filter(u => u.email !== null && !bookedSet.has(u.email)) as { email: string; firstName: string }[]

    const results = await Promise.allSettled(targets.map(u => sendFollowUpEmail(u.email, u.firstName)))
    const sent = results.filter(r => r.status === "fulfilled").length
    return NextResponse.json({ sent, total: targets.length })
  } catch (err) {
    console.error("[cron/follow-up]", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
