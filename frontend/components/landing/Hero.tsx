"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Rocket, Sparkles } from "lucide-react"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const children = el.querySelectorAll<HTMLElement>(".hero-animate")
    children.forEach((c, i) => {
      c.style.opacity = "0"
      c.style.transform = "translateY(28px)"
      setTimeout(() => {
        c.style.transition = "opacity 0.7s ease, transform 0.7s ease"
        c.style.opacity = "1"
        c.style.transform = "translateY(0)"
      }, 120 * i)
    })
  }, [])

  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* ── Deep navy → blue → purple gradient background ── */}
      <div className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(120deg, #04082e 0%, #0d1580 35%, #2d2fb5 60%, #5b21b6 100%)",
        }}
      />

      {/* Radial glow overlays for depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(29,53,173,0.5) 0%, transparent 70%)" }} />
      </div>

      {/* Dot grid texture */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Floating decorative dots / shapes ── */}
      <div className="absolute top-28 left-[8%] w-3 h-3 rounded-full bg-blue-400/50 animate-pulse z-10" />
      <div className="absolute top-48 left-[14%] w-2 h-2 rounded-full bg-purple-400/50 animate-pulse z-10" style={{ animationDelay: "0.5s" }} />
      <div className="absolute top-36 right-[38%] w-4 h-4 rounded-full bg-indigo-300/30 animate-bounce z-10" style={{ animationDelay: "0.3s" }} />
      <div className="absolute bottom-36 left-[20%] w-2 h-2 rounded-full bg-violet-400/60 animate-pulse z-10" style={{ animationDelay: "1s" }} />

      {/* Rocket icon decoration */}
      <div className="absolute top-44 left-[42%] text-blue-300/40 rotate-45 z-10 animate-bounce" style={{ animationDelay: "0.8s" }}>
        <Rocket className="w-7 h-7" />
      </div>

      {/* Sparkle icon decoration */}
      <div className="absolute bottom-48 right-[44%] text-violet-300/40 z-10 animate-pulse" style={{ animationDelay: "1.2s" }}>
        <Sparkles className="w-6 h-6" />
      </div>

      {/* ── Main content ── */}
      <div ref={heroRef} className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 w-full pt-28 pb-52 lg:pb-60">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-0 items-center">

            {/* LEFT — copy */}
            <div className="max-w-xl">
              {/* Tag */}
              <div className="hero-animate inline-flex items-center gap-2 mb-6">
                <div className="w-8 h-px bg-blue-400/60" />
                <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">
                  Best Automation Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-animate text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                Automate Your
                <br />
                Business &amp;
                <br />
                <span className="text-transparent"
                  style={{ WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}>
                  Scale Faster.
                </span>
              </h1>

              {/* Description */}
              <p className="hero-animate text-blue-100/70 text-base sm:text-lg leading-relaxed mb-10 max-w-md">
                Connect your entire stack, automate repetitive workflows with AI,
                and free your team to focus on growth — not grunt work.
                No code required. Live in minutes.
              </p>

              {/* CTA buttons */}
              <div className="hero-animate flex flex-col sm:flex-row gap-4">
                <a href="#pricing"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    boxShadow: "0 8px 32px rgba(99,102,241,0.45)",
                  }}>
                  Explore More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#cta"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg text-base font-bold text-white border border-white/25 hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm">
                  Contact Us
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* RIGHT — professional photo + floating badges */}
            <div className="relative flex justify-center lg:justify-end lg:-mr-10">
              {/* Simulated professional photo — blended with bg */}
              <div className="relative w-full max-w-lg">
                {/* Photo frame */}
                <div className="relative rounded-2xl overflow-hidden aspect-[5/4] shadow-2xl"
                  style={{
                    background: "linear-gradient(135deg, #1e3a8a 0%, #4338ca 50%, #6d28d9 100%)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 0 60px rgba(99,102,241,0.2)",
                  }}>
                  {/* Inner glow */}
                  <div className="absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse at 30% 40%, rgba(129,140,248,0.25) 0%, transparent 60%)",
                    }} />

                  {/* Abstract team/business visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Person silhouettes */}
                      <div className="absolute inset-0 flex items-end justify-center gap-4 px-8 pb-0">
                        {/* Large person shape */}
                        <div className="relative flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-indigo-300/60 to-indigo-500/40 border-2 border-white/20 mb-1" />
                          <div className="w-28 h-40 rounded-t-3xl bg-gradient-to-b from-indigo-400/30 to-indigo-600/20 border-t-2 border-x-2 border-white/10" />
                        </div>
                        {/* Medium person shape */}
                        <div className="relative flex flex-col items-center mb-0">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-b from-violet-300/60 to-violet-500/40 border-2 border-white/20 mb-1" />
                          <div className="w-24 h-32 rounded-t-3xl bg-gradient-to-b from-violet-400/30 to-violet-600/20 border-t-2 border-x-2 border-white/10" />
                        </div>
                      </div>

                      {/* Floating UI elements on image */}
                      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 text-xs text-white">
                        <div className="font-bold text-green-300 text-base">+38%</div>
                        <div className="text-white/60 text-[10px]">Productivity up</div>
                      </div>

                      <div className="absolute bottom-6 left-6 bg-indigo-600/60 backdrop-blur-md border border-indigo-400/30 rounded-xl p-3 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-white font-bold text-[11px]">Live Automation</span>
                        </div>
                        <div className="text-white/50 text-[10px]">342 tasks running</div>
                      </div>
                    </div>
                  </div>

                  {/* Blue tint overlay to blend with bg */}
                  <div className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to left, transparent 50%, rgba(13,21,128,0.5) 100%)",
                    }} />
                </div>

                {/* Floating badge — top left */}
                <div className="absolute -top-5 -left-5 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-indigo-900/40">
                  <div className="text-[10px] text-gray-400 mb-1 font-medium">Hours Saved / Month</div>
                  <div className="text-xl font-extrabold text-indigo-700">1,240 hrs</div>
                </div>

                {/* Floating badge — bottom right */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-indigo-900/40">
                  <div className="text-[10px] text-gray-400 mb-1 font-medium">Tasks Automated</div>
                  <div className="text-xl font-extrabold text-violet-700">24.7K</div>
                  <div className="text-[10px] text-green-500 font-bold">↑ 38% this month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── White wave at bottom — shifted up ── */}
      <div className="absolute z-20 inset-x-0" style={{ bottom: "60px" }}>
        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg"
          className="w-full" preserveAspectRatio="none" style={{ display: "block" }}>
          <path
            d="M0,40 C180,90 360,0 540,45 C720,90 900,10 1080,50 C1260,90 1380,30 1440,40 L1440,90 L0,90 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
