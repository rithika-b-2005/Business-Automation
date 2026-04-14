"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import Header from "@/app/components/Header"

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const resetToken = params.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!resetToken) router.replace("/forgot-password")
  }, [resetToken, router])

  const mismatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast.error("Password must be at least 8 characters."); return }
    if (password !== confirm) { toast.error("Passwords do not match."); return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Failed to reset password."); return }
      setDone(true)
      setTimeout(() => router.push("/"), 2000)
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

            {done ? (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#20262D]">Password Updated!</h2>
                  <p className="text-sm text-[#333333] mt-1">Taking you to sign in…</p>
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
                <div className="flex justify-center mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#eff6ff" }}>
                    <KeyRound className="w-7 h-7" style={{ color: "#276ef1" }} />
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-[#20262D] text-center">Create new password</h2>
                <p className="text-sm text-[#333333] text-center mt-2 mb-7">
                  Your new password must be at least 8 characters.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#20262D]">New password</Label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                        required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                        className="h-10 rounded-lg border-[#E0E0E0] bg-white text-[#20262D] placeholder:text-gray-400 pr-10" />
                      <button type="button" onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password.length > 0 && password.length < 8 && (
                      <p className="text-xs text-amber-500">At least 8 characters required</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#20262D]">Confirm password</Label>
                    <div className="relative">
                      <Input type={showConfirm ? "text" : "password"} placeholder="Re-enter password"
                        required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                        className={`h-10 rounded-lg bg-white text-[#20262D] placeholder:text-gray-400 pr-10 border ${mismatch ? "border-red-400" : "border-[#E0E0E0]"}`} />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mismatch && <p className="text-xs text-red-500">Passwords do not match</p>}
                  </div>

                  <Button type="submit"
                    disabled={password.length < 8 || password !== confirm || loading}
                    className="w-full h-11 rounded-xl font-semibold text-white text-sm mt-2"
                    style={{ background: "#276ef1" }}>
                    {loading ? "Updating…" : "Update Password"}
                  </Button>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
