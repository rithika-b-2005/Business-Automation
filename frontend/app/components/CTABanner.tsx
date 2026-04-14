"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { fadeUp, transition, viewport } from "@/lib/animations"

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-20">

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1628ee 0%, #0d2257cc 50%, #1a3a8f99 100%)" }} />

      <div className="relative max-w-2xl mx-auto px-6 text-center">

        {/* Icon badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
          transition={transition.base} viewport={viewport}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/15 mb-7"
        >
          <Zap className="w-7 h-7 text-white" strokeWidth={1.5} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={fadeUp.hidden} whileInView={fadeUp.visible}
          transition={transition.base} viewport={viewport}
          className="text-2xl md:text-3xl font-bold text-white leading-[1.15] mb-5"
        >
          Ready to automate your entire business?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={fadeUp.hidden} whileInView={fadeUp.visible}
          transition={{ ...transition.base, delay: 0.1 }} viewport={viewport}
          className="text-white/60 text-base md:text-lg mb-10 max-w-xl mx-auto"
        >
          Join 500+ companies already running smarter with Tec Tha — no code, no complexity, just results.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ ...transition.base, delay: 0.2 }} viewport={viewport}
          className="flex items-center justify-center"
        >
          <Button
            asChild
            className="bg-white text-[#0d2257] font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2 text-sm h-auto shadow-lg"
          >
            <Link href="/demo">
              Get Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  )
}
