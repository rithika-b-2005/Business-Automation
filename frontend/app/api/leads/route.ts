import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  if (secret !== process.env.N8N_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const email = searchParams.get("email")
  if (!email) return NextResponse.json({ exists: false, lead: null })
  const lead = await prisma.lead.findUnique({ where: { email } })
  return NextResponse.json({ exists: !!lead, lead })
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-api-secret")
  if (secret !== process.env.N8N_API_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        company: body.company ?? null,
        linkedinUrl: body.linkedinUrl ?? null,
        title: body.title ?? null,
        source: body.source ?? "unknown",
        score: body.score ?? 0,
        notes: body.notes ?? null,
        processedAt: body.processedAt ? new Date(body.processedAt) : null,
      },
    })
    return NextResponse.json({ lead }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/leads]", err)
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 })
  }
}
