"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, MessageCirclePlus } from "lucide-react"
import { toast } from "sonner"
import { fadeUp, scaleUp, slideInLeft, slideInRight, transition, viewport } from "@/lib/animations"

const FAQS = [
  {
    q: "What types of business processes can Tec Tha automate?",
    a: "Tec Tha can automate a wide range of processes including HR onboarding, invoice processing, approval workflows, data entry, CRM updates, notifications, and more — without writing a single line of code.",
  },
  {
    q: "How long does it take to set up automation?",
    a: "Most workflows can be configured and live within a few hours. Our team works with you to map your processes, set up triggers and integrations, and test everything before go-live.",
  },
  {
    q: "Does Tec Tha integrate with our existing tools?",
    a: "Yes. Tec Tha connects with 200+ tools including Salesforce, HubSpot, SAP, QuickBooks, Slack, Microsoft 365, Google Workspace, and many more via open APIs and native connectors.",
  },
  {
    q: "Is any coding knowledge required?",
    a: "No coding is required. Our platform is designed for business users — everything is configured through a visual builder with drag-and-drop simplicity.",
  },
  {
    q: "How secure is the Tec Tha platform?",
    a: "Tec Tha is enterprise-grade secure with end-to-end encryption, role-based access controls, SOC 2 compliance, and regular third-party security audits to keep your data safe.",
  },
]

function FAQItem({ faq, index, open, onToggle }: {
  faq: { q: string; a: string }
  index: number
  open: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ ...transition.base, delay: index * 0.07 }} viewport={viewport}
      className={`rounded-xl border transition-all duration-300 mb-3 overflow-hidden ${
        open ? "border-[#276ef1]/30 bg-white shadow-sm" : "border-[#e8edf5] bg-white hover:border-[#276ef1]/20 hover:shadow-sm"
      }`}
    >
      <button onClick={onToggle} className="w-full text-left group px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-mono font-semibold min-w-[28px] transition-colors duration-200 ${open ? "text-[#276ef1]" : "text-gray-300"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`text-base font-medium leading-snug transition-colors duration-200 ${open ? "text-[#276ef1]" : "text-gray-800 group-hover:text-[#276ef1]"}`}>
              {faq.q}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 shrink-0 transition-all duration-300 ${open ? "rotate-180 text-[#276ef1]" : "text-gray-300"}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pl-[60px] text-sm text-gray-500 leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", question: "" })
  const [loading, setLoading] = useState(false)

  const isNameFilled = form.name.trim().length > 0
  const isEmailFilled = form.email.trim().length > 0
  const isQuestionFilled = form.question.trim().length > 0
  const isFormComplete = isNameFilled && isEmailFilled && isQuestionFilled

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isNameFilled) {
      toast.error("Please enter your name.")
      return
    }
    if (!isEmailFilled) {
      toast.error("Please enter your email.")
      return
    }
    if (!isQuestionFilled) {
      toast.error("Please enter your question.")
      return
    }

    setLoading(true)
    try {
      console.log("[FAQ] Submitting question:", form)

      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      console.log("[FAQ] Response:", data)

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit question.")
        return
      }

      setDialogOpen(false)
      setForm({ name: "", email: "", question: "" })
      toast.success(data.message ?? "Thank you! Our team will respond shortly.")
    } catch (err) {
      console.error("[FAQ] Error:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="faq" className="pt-10 pb-10 md:pt-14 md:pb-12 bg-[#f7f9ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={scaleUp.hidden} whileInView={scaleUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff] mb-4">
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl font-normal text-gray-900 leading-[1.2]">
            Answers To Your Automation Questions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* Left: FAQ cards */}
          <motion.div
            initial={slideInLeft.hidden} whileInView={slideInLeft.visible}
            transition={transition.slow} viewport={viewport}
          >
            <div className="flex flex-col">
              {FAQS.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>

            {/* Post a query */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ ...transition.base, delay: 0.4 }} viewport={viewport}
              className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-[#e8edf5] bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">Still have a question?</p>
                <p className="text-xs text-gray-400 mt-0.5">Post your query and we'll get back to you.</p>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="rounded-xl text-white text-xs font-semibold gap-2 shrink-0"
                style={{ background: "#276ef1" }}
              >
                <MessageCirclePlus className="w-4 h-4" /> Ask a Question
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            initial={slideInRight.hidden} whileInView={slideInRight.visible}
            transition={transition.slow} viewport={viewport}
            className="relative hidden lg:flex items-start justify-center"
          >
            <div className="w-full rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80"
                alt="Frequently asked questions"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Query dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl [&>button]:outline-none [&>button]:ring-0">
          <DialogTitle className="text-lg font-semibold text-gray-900">Ask a Question</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Fill in your details and question — our team will respond shortly.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Your name
                {!isNameFilled && <span className="text-red-500">*</span>}
              </Label>
              <Input placeholder="Jane Smith" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Email address
                {!isEmailFilled && <span className="text-red-500">*</span>}
              </Label>
              <Input type="email" placeholder="you@company.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Your question
                {!isQuestionFilled && <span className="text-red-500">*</span>}
              </Label>
              <Textarea placeholder="What would you like to know?" value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                className="rounded-lg border border-[#e0e0e0] min-h-[100px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0" />
            </div>
            <Button type="submit" disabled={loading || !isFormComplete}
              className="w-full rounded-xl font-semibold text-white text-sm transition-all"
              style={{
                background: isFormComplete ? "#276ef1" : "#d1d5db",
                cursor: isFormComplete ? "pointer" : "not-allowed",
                opacity: isFormComplete ? 1 : 0.6,
              }}>
              {loading ? "Submitting..." : "Submit Question"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
