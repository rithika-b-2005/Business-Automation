"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/app/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ArrowRight, ArrowLeft, User, Briefcase, FileText, Upload, X, MapPin, Clock, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { fadeUp, transition } from "@/lib/animations"

type Job = {
  id: string
  title: string
  type: string
  location: string
  duration: string
  description: string
  skills: string[]
}

function ApplyForm() {
  const params = useSearchParams()
  const jobId = params.get("jobId") ?? ""
  const roleTitle = params.get("role") ?? ""

  const [tab, setTab] = useState("description")
  const [unlocked, setUnlocked] = useState<string[]>(["description"])

  function goTo(next: string) {
    setUnlocked(prev => prev.includes(next) ? prev : [...prev, next])
    setTab(next)
  }
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [job, setJob] = useState<Job | null>(null)

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    city: "", country: "", linkedin: "", github: "",
    experience: "", qualification: "", availability: "", company: "",
    whyJoin: "", coverLetter: "", portfolio: "",
  })
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => { window.location.href = "/careers" }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    fetch("/api/jobs")
      .then(r => r.json())
      .then(data => {
        const found = (data.jobs ?? []).find((j: Job) => j.id === jobId)
        if (found) setJob(found)
      })
      .catch(() => {})
  }, [jobId])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.type !== "application/pdf") { toast.error("Please upload a PDF file."); return }
    if (file && file.size > 5 * 1024 * 1024) { toast.error("Resume must be smaller than 5 MB."); return }
    setResumeFile(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append("jobId", jobId)
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (resumeFile) fd.append("resume", resumeFile)

      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? "Submission failed."); return }
      setSubmitted(true)
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Thanks for applying at Tec Tha. We'll review your application and get back to you within 5–7 business days.
                </p>
              </div>
              <Separator className="bg-[#f0f2f5]" />
              <p className="text-sm text-gray-400 text-center">Keep an eye on your inbox for updates from our team.</p>
              <Button asChild className="w-full rounded-xl text-white h-11 font-semibold" style={{ background: "#276ef1" }}>
                <Link href="/careers">Back to Careers</Link>
              </Button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
      <Header />

      {/* ── Back button ── */}
      <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto flex justify-start">
        <button
          onClick={() => window.location.href = "/careers"}
          className="flex items-center gap-1.5 text-sm text-[#7a8899] hover:text-[#276ef1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Careers
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="pt-6 pb-10 px-6 text-center" style={{ background: "#f3f4f6" }}>
        <div className="max-w-xl mx-auto">
          <motion.h1
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.1 }}
            className="text-3xl font-normal leading-[1.15] tracking-tight text-black mb-2"
          >
            Apply for a Role
          </motion.h1>
          {roleTitle && (
            <motion.p
              initial={fadeUp.hidden} animate={fadeUp.visible}
              transition={{ ...transition.base, delay: 0.2 }}
              className="text-sm text-[#7a8899]"
            >
              {roleTitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* ── Form ── */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white border border-[#e8edf5] rounded-2xl shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-5 sm:px-8 py-5 border-b border-[#f0f2f5] flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-gray-900">Job Application</p>
                  <p className="text-xs text-gray-400 mt-0.5">Complete all sections to submit your application</p>
                </div>
                <Badge variant="outline" className="text-xs rounded-full px-3 bg-[#eff6ff] text-[#276ef1] border-blue-200">Tec Tha</Badge>
              </div>

              <div className="px-4 sm:px-8 py-6 sm:py-8">
                <Tabs value={tab} onValueChange={(v) => unlocked.includes(v) && setTab(v)}>
                  <TabsList className="mb-8 bg-[#f3f4f6] rounded-xl p-1 w-full">
                    <TabsTrigger value="description" disabled={!unlocked.includes("description")} className="flex-1 rounded-lg gap-1.5 data-[state=active]:bg-[#276ef1] data-[state=active]:text-white text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                      <BookOpen className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">Job Description</span><span className="sm:hidden">JD</span>
                    </TabsTrigger>
                    <TabsTrigger value="personal" disabled={!unlocked.includes("personal")} className="flex-1 rounded-lg gap-1.5 data-[state=active]:bg-[#276ef1] data-[state=active]:text-white text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                      <User className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">Personal Info</span><span className="sm:hidden">Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="professional" disabled={!unlocked.includes("professional")} className="flex-1 rounded-lg gap-1.5 data-[state=active]:bg-[#276ef1] data-[state=active]:text-white text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">Experience</span><span className="sm:hidden">Exp</span>
                    </TabsTrigger>
                    <TabsTrigger value="documents" disabled={!unlocked.includes("documents")} className="flex-1 rounded-lg gap-1.5 data-[state=active]:bg-[#276ef1] data-[state=active]:text-white text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                      <FileText className="w-3.5 h-3.5 shrink-0" /> <span className="hidden sm:inline">Documents</span><span className="sm:hidden">Docs</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* ── Tab 0: Job Description ── */}
                  <TabsContent value="description" className="mt-0">
                    {job ? (
                      <div className="space-y-8">

                        {/* Top: 2-column content */}
                        <div className="grid lg:grid-cols-2 gap-8">

                          {/* Left column */}
                          <div className="space-y-7">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">About the Role</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
                            </div>
                            <Separator className="bg-[#f0f2f5]" />
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Key Responsibilities</p>
                              <ul className="space-y-2.5">
                                {[
                                  "Identify and qualify new business leads through research and outreach",
                                  "Support the team in preparing client proposals and presentations",
                                  "Maintain and update CRM records with accurate lead information",
                                  "Conduct market research to uncover new opportunities and trends",
                                  "Assist in scheduling and following up on client meetings",
                                  "Collaborate with internal teams to align BD efforts with company goals",
                                ].map(r => (
                                  <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#276ef1] shrink-0 mt-0.5" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Separator className="bg-[#f0f2f5]" />
                            {/* Role Details inline */}
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Role Details</p>
                              <div className="flex flex-wrap gap-5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#f3f4f6] border border-[#e8edf5] flex items-center justify-center shrink-0">
                                    <Briefcase className="w-3.5 h-3.5 text-[#276ef1]" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Type</p>
                                    <p className="text-sm font-medium text-gray-800">{job.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#f3f4f6] border border-[#e8edf5] flex items-center justify-center shrink-0">
                                    <MapPin className="w-3.5 h-3.5 text-[#276ef1]" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Location</p>
                                    <p className="text-sm font-medium text-gray-800">{job.location}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-[#f3f4f6] border border-[#e8edf5] flex items-center justify-center shrink-0">
                                    <Clock className="w-3.5 h-3.5 text-[#276ef1]" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400">Duration</p>
                                    <p className="text-sm font-medium text-gray-800">{job.duration}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 pt-1">
                                {job.skills.map(s => (
                                  <span key={s} className="flex items-center gap-1.5 text-xs bg-[#f3f4f6] text-gray-700 rounded-full px-3 py-1.5 border border-[#e8edf5]">
                                    <CheckCircle2 className="w-3 h-3 text-[#276ef1]" />
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right column */}
                          <div className="space-y-7">
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Requirements</p>
                              <ul className="space-y-2.5">
                                {[
                                  "Currently pursuing or recently completed a degree in Business, Marketing, or related field",
                                  "Strong verbal and written communication skills",
                                  "Proactive attitude with a willingness to learn",
                                  "Basic familiarity with CRM tools or MS Office / Google Workspace",
                                  "Ability to work independently in a remote environment",
                                ].map(r => (
                                  <li key={r} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#276ef1] shrink-0 mt-0.5" />
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Separator className="bg-[#f0f2f5]" />
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What to Expect</p>
                              <ul className="space-y-2.5">
                                {[
                                  "Hands-on experience with real business projects from day one",
                                  "Mentorship and guidance from senior team members",
                                  "Flexible remote-first work environment",
                                  "Certificate of completion issued at end of internship",
                                  "Performance review with detailed feedback",
                                  "Possibility of a full-time offer based on performance",
                                  "Access to internal tools, platforms, and learning resources",
                                ].map(point => (
                                  <li key={point} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-[#276ef1] shrink-0 mt-0.5" />
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button type="button" onClick={() => goTo("personal")} className="rounded-xl text-white font-semibold h-10 px-7 gap-2 text-sm" style={{ background: "#276ef1" }}>
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>

                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* ── Tab 1: Personal ── */}
                  <TabsContent value="personal" className="space-y-5 mt-0">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">First name</Label>
                        <Input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Jane" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Last name</Label>
                        <Input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Smith" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Email address</Label>
                        <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@email.com" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Phone number</Label>
                        <Input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 88074 12810" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">City</Label>
                        <Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="New York" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Country</Label>
                        <Input value={form.country} onChange={e => set("country", e.target.value)} placeholder="India" required className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">LinkedIn profile <span className="text-gray-400 font-normal">(optional)</span></Label>
                        <Input value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">GitHub profile <span className="text-gray-400 font-normal">(optional)</span></Label>
                        <Input value={form.github} onChange={e => set("github", e.target.value)} placeholder="https://github.com/yourname" className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={() => setTab("description")} className="rounded-xl h-11 px-6 border-[#e8edf5] gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button type="button" onClick={() => goTo("professional")} className="rounded-xl text-white font-semibold h-11 px-8 gap-2" style={{ background: "#276ef1" }}>
                        Next <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* ── Tab 2: Experience ── */}
                  <TabsContent value="professional" className="space-y-5 mt-0">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Role applying for</Label>
                        <Input value={roleTitle} readOnly className="rounded-lg h-11 border-[#e0e0e0] bg-[#f9f9f9] focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Years of experience</Label>
                        <Select value={form.experience} onValueChange={v => set("experience", v)}>
                          <SelectTrigger className="rounded-lg h-11 border-[#e0e0e0] w-full focus-visible:ring-0"><SelectValue placeholder="Select experience" /></SelectTrigger>
                          <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                            <SelectItem value="0">Fresher (0 years)</SelectItem>
                            <SelectItem value="1">1 year</SelectItem>
                            <SelectItem value="2">2 years</SelectItem>
                            <SelectItem value="3">3+ years</SelectItem>
                            <SelectItem value="5">5+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Highest qualification</Label>
                        <Select value={form.qualification} onValueChange={v => set("qualification", v)}>
                          <SelectTrigger className="rounded-lg h-11 border-[#e0e0e0] w-full"><SelectValue placeholder="Select qualification" /></SelectTrigger>
                          <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                            <SelectItem value="masters">Master's Degree</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-700 text-sm font-medium">Availability</Label>
                        <Select value={form.availability} onValueChange={v => set("availability", v)}>
                          <SelectTrigger className="rounded-lg h-11 border-[#e0e0e0] w-full"><SelectValue placeholder="When can you start?" /></SelectTrigger>
                          <SelectContent position="popper" className="w-[--radix-select-trigger-width]">
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="2weeks">In 2 weeks</SelectItem>
                            <SelectItem value="1month">In 1 month</SelectItem>
                            <SelectItem value="2months">In 2+ months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm font-medium">Current / most recent company <span className="text-gray-400 font-normal">(optional)</span></Label>
                      <Input value={form.company} onChange={e => set("company", e.target.value)} placeholder="Acme Inc." className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm font-medium">Why do you want to join Tec Tha?</Label>
                      <Textarea value={form.whyJoin} onChange={e => set("whyJoin", e.target.value)} placeholder="Tell us what excites you about this role..." className="rounded-lg resize-none min-h-[110px] border-[#e0e0e0] text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button type="button" variant="outline" onClick={() => goTo("personal")} className="rounded-xl h-11 px-6 border-[#e8edf5] gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button type="button" onClick={() => goTo("documents")} className="rounded-xl text-white font-semibold h-11 px-8 gap-2" style={{ background: "#276ef1" }}>
                        Next <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* ── Tab 3: Documents ── */}
                  <TabsContent value="documents" className="space-y-5 mt-0">
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm font-medium">
                        Resume / CV{" "}
                        <span className="text-[#276ef1] font-normal text-xs">(PDF, max 5 MB — AI scored against job description)</span>
                      </Label>
                      {resumeFile ? (
                        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-[#eff6ff] px-4 py-3">
                          <FileText className="w-5 h-5 text-[#276ef1] shrink-0" />
                          <span className="text-sm text-gray-800 flex-1 truncate">{resumeFile.name}</span>
                          <button
                            type="button"
                            onClick={() => { setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e0e0e0] bg-[#f9f9f9] hover:border-[#276ef1] hover:bg-[#eff6ff] transition-all px-6 py-8"
                        >
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Click to upload your resume (PDF)</span>
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm font-medium">Cover letter <span className="text-gray-400 font-normal">(optional)</span></Label>
                      <Textarea value={form.coverLetter} onChange={e => set("coverLetter", e.target.value)} placeholder="Write a short cover letter..." className="rounded-lg resize-none min-h-[130px] border-[#e0e0e0] text-sm focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 text-sm font-medium">Portfolio / work samples <span className="text-gray-400 font-normal">(optional)</span></Label>
                      <Input value={form.portfolio} onChange={e => set("portfolio", e.target.value)} placeholder="https://yourportfolio.com" className="rounded-lg h-11 border-[#e0e0e0] focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>

                    <Separator className="bg-[#f0f2f5]" />
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <Button type="button" variant="outline" onClick={() => goTo("professional")} className="w-full sm:w-auto rounded-xl h-11 px-6 border-[#e8edf5] gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button type="submit" disabled={loading} className="w-full sm:w-auto rounded-xl text-white font-semibold h-11 px-10 gap-2" style={{ background: "#276ef1" }}>
                        {loading ? "Submitting…" : "Submit Application"} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function ApplyPage() {
  return (
    <Suspense>
      <ApplyForm />
    </Suspense>
  )
}
