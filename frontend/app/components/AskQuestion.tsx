"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, ArrowRight } from "lucide-react"
import { toast } from "sonner"

interface AskQuestionProps {
  buttonLabel?: string
  buttonVariant?: "default" | "outline"
  showOnLoad?: boolean
}

export default function AskQuestion({
  buttonLabel = "Ask a Question",
  buttonVariant = "outline",
  showOnLoad = false,
}: AskQuestionProps) {
  const [open, setOpen] = useState(showOnLoad)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", question: "" })

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
      console.log("[AskQuestion] Submitting:", form)

      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      console.log("[AskQuestion] Response:", data)

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit question.")
        return
      }

      setOpen(false)
      setForm({ name: "", email: "", question: "" })
      toast.success(data.message ?? "Question submitted successfully!")
    } catch (err) {
      console.error("[AskQuestion] Error:", err)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={buttonVariant}
        className={`rounded-xl text-sm font-semibold gap-2 ${
          buttonVariant === "default" ? "text-white" : "border-[#e8edf5] text-gray-700 hover:border-[#276ef1] hover:text-[#276ef1]"
        }`}
        style={buttonVariant === "default" ? { background: "#276ef1" } : {}}
      >
        <HelpCircle className="w-4 h-4" />
        {buttonLabel}
      </Button>

      {/* Question Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full rounded-2xl [&>button]:outline-none [&>button]:ring-0">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-0">
            Ask a Question
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in your details and question — our team will respond shortly.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Your name
                {!isNameFilled && <span className="text-red-500">*</span>}
              </Label>
              <Input
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Email address
                {!isEmailFilled && <span className="text-red-500">*</span>}
              </Label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-10 rounded-lg border border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-gray-700">
                Your question
                {!isQuestionFilled && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                placeholder="What would you like to know about Tec Tha?"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                className="rounded-lg border border-[#e0e0e0] min-h-[100px] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormComplete}
              className="w-full rounded-xl font-semibold text-white text-sm gap-2 transition-all"
              style={{
                background: isFormComplete ? "#276ef1" : "#d1d5db",
                cursor: isFormComplete ? "pointer" : "not-allowed",
                opacity: isFormComplete ? 1 : 0.6,
              }}
            >
              {loading ? "Submitting..." : "Submit Question"}
              {!loading && isFormComplete && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
