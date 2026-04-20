import { NextResponse } from "next/server"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

// In-memory storage for questions (persists during session)
const questionsStore: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, question } = body

    if (!name || !email || !question) {
      return NextResponse.json(
        { error: "Name, email, and question are required." },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    // Store in memory
    const questionId = `q-${Date.now()}`
    const questionEntry = {
      id: questionId,
      name,
      email,
      question,
      answered: false,
      createdAt: new Date().toISOString(),
    }
    questionsStore.push(questionEntry)

    console.log(`[ask-question] Question stored - ID: ${questionId}, Total: ${questionsStore.length}`)

    // Send to Telegram
    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    const telegramMsg = `❓ New Question\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 ${question}\n\n📍 ${ts} IST`

    await sendAdminWhatsApp(telegramMsg).catch((e) => {
      console.error("[telegram] Failed to send:", e)
    })

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your question! Our team will respond to you at the email address provided shortly.",
        questionId,
      },
      { status: 201 }
    )
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error("[ask-question POST]", errorMsg)
    return NextResponse.json(
      { error: "Failed to submit question." },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve questions (for admin dashboard later)
export async function GET() {
  return NextResponse.json({
    total: questionsStore.length,
    questions: questionsStore.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  })
}
