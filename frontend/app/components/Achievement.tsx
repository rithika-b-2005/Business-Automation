"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Zap, Award, BarChart3 } from "lucide-react"
import { fadeUp, transition, viewport } from "@/lib/animations"

const BASE_DATE = new Date("2026-04-11")

function getDailyIncrement(): number {
  const today = new Date()
  const diff = Math.floor((today.getTime() - BASE_DATE.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const STATS = [
  { icon: Users,     base: 1000, suffix: "+", label: "Satisfied Clients",    desc: "Businesses actively using Tec Tha" },
  { icon: Zap,       base: 1200, suffix: "+", label: "Workflows Automated",  desc: "Processes running without manual effort" },
  { icon: Award,     base: 98,   suffix: "%", label: "Success Rate",         desc: "Project delivery on time and on target" },
  { icon: BarChart3, base: 30,   suffix: "%", label: "Cost Reduction",       desc: "Average savings reported by clients" },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Achievement() {
  const inc = getDailyIncrement()

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={fadeUp.hidden} whileInView={fadeUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-center mb-14"
        >
          <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff] mb-4">
            Achievement
          </Badge>
          <h2 className="text-3xl font-normal text-gray-900">We Are Driving Business Automation</h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            const value = stat.base + inc
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ ...transition.base, delay: i * 0.1 }} viewport={viewport}
              >
                <Card className="border border-[#e8edf5] shadow-none rounded-2xl bg-white hover:shadow-md transition-shadow duration-300 h-full">
                  <CardContent className="p-6 flex flex-col gap-4">

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#eff6ff]">
                      <Icon className="w-5 h-5 text-[#276ef1]" strokeWidth={1.75} />
                    </div>

                    {/* Number */}
                    <div className="text-3xl font-bold text-[#0d0f14]">
                      <CountUp target={value} suffix={stat.suffix} />
                    </div>

                    <Separator className="bg-[#f0f2f5]" />

                    {/* Label + desc */}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{stat.label}</p>
                      <p className="text-xs text-gray-400 mt-1 leading-snug">{stat.desc}</p>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
