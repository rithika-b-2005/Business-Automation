"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2, Mail, Phone } from "lucide-react"
import Header from "@/app/components/Header"

function VerifyForm() {
  const router = useRouter()
  const params = useSearchParams()
  const via = params.get("via") as "email" | "phone" | null   // "email" or "phone"
  const to  = params.get("to") ?? ""                          // the actual email/phone

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!via || !to) { router.replace("/register"); return }
    setTimeout(() => otpRefs.current[0]?.focus(), 200)
  }, [via, to, router])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(""))
      otpRefs.current[5]?.focus()
    }
    e.preventDefault()
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join("")
    if (code.length < 6) { toast.error("Enter the 6-digit code."); return }
    setLoading(true)
    try {
      const body = via === "email" ? { email: to, otp: code } : { phone: to, otp: code }
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Verification failed."); return }
      setDone(true)
      setTimeout(() => router.push("/landing"), 2000)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function resend() {
    toast.error("Please go back and resend the code.")
  }

  const maskedTo = via === "email"
    ? to.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : to.replace(/(\+?\d{2})(\d+)(\d{3})/, "$1***$3")

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: "#e8eaed" }}>
      <Header />

      <div className="flex-1 flex items-center justify-center px-4" style={{ paddingTop: "8vh" }}>
        <div className="w-full" style={{ maxWidth: 440 }}>

          {/* Card */}
          <div className="bg-white rounded-2xl px-8 py-10">

            {done ? (
              /* Success */
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#20262D]">Account Created!</h2>
                  <p className="text-sm text-[#333333] mt-1">Taking you to Landing page…</p>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#276ef1", animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "#eff6ff" }}>
                    {via === "email"
                      ? <Mail className="w-7 h-7" style={{ color: "#276ef1" }} />
                      : <Phone className="w-7 h-7" style={{ color: "#276ef1" }} />
                    }
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-[#20262D] text-center">Verify your {via === "email" ? "email" : "phone"}</h2>
                <p className="text-sm text-[#333333] text-center mt-2 mb-8">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-[#20262D]">{maskedTo}</span>
                </p>

                <form onSubmit={handleVerify} className="space-y-6">
                  {/* OTP boxes */}
                  <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-12 h-14 text-center text-2xl font-semibold rounded-xl border-2 border-[#E0E0E0] bg-white text-[#20262D] focus:border-[#276ef1] focus:ring-2 focus:ring-[#276ef1]/20 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    disabled={otp.join("").length < 6 || loading}
                    className="w-full h-11 rounded-xl font-semibold text-white text-sm"
                    style={{ background: "#276ef1" }}
                  >
                    {loading ? "Verifying…" : "Verify & Continue"}
                  </Button>
                </form>

                <p className="text-center text-sm text-[#333333] mt-5">
                  Didn&apos;t receive it?{" "}
                  <button type="button" onClick={() => router.back()}
                    className="text-[#276ef1] font-medium hover:underline">
                    Go back &amp; resend
                  </button>
                </p>

                <button type="button" onClick={() => router.push("/register")}
                  className="flex items-center gap-1.5 text-sm text-[#333333] hover:text-[#20262D] mt-6 mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Back to register
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  )
}
