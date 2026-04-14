"use client"

import { useState, useRef, useEffect } from "react"
import { Send, ChevronDown, ChevronUp, Wand2, CheckCircle2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Message = { role: "user" | "ai"; text: string }
type FillData = { subject: string; message: string }

interface Props {
  onFill: (data: FillData) => void
}

function extractFill(text: string): FillData | null {
  try {
    const match = text.match(/\{[^{}]*"subject"[^{}]*"message"[^{}]*\}/)
    if (match) return JSON.parse(match[0])
  } catch {}
  return null
}

function cleanText(text: string): string {
  return text.replace(/\{[^{}]*"subject"[^{}]*"message"[^{}]*\}/g, "").trim()
}

const QUICK_SUGGESTS = [
  "I want to request a demo",
  "I have a support issue",
  "I'm interested in partnership",
  "I want to know about pricing",
]

export default function ContactFormHelper({ onFill }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Describe what you need in plain language — I'll write the perfect message for you. 🪄" },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [suggestion, setSuggestion] = useState<FillData | null>(null)
  const [applied, setApplied] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    const updated = [...messages, { role: "user" as const, text: msg }]
    setMessages(updated)
    setInput("")
    setTyping(true)
    setSuggestion(null)
    setApplied(false)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, mode: "contact" }),
      })
      const data = await res.json()
      const raw = data.text || "Sorry, try again."
      const fill = extractFill(raw)
      const displayText = cleanText(raw) || "Here's what I suggest:"
      setMessages(prev => [...prev, { role: "ai", text: displayText }])
      if (fill) setSuggestion(fill)
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Please try again." }])
    } finally {
      setTyping(false)
    }
  }

  function applyFill() {
    if (!suggestion) return
    onFill(suggestion)
    setApplied(true)
    setSuggestion(null)
    setMessages(prev => [...prev, { role: "ai", text: "✅ Done! I've filled in the Subject and Message for you. Review and hit Send!" }])
  }

  return (
    <div className="-mt-2 mb-5">

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-sm font-medium text-[#276ef1] hover:text-[#276ef1]/80 transition-colors mb-3 group"
      >
        <img src="/img/aria-avatar.avif" alt="Aria" className="w-6 h-6 rounded-full object-cover shrink-0" />
        Let AI help you write this
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="rounded-2xl border border-[#e8edf5] bg-white shadow-sm overflow-hidden mb-2">

          {/* Card header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f2f5]" style={{ background: "#f7f9ff" }}>
            <img src="/img/aria-avatar.avif" alt="Aria" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Aria — AI Writing Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-gray-400">Online · ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 px-4 py-4 max-h-[260px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <img src="/img/aria-avatar.avif" alt="Aria" className="w-7 h-7 rounded-full object-cover shrink-0 mb-0.5" />
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#276ef1] text-white rounded-br-sm"
                    : "bg-[#f3f4f6] text-gray-700 rounded-bl-sm"
                }`}>
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#e8edf5] flex items-center justify-center shrink-0 mb-0.5">
                    <User className="w-4 h-4 text-[#7a8899]" />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2.5">
                <img src="/img/aria-avatar.avif" alt="Aria" className="w-7 h-7 rounded-full object-cover shrink-0" />
                <div className="bg-[#f3f4f6] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {suggestion && (
              <div className="bg-[#eff6ff] rounded-2xl p-4 border border-[#276ef1]/20 ml-9">
                <p className="text-[11px] text-[#276ef1] font-semibold uppercase tracking-widest mb-2">Suggested Fill</p>
                <p className="text-sm font-semibold text-gray-900 mb-1">Subject: {suggestion.subject}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{suggestion.message}</p>
                <Button
                  size="sm"
                  onClick={applyFill}
                  className="mt-3 h-8 text-xs rounded-xl text-white gap-1.5 px-4 font-semibold"
                  style={{ background: "#276ef1" }}
                >
                  <Wand2 className="w-3.5 h-3.5" /> Apply to form
                </Button>
              </div>
            )}

            {applied && !suggestion && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 ml-9">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-sm text-green-700 font-medium">Form filled! Review below.</p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggests */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {QUICK_SUGGESTS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] border border-[#276ef1]/25 text-[#276ef1] rounded-full px-3 py-1.5 hover:bg-[#276ef1] hover:text-white transition-all bg-white font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-[#f0f2f5] flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !typing && send()}
              placeholder="e.g. I want to ask about pricing..."
              className="rounded-xl h-9 border-[#e0e0e0] bg-white text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={typing}
            />
            <Button
              size="icon"
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="rounded-xl h-9 w-9 shrink-0 hover:opacity-90"
              style={{ background: "#276ef1" }}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>

        </div>
      )}
    </div>
  )
}
