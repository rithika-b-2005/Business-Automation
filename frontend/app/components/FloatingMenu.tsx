"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Message = {
  role: "user" | "ai"
  text: string
}

const QUICK_ACTIONS = [
  { label: "🗺️ Give me a tour", msg: "Give me a quick tour of the Tec Tha app and its main pages." },
  { label: "⚡ What is FlowBot?", msg: "What is FlowBot and how does it work?" },
  { label: "📦 All products", msg: "What products does Tec Tha offer?" },
  { label: "🚀 How to get started?", msg: "How do I get started with Tec Tha?" },
  { label: "📞 Contact / Demo", msg: "How can I contact the team or book a demo?" },
  { label: "🔗 Integrations", msg: "What tools and apps does Tec Tha integrate with?" },
]

// Aria avatar — custom image
function AriaAvatar({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/img/aria-avatar.avif"
      alt="Aria"
      width={size}
      height={size}
      className="rounded-full shrink-0 object-cover"
      style={{ width: size, height: size }}
    />
  )
}

// User avatar — gray circle with person icon
function UserAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 bg-[#e8edf5]"
      style={{ width: size, height: size }}
    >
      <User style={{ width: size * 0.55, height: size * 0.55 }} className="text-[#7a8899]" />
    </div>
  )
}

export default function FloatingMenu() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm Aria, Tec Tha's AI assistant 👋\n\nI can explain any page, guide you through the app, or answer questions about our products. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    const updated = [...messages, { role: "user" as const, text: msg }]
    setMessages(updated)
    setInput("")
    setTyping(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.text || "Sorry, I couldn't get a response. Please try again." },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ])
    } finally {
      setTyping(false)
    }
  }

  function formatText(text: string) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div ref={containerRef} className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">

      {/* Chat window */}
      {open && (
        <div
          className="w-[360px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col bg-white"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 shrink-0"
            style={{ background: "#276ef1" }}
          >
            <AriaAvatar size={36} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Aria — Tec Tha Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-white/50">Online · here to guide you</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "ai" && <AriaAvatar size={26} />}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#276ef1] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {formatText(m.text)}
                  </div>
                  {m.role === "user" && <UserAvatar size={26} />}
                </div>
              ))}

              {typing && (
                <div className="flex justify-start items-end gap-2">
                  <AriaAvatar size={26} />
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick actions — show only at start */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {QUICK_ACTIONS.map(a => (
                <button
                  key={a.label}
                  onClick={() => sendMessage(a.msg)}
                  className="text-xs border border-gray-200 text-gray-600 rounded-full px-3 py-1.5 hover:border-[#276ef1] hover:text-[#276ef1] hover:bg-blue-50 transition-colors bg-white"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex gap-2 shrink-0">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !typing && sendMessage()}
              placeholder="Ask about any page or feature..."
              className="rounded-xl h-10 border-gray-200 text-sm"
              disabled={typing}
            />
            <Button
              size="icon"
              onClick={() => sendMessage()}
              disabled={!input.trim() || typing}
              className="rounded-xl h-10 w-10 shrink-0 bg-[#276ef1] hover:bg-[#276ef1]/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative"
        style={{ background: "#276ef1" }}
        aria-label="AI Assistant"
      >
        {open ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <AriaAvatar size={44} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </>
        )}
      </button>

    </div>
  )
}
