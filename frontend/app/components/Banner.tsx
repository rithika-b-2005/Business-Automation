"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rocket, MessageCircle } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

export default function Banner() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" style={{ background: "#f7f9ff" }}>

      {/* Subtle grid background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(#20262D 1px, transparent 1px), linear-gradient(90deg, #20262D 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-32 pb-24 flex flex-col items-center text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-[#276ef1]/20 bg-[#eff6ff] px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#276ef1] animate-pulse" />
          <span className="text-xs font-medium text-[#276ef1] tracking-wide">Business Automation Platform</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease }}
          className="text-4xl md:text-5xl xl:text-6xl font-normal leading-[1.15] tracking-tight text-black max-w-3xl"
        >
          Automate your entire business
          <br />in one place
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease }}
          className="mt-6 text-lg md:text-xl text-[#7a8899] leading-relaxed max-w-xl"
        >
          Stop juggling disconnected tools. Tec Tha connects your workflows, teams, and data —
          delivering real-time visibility and AI-powered automation across every department.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36, ease }}
          className="flex items-center gap-3 mt-10"
        >
          <Button
            size="lg"
            asChild
            className="rounded-xl px-6 py-3 text-sm font-semibold text-white gap-2 border-0"
            style={{ background: "#276ef1" }}
          >
            <a href="/explore">
              <Rocket className="w-4 h-4" />
              Explore Now
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="rounded-xl px-6 py-3 text-sm font-semibold gap-2 border-[#dde4f0] text-[#1a2233] hover:bg-[#f7f8f9]"
          >
            <a href="/contact">
              <MessageCircle className="w-4 h-4" />
              Contact Us
            </a>
          </Button>
        </motion.div>

      </div>

    </section>
  )
}
