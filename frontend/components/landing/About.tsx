"use client"

import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"

export default function About() {
  return (
    <section id="about" className="bg-[#0a0a0a] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — image collage */}
          <div className="relative">
            {/* Main large card */}
            <div className="rounded-3xl overflow-hidden bg-[#141414] border border-white/[0.07] aspect-[4/3] flex items-end p-6 relative">
              {/* Simulated dark office/team image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#141414] to-[#0a0a0a]" />
              <div className="absolute inset-0 dot-pattern opacity-30" />
              {/* Workflow visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-3 w-3/4">
                  {[
                    { label: "CRM Sync", color: "#6366f1", icon: "⚡" },
                    { label: "Email Auto", color: "#b5ff4f", icon: "✉", dark: true },
                    { label: "Analytics", color: "#06b6d4", icon: "📊" },
                    { label: "Invoicing", color: "#8b5cf6", icon: "💳" },
                    { label: "Scheduling", color: "#b5ff4f", icon: "📅", dark: true },
                    { label: "Reporting", color: "#f59e0b", icon: "📈" },
                  ].map((item, i) => (
                    <div key={i}
                      style={{ background: item.color + "15", borderColor: item.color + "30" }}
                      className="rounded-xl p-3 border flex flex-col gap-1.5 hover:-translate-y-1 transition-transform cursor-default">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tag */}
              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b5ff4f] text-black text-xs font-black uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                A Business Automation Platform
              </div>
            </div>

            {/* Small overlay card */}
            <div className="absolute -top-5 -right-5 bg-[#141414] border border-white/[0.07] rounded-2xl p-4 shadow-2xl w-44">
              <div className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Team Productivity</div>
              <div className="text-2xl font-black text-white mb-1">+68%</div>
              <div className="h-1.5 rounded-full bg-[#1f1f1f] overflow-hidden">
                <div className="h-full bg-[#b5ff4f] rounded-full" style={{ width: "68%" }} />
              </div>
              <div className="text-[10px] text-[#444] mt-1.5">Avg. across clients</div>
            </div>

            {/* Decorative */}
            <div className="absolute -bottom-4 -left-4 text-[#b5ff4f]/15 text-8xl font-black spin-slow select-none">✳</div>
          </div>

          {/* RIGHT — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b5ff4f]/10 border border-[#b5ff4f]/20 text-[#b5ff4f] text-xs font-bold uppercase tracking-wider mb-6">
              Who We Are
            </div>

            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] mb-6">
              Turning Workflows
              <br />
              Into{" "}
              <span className="text-[#b5ff4f]">Revenue.</span>
            </h2>

            <p className="text-[#888] text-lg leading-relaxed mb-6">
              NexFlow AI was built for operations teams tired of copy-pasting data between tools,
              running manual reports, and chasing approvals by email. We built the platform we
              always wished existed.
            </p>
            <p className="text-[#666] text-base leading-relaxed mb-10">
              Today, 25,000+ companies across 150+ countries use NexFlow AI to eliminate
              repetitive work, connect their entire stack, and scale without adding headcount.
            </p>

            {/* Checkmarks */}
            <div className="space-y-3 mb-10">
              {[
                "No-code workflow builder with AI generation",
                "500+ native integrations, zero middleware",
                "SOC 2 Type II certified, GDPR compliant",
                "Global infrastructure — 99.9% uptime SLA",
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-[#aaa]">
                  <div className="w-5 h-5 rounded-full bg-[#b5ff4f]/10 border border-[#b5ff4f]/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#b5ff4f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>

            <a href="#services"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-black bg-[#b5ff4f] hover:bg-[#c8ff6e] transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#b5ff4f]/20">
              Explore Our Services
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
