"use client"

import { useEffect, useState } from "react"
import Header from "@/app/components/Header"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, MapPin, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { fadeUp, transition, viewport } from "@/lib/animations"

type Job = {
  id: string
  title: string
  type: string
  location: string
  duration: string
  description: string
  skills: string[]
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => { window.location.href = "/landing" }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    fetch("/api/jobs")
      .then(r => r.json())
      .then(data => setJobs(data.jobs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
            Careers &amp; Internships
          </motion.h1>
          <motion.p
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.2 }}
            className="text-sm text-[#7a8899] leading-relaxed"
          >
            Build your career at Tec Tha — where fresh talent meets real opportunity. We hire for potential, not just experience.
          </motion.p>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">

          {loading ? (
            <div className="grid md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[#e8edf5] rounded-2xl p-6 animate-pulse shadow-sm">
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: false, amount: 0.08 }}
                  className="bg-white border border-[#e8edf5] rounded-2xl p-6 hover:shadow-md hover:border-[#276ef1]/20 transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                    <Badge variant="outline" className={`text-xs rounded-full px-3 shrink-0 ${
                      job.type === "Internship"
                        ? "border-purple-200 text-purple-600 bg-purple-50"
                        : "border-blue-200 text-[#276ef1] bg-blue-50"
                    }`}>
                      {job.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{job.description}</p>
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {job.skills.map(s => (
                      <span key={s} className="text-xs bg-[#f3f4f6] text-gray-600 rounded-full px-2.5 py-1">{s}</span>
                    ))}
                  </div>
                  <Link
                    href={`/careers/apply?jobId=${job.id}&role=${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#276ef1] group-hover:gap-2.5 transition-all"
                  >
                    Apply for this role <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-10">
            Don't see a fit?{" "}
            <a
              href={`mailto:tecthaofficial@gmail.com?subject=Open%20Application%20%E2%80%94%20CV%20Submission&body=Hi%20Tec%20Tha%20Team%2C%0A%0AI%20couldn%27t%20find%20a%20role%20that%20fits%20my%20profile%2C%20but%20I%27d%20love%20to%20be%20considered%20for%20future%20opportunities.%0A%0APlease%20find%20my%20CV%20attached.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D`}
              className="text-[#276ef1] hover:underline font-medium"
            >
              Send us your CV anyway →
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
