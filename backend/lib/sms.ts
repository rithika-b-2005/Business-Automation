export async function sendSmsOtp(phone: string, otp: string): Promise<void> {
  const apiKey = process.env.FAST2SMS_API_KEY
  if (!apiKey) {
    console.warn("[sms] FAST2SMS_API_KEY not set")
    return
  }

  // Strip country code for Fast2SMS (expects 10-digit Indian number)
  const digits = phone.replace(/\D/g, "")
  const number = digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.length === 11 && digits.startsWith("0")
    ? digits.slice(1)
    : digits

  const url = new URL("https://www.fast2sms.com/dev/bulkV2")
  url.searchParams.set("authorization", apiKey)
  url.searchParams.set("route", "otp")
  url.searchParams.set("variables_values", otp)
  url.searchParams.set("flash", "0")
  url.searchParams.set("numbers", number)

  const res = await fetch(url.toString())
  const data = await res.json()
  if (!data.return) {
    console.error("[sms] Fast2SMS error:", data)
    throw new Error("SMS delivery failed")
  }
}
