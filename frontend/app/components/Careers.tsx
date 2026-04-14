"use client"

import { motion } from "framer-motion"
import { ArrowRight, GraduationCap, Briefcase, Rocket, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { slideInLeft, slideInRight, scaleUp, transition, viewport, stagger } from "@/lib/animations"

export default function Careers() {
  return (
    <section id="careers" className="py-8 md:py-12 bg-[#f3f4f6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: image ── */}
          <motion.div
            initial={slideInLeft.hidden} whileInView={slideInLeft.visible}
            transition={transition.slow} viewport={viewport}
          >
            <div className="w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80"
                alt="Careers at Tec Tha"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {/* ── Right: content ── */}
          <motion.div
            initial={slideInRight.hidden} whileInView={slideInRight.visible}
            transition={transition.slow} viewport={viewport}
            className="flex flex-col gap-5"
          >
            <Badge variant="outline" className="w-fit mx-auto rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest border-[#276ef1]/30 text-[#276ef1] bg-[#eff6ff]">
              Careers &amp; Internships
            </Badge>

            <h2 className="text-3xl md:text-4xl font-normal leading-[1.2] text-gray-900 text-center">
              Grow Your Career With Tec Tha
            </h2>

            <p className="text-lg text-gray-500 leading-relaxed text-center">
              Whether you're a fresh graduate seeking your first break or a seasoned professional ready for a new challenge — we have a place for you.
            </p>

            <Separator className="bg-[#e8edf5]" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: GraduationCap, num: "01", title: "Student Internships",  desc: "3–6 month programs across BD, marketing, and strategy — built for college students ready to learn." },
                { icon: Rocket,        num: "02", title: "Grow With Us",         desc: "We mentor interns into full contributors, giving real responsibilities from day one." },
                { icon: Briefcase,     num: "03", title: "Full-time Hiring",     desc: "Analyst, associate, and leadership roles for professionals who want to make an impact." },
                { icon: Users,         num: "04", title: "Diverse Teams",        desc: "Join a cross-functional team across operations, tech, sales, and growth." },
              ].map(({ icon: Icon, num, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 40, scale: 0.93 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ ...transition.base, delay: i * stagger }}
                  viewport={{ once: false, amount: 0.1 }}
                  className="group relative overflow-hidden rounded-xl border-0 shadow-sm bg-white hover:bg-[#1a56db] transition-colors duration-300 cursor-default p-4"
                >
                  {/* Watermark number */}
                  <span className="absolute -top-2 -right-1 text-5xl font-black select-none pointer-events-none text-gray-100 group-hover:text-white/10 transition-colors duration-300">
                    {num}
                  </span>
                  {/* Icon + Title row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#eef2ff] group-hover:bg-white/15 transition-all duration-300 shrink-0">
                      <Icon className="w-4 h-4 text-[#1a56db] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-white transition-colors duration-300 leading-snug">{title}</p>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-white/70 transition-colors duration-300 leading-snug">{desc}</p>
                </motion.div>
              ))}
            </div>

            <Button
              asChild
              className="w-fit mx-auto rounded-xl text-white font-semibold text-sm gap-2"
              style={{ background: "#276ef1" }}
            >
              <Link href="/careers">
                View All Openings <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
