const items = [
  "Automate", "✦", "Scale", "✦", "Optimize", "✦",
  "Integrate", "✦", "Innovate", "✦", "Grow", "✦",
  "Automate", "✦", "Scale", "✦", "Optimize", "✦",
  "Integrate", "✦", "Innovate", "✦", "Grow", "✦",
]

interface MarqueeStripProps {
  reverse?: boolean
  accent?: boolean
}

export default function MarqueeStrip({ reverse = false, accent = false }: MarqueeStripProps) {
  return (
    <div className={`py-5 overflow-hidden border-y ${accent ? "bg-[#b5ff4f] border-[#b5ff4f]" : "bg-[#141414] border-white/[0.06]"}`}>
      <div className={`flex gap-8 w-max ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-sm font-black uppercase tracking-widest whitespace-nowrap ${
              accent
                ? item === "✦" ? "text-black/30" : "text-black"
                : item === "✦" ? "text-[#b5ff4f]" : "text-white/60"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
