"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquarePlus } from "lucide-react"
import { toast } from "sonner"
import { fadeUp, scaleUp, slideInLeft, slideInRight, transition, viewport, stagger } from "@/lib/animations"

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "VP Operations",
    company: "QuantumTech Corp",
    initials: "SC",
    color: "#276ef1",
    stars: 5,
    quote: "Tec Tha eliminated 15 hours of manual work per week across our operations team. The ROI was visible in the first month — it's been transformative.",
  },
  {
    name: "Marcus Williams",
    role: "Head of Revenue",
    company: "Meridian Global",
    initials: "MW",
    color: "#7c3aed",
    stars: 5,
    quote: "We automated our entire CRM update process. Sales closed 42% more deals in Q3 because reps stopped doing admin work and started actually selling.",
  },
  {
    name: "Priya Nair",
    role: "Director of HR",
    company: "Nexora Solutions",
    initials: "PN",
    color: "#0891b2",
    stars: 5,
    quote: "Onboarding used to take two weeks of back-and-forth. With Tec Tha, new hires are fully set up in under 48 hours. Our HR team can finally focus on people.",
  },
]

export default function Testimonials() {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [form, setForm] = useState({ name: "", role: "", feedback: "" })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { toast.error("Please select a star rating."); return }
    if (!form.name.trim() || !form.role.trim() || !form.feedback.trim()) {
      toast.error("All fields are required.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit feedback.")
        return
      }

      setOpen(false)
      setForm({ name: "", role: "", feedback: "" })
      setRating(0)
      toast.success("Thank you! Your feedback has been submitted.")
    } catch (err) {
      toast.error("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="testimonials" className="py-14 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={scaleUp.hidden} whileInView={scaleUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff] mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-normal text-gray-900 mb-3">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-sm text-gray-400">Real results from real teams using Tec Tha every day.</p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={i === 0 ? slideInLeft.hidden : i === 2 ? slideInRight.hidden : { opacity: 0, y: 50, scale: 0.92 }}
              whileInView={i === 0 ? slideInLeft.visible : i === 2 ? slideInRight.visible : { opacity: 1, y: 0, scale: 1 }}
              transition={{ ...transition.base, delay: i * stagger }}
              viewport={viewport}
            >
              <Card className="h-full border border-[#e8edf5] shadow-none hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white">
                <CardContent className="p-6 flex flex-col gap-4 h-full">

                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-[#f0f2f5]">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ background: t.color }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}, {t.company}</p>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add feedback CTA */}
        <motion.div
          initial={fadeUp.hidden} whileInView={fadeUp.visible}
          transition={{ ...transition.base, delay: 0.3 }} viewport={viewport}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-sm text-gray-400">Used Tec Tha? We'd love to hear from you.</p>
          <Button
            onClick={() => setOpen(true)}
            className="rounded-xl text-white text-sm font-semibold gap-2"
            style={{ background: "#276ef1" }}
          >
            <MessageSquarePlus className="w-4 h-4" /> Share Your Feedback
          </Button>
        </motion.div>

      </div>

      {/* Feedback dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl [&>button]:outline-none [&>button]:ring-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-0">Share Your Feedback</DialogTitle>
          <DialogDescription className="sr-only">Share your feedback about Tec Tha.</DialogDescription>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-0">
            {/* Star rating */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Your rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button"
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star className={`w-6 h-6 transition-colors ${(hover || rating) >= star ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Your name</Label>
              <Input placeholder="Jane Smith" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Role & company</Label>
              <Input placeholder="VP Operations, Acme Inc." value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" required />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">Your feedback</Label>
              <Textarea placeholder="How has Tec Tha helped your team?" value={form.feedback}
                onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
                className="rounded-lg border border-[#e0e0e0] min-h-[90px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0" required />
            </div>

            <Button type="submit" disabled={loading}
              className="w-full rounded-xl font-semibold text-white text-sm"
              style={{ background: "#276ef1" }}>
              {loading ? "Submitting…" : "Submit Feedback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
