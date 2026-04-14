/**
 * Telegram Bot notification helper — 100% free.
 *
 * Set these env vars:
 *   TELEGRAM_BOT_TOKEN   e.g. 8611253094:AAHxxx...
 *   TELEGRAM_CHAT_ID     e.g. 1817463085
 */

export async function sendAdminWhatsApp(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn("[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping.")
    return
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("[telegram] send failed:", err)
  }
}
