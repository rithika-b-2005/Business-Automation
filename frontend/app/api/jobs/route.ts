import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json({ jobs })
  } catch (err) {
    console.error("[jobs/GET]", err)
    return NextResponse.json({ error: "Failed to fetch jobs." }, { status: 500 })
  }
}
