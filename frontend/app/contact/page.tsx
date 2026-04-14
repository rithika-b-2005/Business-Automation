"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, ArrowRight, CheckCircle2, MessageSquare, Zap, Shield, ArrowLeft } from "lucide-react"
import ContactFormHelper from "@/app/components/ContactFormHelper"
import { fadeUp, slideInLeft, slideInRight, scaleUp, transition, viewport, stagger } from "@/lib/animations"

const SUBJECTS = ["General Inquiry", "Product Demo", "Partnership", "Support", "Pricing", "Other"]

const INFO = [
  { icon: Mail,  label: "Email Us",      value: "tecthaofficial@gmail.com", sub: "We reply within 24 hours" },
  { icon: Phone, label: "Call Us",        value: "+91 88074 12810",          sub: "Mon–Fri, 9am–6pm IST"     },
  { icon: MapPin,label: "Location",       value: "India",                    sub: "Remote-first team"         },
  { icon: Clock, label: "Business Hours", value: "Mon – Fri",                sub: "9:00 AM – 6:00 PM IST"    },
]

const PERKS = [
  { icon: Zap,          title: "Quick Response",   desc: "We reply to every message within 24 hours, guaranteed." },
  { icon: MessageSquare,title: "Free Demo",         desc: "Book a no-obligation walkthrough of the platform."      },
  { icon: Shield,       title: "No Commitment",     desc: "Explore freely — no contracts, no pressure."           },
]

export default function ContactPage() {
  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => { window.location.href = "/landing" }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", subject: "", message: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Failed to send message."); return }
      setSubmitted(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
      <section className="pt-6 pb-12 px-6 text-center" style={{ background: "#f3f4f6" }}>
        <div className="max-w-xl mx-auto">
          <motion.h1
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.1 }}
            className="text-3xl font-normal leading-[1.15] tracking-tight text-black mb-3"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.2 }}
            className="text-sm text-[#7a8899] leading-relaxed"
          >
            Reach out to our team — we're ready to help you automate smarter, move faster, and grow with confidence.
          </motion.p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">

            {/* ── Form ── */}
            <motion.div
              initial={fadeUp.hidden} whileInView={fadeUp.visible}
              transition={transition.slow} viewport={viewport}
            >
              {submitted ? (
                <div className="bg-white rounded-2xl border border-[#e8edf5] px-8 py-20 flex flex-col items-center justify-center gap-5 text-center shadow-sm">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                      Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                  <Button
                    onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", subject: "", message: "" }) }}
                    variant="outline"
                    className="rounded-xl border-[#e8edf5] text-gray-700 hover:border-[#276ef1]/30"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm overflow-hidden">

                  {/* Form header strip */}
                  <div className="px-8 py-5 border-b border-[#f0f2f5]">
                    <p className="text-base font-semibold text-gray-900">Send us a message</p>
                    <p className="text-xs text-gray-400 mt-0.5">Fill in the details below and we'll get back to you shortly.</p>
                  </div>

                  <div className="px-8 py-7">
                    <ContactFormHelper
                      onFill={({ subject, message }) => { set("subject", subject); set("message", message) }}
                    />

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">First name</Label>
                          <Input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" required
                            className="h-11 rounded-lg border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Last name</Label>
                          <Input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" required
                            className="h-11 rounded-lg border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Email address</Label>
                          <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@company.com" required
                            className="h-11 rounded-lg border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Phone</Label>
                          <Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 88074 12810" required
                            className="h-11 rounded-lg border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Company</Label>
                          <Input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Acme Inc." required
                            className="h-11 rounded-lg border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Subject</Label>
                          <Select value={form.subject} onValueChange={v => set("subject", v)} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBJECTS.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-gray-700">Message</Label>
                        <Textarea
                          value={form.message} onChange={e => set("message", e.target.value)}
                          placeholder="Tell us about your business and what you're looking to automate..."
                          required
                          className="rounded-lg resize-none min-h-[80px] border-[#e0e0e0] text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>

                      <Separator className="bg-[#f0f2f5]" />

                      <Button
                        type="submit" disabled={loading}
                        className="w-full h-11 rounded-xl font-semibold text-white gap-2 text-sm"
                        style={{ background: "#276ef1" }}
                      >
                        {loading ? "Sending…" : "Send Message"}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>

        </div>
      </section>
    </div>
  )
}
