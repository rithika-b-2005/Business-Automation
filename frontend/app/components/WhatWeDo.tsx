"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { fadeUp, slideInLeft, slideInRight, scaleUp, transition, viewport, stagger } from "@/lib/animations"
import { ArrowRight, TrendingUp, Briefcase, BarChart3, CheckCircle2 } from "lucide-react"

const SERVICES = [
  {
    title: "Digital Marketing",
    desc: "Drive targeted growth with data-driven campaigns across search, social, and content channels — turning clicks into loyal customers.",
    img: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
    icon: TrendingUp,
    color: "#1a56db",
    accentBg: "#eff6ff",
    points: [
      "SEO & paid search campaigns tailored to your audience",
      "Social media strategy across LinkedIn, Instagram, and Meta",
      "Content marketing that builds authority and drives organic traffic",
      "Email campaigns with measurable open rates and conversions",
      "Performance reporting with real-time ROI tracking",
    ],
  },
  {
    title: "Business Development",
    desc: "Identify new market opportunities, forge strategic partnerships, and build scalable pipelines that fuel long-term revenue growth.",
    img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    icon: Briefcase,
    color: "#7c3aed",
    accentBg: "#f5f3ff",
    points: [
      "Market research and competitive landscape analysis",
      "Strategic partnership identification and outreach",
      "Sales pipeline design and CRM implementation",
      "Go-to-market planning for new products and regions",
      "Revenue forecasting and growth roadmapping",
    ],
  },
  {
    title: "Business Analysis & Growth",
    desc: "Uncover insights from your data, streamline operations, and implement proven growth strategies that move the needle on every KPI.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    icon: BarChart3,
    color: "#059669",
    accentBg: "#f0fdf4",
    points: [
      "End-to-end data audits and KPI framework design",
      "Process mapping and operational bottleneck identification",
      "Custom dashboards for leadership and team visibility",
      "Growth experiments and A/B testing programmes",
      "Quarterly business reviews with actionable recommendations",
    ],
  },
]

export default function WhatWeDo() {
  const [active, setActive] = useState<typeof SERVICES[0] | null>(null)

  return (
    <section id="services" className="pt-10 pb-16 md:pt-14 md:pb-24 bg-[#f3f4f6] relative overflow-hidden">
      {/* Dot grid — top right */}
      <div
        className="absolute top-8 right-8 opacity-25 pointer-events-none"
        style={{ display: "grid", gridTemplateColumns: "repeat(18, 6px)", gap: "20px" }}
      >
        {Array.from({ length: 324 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        ))}
      </div>

      {/* Dot grid — bottom left */}
      <div
        className="absolute bottom-8 left-8 opacity-25 pointer-events-none"
        style={{ display: "grid", gridTemplateColumns: "repeat(18, 6px)", gap: "20px" }}
      >
        {Array.from({ length: 324 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={scaleUp.hidden} whileInView={scaleUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#1a56db]/30 text-[#1a56db] bg-[#eff6ff]">
              Our Services
            </Badge>
          </div>
          <h2 className="text-3xl font-normal leading-[1.2] text-gray-900">
            Solutions Built for Every Team
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => {
            const anim = i === 0 ? slideInLeft : i === 2 ? slideInRight : fadeUp
            return (
            <motion.div
              key={service.title}
              initial={anim.hidden} whileInView={anim.visible}
              transition={{ ...transition.base, delay: i * stagger }}
              viewport={viewport}
            >
              <Card className="group overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="overflow-hidden h-48">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 flex flex-col gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{service.desc}</p>
                  <button
                    onClick={() => setActive(service)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all mt-1 w-fit text-[#276ef1]"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )})}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 overflow-hidden [&>button]:outline-none [&>button]:ring-0 [&>button]:shadow-none" style={{ maxHeight: "88vh" }}>
          {active && (
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ maxHeight: "88vh" }}>
              <div className="h-52 overflow-hidden">
                <img src={active.img} alt={active.title} className="w-full h-full object-cover" />
              </div>

              <div className="px-7 py-6">
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-1">{active.title}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 leading-relaxed mb-5">{active.desc}</DialogDescription>

                <ul className="flex flex-col gap-3 mb-6">
                  {active.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#276ef1]" />
                      <span className="text-sm text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full rounded-xl font-semibold text-white text-sm" style={{ background: "#276ef1" }} asChild>
                  <a href="/contact">Get Started</a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
