"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CheckCircle2, Calendar as CalIcon, Clock, ArrowRight, ArrowLeft, ChevronDown, Video } from "lucide-react"
import { motion } from "framer-motion"
import { fadeUp, transition } from "@/lib/animations"
import DemoQualifier from "@/app/components/DemoQualifier"

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
]

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | null>(null)
  const [demoMessage, setDemoMessage] = useState("")
  const [companySize, setCompanySize] = useState("")

  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => { window.location.href = "/landing" }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const formattedDate = date
    ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !timeSlot) { setSubmitError("Please pick a date and time."); return }
    setLoading(true)
    setSubmitError("")
    const form = e.target as HTMLFormElement
    const fd = new FormData(form)
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("first_name"),
          lastName: fd.get("last_name"),
          email: fd.get("email"),
          company: fd.get("company"),
          companySize,
          message: demoMessage,
          date: formattedDate,
          timeSlot,
          rawDate: date?.toISOString().slice(0, 10),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error ?? "Booking failed."); return }
      setSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f3f4f6" }}>
          <div className="max-w-md w-full bg-white border border-[#e8edf5] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-10 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Request Received!</h2>
                {date && timeSlot && (
                  <div className="mt-3 bg-[#eff6ff] border border-blue-100 rounded-xl px-5 py-3 text-sm text-gray-700 space-y-1 text-left">
                    <p className="flex items-center gap-2"><CalIcon className="w-4 h-4 text-[#276ef1]" /> {formattedDate}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#276ef1]" /> {timeSlot} IST</p>
                  </div>
                )}
                <p className="text-sm text-gray-500 leading-relaxed mt-3">
                  Our team will review your schedule and get back to you via email once confirmed.
                </p>
              </div>
              <Separator className="bg-[#f0f2f5]" />
              <div className="flex items-start gap-3 bg-[#eff6ff] border border-blue-100 rounded-xl px-4 py-3 text-left w-full">
                <Video className="w-4 h-4 text-[#276ef1] mt-0.5 shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  A Google Meet link will be sent to your email once our team confirms your slot.
                </p>
              </div>
              <Button asChild className="w-full rounded-xl text-white font-semibold h-11" style={{ background: "#276ef1" }}>
                <Link href="/landing">Back to Home</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  /* ── Main page ── */
  return (
    <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
      <Header />

      {/* ── Back button ── */}
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <button
          onClick={() => window.location.href = "/landing"}
          className="flex items-center gap-1.5 text-sm text-[#7a8899] hover:text-[#276ef1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="pt-6 pb-10 px-6 text-center" style={{ background: "#f3f4f6" }}>
        <div className="max-w-xl mx-auto">
          <motion.h1
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.1 }}
            className="text-3xl font-normal leading-[1.15] tracking-tight text-black mb-3"
          >
            Book a Demo
          </motion.h1>
          <motion.p
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.2 }}
            className="text-sm text-[#7a8899] leading-relaxed"
          >
            A 30-minute live walkthrough — no slides, no sales pitch. Just your workflows automated in real time.
          </motion.p>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-[#e8edf5] rounded-2xl shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-8 py-5 border-b border-[#f0f2f5] flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">Book Your Demo</p>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in your details and pick a time that works for you</p>
                </div>
                <Badge variant="outline" className="text-xs rounded-full px-3 bg-[#eff6ff] text-[#276ef1] border-blue-200">Step 1</Badge>
              </div>

              <div className="px-8 py-7 space-y-5">
                <DemoQualifier onComplete={(summary) => setDemoMessage(summary)} />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="first_name" className="text-gray-700 text-sm font-medium">First name</Label>
                    <Input id="first_name" name="first_name" placeholder="Jane" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="last_name" className="text-gray-700 text-sm font-medium">Last name</Label>
                    <Input id="last_name" name="last_name" placeholder="Smith" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Work email</Label>
                    <Input id="email" name="email" type="email" placeholder="jane@company.com" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-gray-700 text-sm font-medium">Company name</Label>
                    <Input id="company" name="company" placeholder="Acme Inc." required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm font-medium">Company size</Label>
                    <Select value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger className="rounded-lg h-11 border-[#e0e0e0] w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                        <SelectItem value="1-10">1 – 10 employees</SelectItem>
                        <SelectItem value="11-50">11 – 50 employees</SelectItem>
                        <SelectItem value="51-200">51 – 200 employees</SelectItem>
                        <SelectItem value="201-500">201 – 500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm font-medium">
                      Date &amp; Time <span className="text-gray-400 font-normal">(IST)</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="w-full flex items-center justify-between rounded-lg border border-[#e0e0e0] bg-white px-3 h-11 text-sm hover:border-[#276ef1] transition-colors"
                        >
                          <span className={date && timeSlot ? "text-gray-900" : "text-gray-400"}>
                            {date && timeSlot
                              ? `${formattedDate} · ${timeSlot}`
                              : date
                              ? `${formattedDate} · pick a time`
                              : "Pick date & time"}
                          </span>
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border border-[#e8edf5]" align="start">
                        <div className="flex flex-col sm:flex-row">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(d) => d < new Date() || d.getDay() === 0 || d.getDay() === 6}
                            className="rounded-tl-2xl rounded-bl-2xl border-r border-[#f0f2f5]"
                          />
                          <div className="p-4 w-[160px]">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">Time</p>
                            <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto pr-1">
                              {TIME_SLOTS.map(slot => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setTimeSlot(slot)}
                                  className={`text-sm rounded-lg px-3 py-2 text-left transition-all font-medium w-full ${timeSlot === slot ? "text-white" : "text-gray-600 hover:bg-gray-100"}`}
                                  style={timeSlot === slot ? { background: "#276ef1" } : {}}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {date && timeSlot && (
                  <div className="bg-[#eff6ff] border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <CalIcon className="w-4 h-4 text-[#276ef1] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{formattedDate}</p>
                      <p className="text-xs text-gray-500">{timeSlot} IST · 30-minute session</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">
                    Anything else? <span className="text-gray-400 font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={demoMessage}
                    onChange={e => setDemoMessage(e.target.value)}
                    placeholder="Describe your challenges or what you'd like to see..."
                    className="rounded-lg resize-none border-[#e0e0e0] text-sm focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
                  />
                </div>

                <Separator className="bg-[#f0f2f5]" />

                {submitError && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{submitError}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl text-white font-semibold h-11 text-sm gap-2"
                  style={{ background: "#276ef1" }}
                >
                  {loading ? "Booking..." : "Confirm & Book Demo"} <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-center text-xs text-gray-400">No spam. We respect your privacy.</p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
