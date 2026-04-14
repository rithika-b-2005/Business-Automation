"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, ClipboardList, Users, Handshake } from "lucide-react"
import { scaleUp, fadeUp, transition, viewport, stagger } from "@/lib/animations"

const STEPS = [
  {
    num: "01",
    title: "Map Your Workflows",
    desc: "We analyse your existing operations, identify bottlenecks, and map every process ready for automation.",
    icon: Settings,
  },
  {
    num: "02",
    title: "Build & Configure",
    desc: "Our platform configures your automation rules, triggers, and integrations — no code required.",
    icon: ClipboardList,
  },
  {
    num: "03",
    title: "Connect Your Tools",
    desc: "Seamlessly integrate with your existing CRM, ERP, HR, and finance systems via open APIs.",
    icon: Users,
  },
  {
    num: "04",
    title: "Go Live & Scale",
    desc: "Launch automated workflows across your teams and scale operations without adding headcount.",
    icon: Handshake,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="pt-8 pb-16 md:pt-10 md:pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={scaleUp.hidden} whileInView={scaleUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-center mb-14"
        >
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff]">
              From Setup to Scale
            </Badge>
          </div>
          <h2 className="text-3xl font-normal text-gray-900">Four Steps to Full Automation</h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ ...transition.base, delay: i * stagger }}
                viewport={viewport}
              >
                <Card className="group relative overflow-hidden h-full border-0 shadow-md bg-white hover:bg-[#1a56db] transition-colors duration-300 cursor-pointer">
                  {/* Large watermark number */}
                  <span className="absolute -top-4 -right-2 text-8xl font-black select-none pointer-events-none text-gray-100 group-hover:text-white/10 transition-colors duration-300">
                    {step.num}
                  </span>

                  <CardContent className="p-7 flex flex-col gap-5 relative z-10">
                    {/* Icon circle */}
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#eef2ff] group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-[#1a56db] group-hover:text-white transition-all duration-300 group-hover:scale-110" strokeWidth={1.5} />
                    </div>

                    {/* Step number pill */}
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1a56db] group-hover:text-white/60 transition-colors duration-300">
                      Step {step.num}
                    </span>

                    <div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-white transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500 group-hover:text-white/70 transition-colors duration-300">
                        {step.desc}
                      </p>
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
