"use client"

import { useState } from "react"
import { CheckCircle2, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    question: "What's your biggest business challenge right now?",
    chips: [
      "Manual repetitive tasks",
      "Disconnected tools",
      "Slow sales process",
      "HR & onboarding delays",
      "Lack of data visibility",
    ],
  },
  {
    question: "How large is your team?",
    chips: ["1–10 people", "11–50 people", "51–200 people", "200+ people"],
  },
  {
    question: "Which product interests you most?",
    chips: ["FlowBot (Workflows)", "SalesPulse (CRM)", "FinanceFlow (Billing)", "PeopleDesk (HR)", "InsightIQ (Analytics)", "Not sure yet"],
  },
]

const RECS: Record<string, { product: string; emoji: string; reason: string; focus: string }> = {
  "FlowBot (Workflows)":   { product: "FlowBot",     emoji: "⚡", reason: "automate repetitive tasks with zero code",          focus: "workflow builder and trigger automation" },
  "SalesPulse (CRM)":     { product: "SalesPulse",  emoji: "📈", reason: "streamline your pipeline and close deals faster",   focus: "lead management and automated follow-ups" },
  "FinanceFlow (Billing)": { product: "FinanceFlow", emoji: "💰", reason: "automate invoicing and expense tracking",           focus: "billing workflows and financial dashboards" },
  "PeopleDesk (HR)":       { product: "PeopleDesk", emoji: "👥", reason: "onboard new hires in hours not weeks",              focus: "HR automation and document management" },
  "InsightIQ (Analytics)": { product: "InsightIQ",  emoji: "📊", reason: "turn your data into actionable insights",           focus: "dashboard setup and KPI tracking" },
  "Not sure yet":          { product: "FlowBot",     emoji: "⚡", reason: "start with workflow automation — our most popular", focus: "core automation and integrations overview" },
}

interface Props {
  onComplete: (summary: string) => void
}

export default function DemoQualifier({ onComplete }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const rec = done ? (RECS[answers[2]] || RECS["Not sure yet"]) : null

  function answer(choice: string) {
    const newAnswers = [...answers, choice]
    setAnswers(newAnswers)
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      setDone(true)
      const r = RECS[choice] || RECS["Not sure yet"]
      const summary = `My challenge: ${newAnswers[0]}. Team size: ${newAnswers[1]}. Interested in: ${choice}. Please focus the demo on ${r.focus}.`
      onComplete(summary)
    }
  }

  return (
    <div className="-mt-2 mb-5">

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-medium text-[#276ef1] hover:text-[#276ef1]/80 transition-colors mb-3 group"
      >
        <img src="/img/aria-avatar.avif" alt="Aria" className="w-6 h-6 rounded-full object-cover shrink-0" />
        Let AI personalise your demo
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="rounded-2xl border border-[#e8edf5] bg-white shadow-sm overflow-hidden mb-2">

          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f2f5]" style={{ background: "#f7f9ff" }}>
            <img src="/img/aria-avatar.avif" alt="Aria" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Aria — AI Demo Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-gray-400">3 quick questions to personalise your demo</p>
              </div>
            </div>
            {/* Progress dots */}
            <div className="flex gap-1.5 items-center mr-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i < answers.length
                      ? "w-2 h-2 bg-green-400"
                      : i === step && !done
                      ? "w-3 h-2 bg-[#276ef1]"
                      : "w-2 h-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <button onClick={() => setDismissed(true)} className="text-gray-300 hover:text-gray-500 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            {!done ? (
              <>
                {/* Previous answers */}
                {answers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {answers.map((a, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs bg-[#eff6ff] text-[#276ef1] border border-[#276ef1]/20 rounded-full px-3 py-1 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> {a}
                      </span>
                    ))}
                  </div>
                )}

                {/* Current question */}
                <div className="flex items-start gap-2.5 mb-4">
                  <img src="/img/aria-avatar.avif" alt="Aria" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="bg-[#f3f4f6] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-700 leading-relaxed">
                    {STEPS[step].question}
                  </div>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {STEPS[step].chips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => answer(chip)}
                      className="text-[11px] border border-[#276ef1]/25 text-[#276ef1] rounded-full px-3 py-1.5 hover:bg-[#276ef1] hover:text-white transition-all bg-white font-medium"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <img src="/img/aria-avatar.avif" alt="Aria" className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                  <div className="bg-[#f3f4f6] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-700 leading-relaxed">
                    ✅ Your demo has been personalised! Here's what we'll focus on:
                  </div>
                </div>

                <div className="bg-[#eff6ff] rounded-2xl p-4 border border-[#276ef1]/20 ml-9">
                  <p className="text-[11px] text-[#276ef1] font-semibold uppercase tracking-widest mb-2">Recommended</p>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{rec?.emoji} {rec?.product}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    We'll {rec?.reason}. Your session will focus on {rec?.focus}.
                  </p>
                </div>

                <div className="flex items-center justify-between pl-9 pt-1">
                  <p className="text-xs text-gray-400">Your answers have been added to the form below ↓</p>
                  <button
                    onClick={() => setDismissed(true)}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                  >
                    Dismiss <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
