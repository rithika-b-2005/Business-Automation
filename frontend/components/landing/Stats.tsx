"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { value: 25000, suffix: "+", label: "Businesses Automated", prefix: "" },
  { value: 150,   suffix: "+", label: "Countries Worldwide",  prefix: "" },
  { value: 500,   suffix: "M+", label: "Tasks Executed",     prefix: "" },
  { value: 99.9,  suffix: "%",  label: "Uptime Guaranteed",  prefix: "", decimal: true },
]

function Counter({ end, suffix, prefix, decimal }: { end: number; suffix: string; prefix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 2000
        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(parseFloat((eased * end).toFixed(decimal ? 1 : 0)))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, decimal])

  return (
    <span ref={ref}>
      {prefix}{decimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="bg-[#0a0a0a] py-20 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-white/[0.06] rounded-3xl border border-white/[0.06] overflow-hidden">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-10 px-6 bg-[#141414] hover:bg-[#1a1a1a] transition-colors group">
              <div className="text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-[#b5ff4f] transition-colors duration-300">
                <Counter end={s.value} suffix={s.suffix} prefix={s.prefix} decimal={s.decimal} />
              </div>
              <div className="text-sm text-[#555] text-center">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
