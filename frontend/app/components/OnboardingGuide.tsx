"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, ChevronLeft, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    title: "Welcome to Tec Tha! 👋",
    desc: "Let me give you a quick tour of the platform. This will take about 30 seconds.",
    scrollTo: null,
    link: null,
  },
  {
    title: "Hero Banner",
    desc: "At the top you'll see our main value proposition. Click 'Explore Now' to browse all products or 'Contact Us' to reach our team.",
    scrollTo: "top",
    link: null,
  },
  {
    title: "What We Do",
    desc: "Our 6 core services — Workflow Automation, AI Insights, Integrations, Notifications, Collaboration, and Security.",
    scrollTo: "#services",
    link: null,
  },
  {
    title: "How It Works",
    desc: "Just 3 steps: Connect your tools → Build your workflow → Watch it run. No coding needed.",
    scrollTo: "#how-it-works",
    link: null,
  },
  {
    title: "Our Products",
    desc: "9 powerful products — FlowBot, SalesPulse, FinanceFlow and more. Click below to explore them all.",
    scrollTo: null,
    link: "/explore",
  },
  {
    title: "Frequently Asked Questions",
    desc: "Common questions about setup time, integrations, security, and pricing — all answered in the FAQ section.",
    scrollTo: "#faq",
    link: null,
  },
  {
    title: "You're all set! 🎉",
    desc: "Use the blue chat bubble (bottom-right) anytime to ask Aria, our AI assistant, anything about the app.",
    scrollTo: null,
    link: null,
  },
]

export default function OnboardingGuide() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const done = localStorage.getItem("tec_tha_tour_done")
      if (!done) {
        const t = setTimeout(() => setVisible(true), 1800)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  function dismiss() {
    try { localStorage.setItem("tec_tha_tour_done", "1") } catch {}
    setVisible(false)
  }

  function scrollTo(target: string | null) {
    if (!target) return
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      const el = document.querySelector(target)
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  function next() {
    const current = STEPS[step]
    if (current.scrollTo) scrollTo(current.scrollTo)
    if (current.link) {
      window.location.href = current.link
      return
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      dismiss()
    }
  }

  function back() {
    if (step > 0) setStep(s => s - 1)
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed bottom-8 left-8 z-50 w-[280px] animate-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl shadow-2xl border border-gray-100 overflow-hidden bg-white">
        {/* Header */}
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, #0a1628 0%, #1a3a8f 60%, #1a56db 100%)" }}
        >
          <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
          <p className="text-xs font-semibold text-white flex-1">App Tour</p>
          <div className="flex gap-1 items-center">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i < step ? "w-1.5 h-1.5 bg-green-400" : i === step ? "w-2.5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/25"
                }`}
              />
            ))}
          </div>
          <button onClick={dismiss} className="text-white/40 hover:text-white ml-1 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-3">
          <p className="text-sm font-semibold text-gray-900 mb-1">{current.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">{current.desc}</p>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-400">{step + 1} / {STEPS.length}</p>
            <div className="flex gap-2">
              {step > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={back}
                  className="h-7 text-xs rounded-xl text-gray-500 px-2 gap-1"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </Button>
              )}
              <Button
                size="sm"
                onClick={next}
                className="h-7 text-xs rounded-xl bg-[#1a56db] hover:bg-[#1a56db]/90 text-white gap-1 px-3"
              >
                {isLast ? "Done ✓" : current.link ? (
                  <><ExternalLink className="w-3 h-3" /> Explore</>
                ) : current.scrollTo ? (
                  <>Go there <ChevronRight className="w-3 h-3" /></>
                ) : (
                  <>Next <ChevronRight className="w-3 h-3" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
