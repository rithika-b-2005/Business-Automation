"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import Header from "@/app/components/Header"

type Tab = "email" | "phone"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("email")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const body = tab === "email" ? { email } : { phone }
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 404) {
          toast.error("No account found. Redirecting to register…")
          setTimeout(() => router.push("/register"), 1500)
        } else {
          toast.error(data.error ?? "Failed to send OTP.")
        }
        return
      }
      const identifier = tab === "email" ? email : phone
      router.push(`/forgot-password/verify?via=${tab}&to=${encodeURIComponent(identifier)}`)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: "#e8eaed" }}>
      <Header />

      <div className="flex-1 flex items-center justify-center px-4" style={{ paddingTop: "8vh" }}>
        <div className="w-full" style={{ maxWidth: 440 }}>

          <div className="bg-white rounded-2xl px-8 py-10">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#eff6ff" }}>
                {tab === "email"
                  ? <Mail className="w-7 h-7" style={{ color: "#276ef1" }} />
                  : <Phone className="w-7 h-7" style={{ color: "#276ef1" }} />
                }
              </div>
            </div>

            <h2 className="text-xl font-semibold text-[#20262D] text-center">Forgot password?</h2>
            <p className="text-sm text-[#333333] text-center mt-2 mb-7">
              Enter your {tab === "email" ? "email address" : "mobile number"} and we&apos;ll send you a verification code.
            </p>

            {/* Tabs */}
            <div className="flex rounded-xl mb-5 p-1 gap-1" style={{ background: "#e8eaed" }}>
              {(["email", "phone"] as const).map((t) => (
                <button key={t} type="button"
                  onClick={() => { setTab(t); setEmail(""); setPhone("") }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    tab === t ? "bg-white text-[#20262D] shadow-sm" : "text-[#333333] hover:text-[#20262D]"
                  }`}>
                  {t === "email" ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  {t === "email" ? "Email" : "Mobile"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "email" ? (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#20262D]">Email address</Label>
                  <Input type="email" placeholder="you@company.com" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-lg border-[#E0E0E0] bg-white text-[#20262D] placeholder:text-gray-400" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-[#20262D]">Mobile number</Label>
                  <Input type="tel" placeholder="+91 98765 43210" required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-lg border-[#E0E0E0] bg-white text-[#20262D] placeholder:text-gray-400" />
                </div>
              )}

              <Button type="submit" disabled={loading || (tab === "email" ? !email : !phone)}
                className="w-full h-10 rounded-lg font-semibold text-white gap-2 text-sm"
                style={{ background: "#276ef1" }}>
                {loading ? "Sending code…" : "Send verification code"} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <button type="button" onClick={() => router.push("/")}
              className="flex items-center justify-center gap-1.5 text-sm text-[#333333] hover:text-[#20262D] mt-6 w-full">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
