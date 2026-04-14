"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { CircleCheck, Users, Zap, Award, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { slideInLeft, slideInRight, transition, viewport } from "@/lib/animations"

const CHECKS = [
  "End-to-end workflow automation across all teams",
  "Real-time visibility into every business process",
  "Seamless integrations with your existing tools",
]

const BASE_DATE = new Date("2026-04-11")
function getDailyIncrement() {
  const diff = Math.floor((new Date().getTime() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const STATS = [
  { icon: Users,     base: 1000, suffix: "+", label: "Satisfied Clients" },
  { icon: Zap,       base: 1200, suffix: "+", label: "Workflows Automated" },
  { icon: Award,     base: 98,   suffix: "%", label: "Success Rate" },
  { icon: BarChart3, base: 30,   suffix: "%", label: "Cost Reduction" },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = Math.ceil(target / (1800 / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function AboutSection() {
  const inc = getDailyIncrement()

  return (
    <section id="about" className="pt-16 md:pt-24 pb-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: image ── */}
          <motion.div
            initial={slideInLeft.hidden} whileInView={slideInLeft.visible}
            transition={transition.slow} viewport={viewport}
            className="relative flex items-center justify-center"
          >
            <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80"
                alt="Tec Tha team"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* ── Right: content ── */}
          <motion.div
            initial={slideInRight.hidden} whileInView={slideInRight.visible}
            transition={transition.slow} viewport={viewport}
            className="flex flex-col gap-4"
          >
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff]">
              About Tec Tha
            </Badge>

            <h2 className="text-3xl md:text-4xl font-normal leading-[1.2] text-gray-900">
              We Help Businesses Automate<br />With Confidence
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Tec Tha is built for Operations, Sales, Finance, and HR teams — delivering
              a single connected platform that eliminates manual chaos and drives measurable outcomes
              across your entire organisation.
            </p>

            <Separator className="bg-[#e8edf5]" />

            {/* Checkmarks */}
            <ul className="flex flex-col gap-3">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "#eff6ff" }}>
                    <CircleCheck className="w-4 h-4" style={{ color: "#276ef1" }} />
                  </span>
                  <span className="text-base text-gray-600 leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-2">
              {STATS.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    transition={{ ...transition.base, delay: i * 0.08 }} viewport={viewport}
                    className="flex flex-col items-center text-center gap-1 rounded-xl border border-[#e8edf5] py-3 px-2 bg-white hover:shadow-sm transition-shadow"
                  >
                    <Icon className="w-4 h-4 text-black" strokeWidth={1.75} />
                    <p className="text-lg font-normal text-[#0d0f14]">
                      <CountUp target={stat.base + inc} suffix={stat.suffix} />
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight">{stat.label}</p>
                  </motion.div>
                )
              })}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
