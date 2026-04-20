import { NextResponse } from "next/server"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

// In-memory storage for feedback (will reset on server restart)
const feedbackStore: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, role, feedback, rating } = body

    if (!name || !role || !feedback || !rating) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }

    // Store in memory
    const feedbackEntry = {
      id: `feedback-${Date.now()}`,
      name,
      role,
      feedback,
      rating: parseInt(rating),
      createdAt: new Date(),
    }
    feedbackStore.push(feedbackEntry)
    console.log(`[feedback] Stored feedback from ${name}. Total: ${feedbackStore.length}`)

    // Send to Telegram
    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    const telegramMsg = `⭐ New Feedback\n\n👤 ${name}\n💼 ${role}\n⭐ Rating: ${rating}/5\n\n💬 ${feedback}\n\n📍 ${ts} IST`

    await sendAdminWhatsApp(telegramMsg).catch((e) => {
      console.error("[telegram] Failed to send:", e)
    })

    return NextResponse.json(
      { success: true, message: "Thank you! Your feedback has been submitted." },
      { status: 201 }
    )
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error("[feedback POST]", errorMsg)
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    )
  }
}
