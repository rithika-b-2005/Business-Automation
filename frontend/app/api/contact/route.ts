import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { transporter, sendContactAutoReply } from "@/lib/email"
import { sendAdminWhatsApp } from "@/lib/whatsapp"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, company, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "First name, last name, email, subject, and message are required." },
        { status: 400 }
      )
    }

    const contact = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        subject,
        message,
      },
    })

    const ts = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

    // Admin email
    await transporter.sendMail({
      from: `"Tec Tha Contact Form" <${process.env.GMAIL_USER}>`,
      to: "tecthaofficial@gmail.com",
      subject: `New Contact: ${subject} — ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(105deg, #0a1628, #1a56db); padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">New Contact Message</h2>
            <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">Via Tec Tha website</p>
          </div>
          <div style="background: #f9fafb; padding: 28px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280; width: 140px;">Name</td>
                <td style="padding: 8px 0; font-size: 13px; color: #111827; font-weight: 600;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Email</td>
                <td style="padding: 8px 0; font-size: 13px; color: #1a56db;"><a href="mailto:${email}" style="color: #1a56db;">${email}</a></td>
              </tr>
              ${phone ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Phone</td><td style="padding: 8px 0; font-size: 13px; color: #111827;">${phone}</td></tr>` : ""}
              ${company ? `<tr><td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Company</td><td style="padding: 8px 0; font-size: 13px; color: #111827;">${company}</td></tr>` : ""}
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #6b7280;">Subject</td>
                <td style="padding: 8px 0; font-size: 13px; color: #111827;">${subject}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <p style="font-size: 14px; color: #374151; margin: 0; line-height: 1.6;">${message.replace(/\n/g, "<br/>")}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">Received on ${ts} IST</p>
          </div>
        </div>
      `,
    })

    // Agent 1: auto-reply to user
    // Agent 2: priority-aware Telegram alert
    const isPriority = /support|urgent|bug/i.test(subject)
    const telegramMsg = isPriority
      ? `🚨 HIGH PRIORITY\nSubject: ${subject}\nFrom: ${firstName} ${lastName}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}${company ? `\nCompany: ${company}` : ""}\nMessage: ${message.slice(0, 200)}${message.length > 200 ? "..." : ""}\n\n⚠️ Requires immediate attention`
      : `New Contact Us Message\nFrom: ${firstName} ${lastName}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}${company ? `\nCompany: ${company}` : ""}\nSubject: ${subject}\nMessage: ${message.slice(0, 200)}${message.length > 200 ? "..." : ""}`

    Promise.allSettled([
      sendContactAutoReply(email, firstName),
      sendAdminWhatsApp(telegramMsg),
    ]).catch(() => {})

    return NextResponse.json({ contact }, { status: 201 })
  } catch (err) {
    console.error("[contact POST]", err)
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
  }
}
