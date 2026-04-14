"use client"

import { motion } from "framer-motion"
import { fadeIn, scaleUp, transition, viewport } from "@/lib/animations"

const BRANDS = [
  { title: "Rolex",      img: "/img/client/rolex.png" },
  { title: "Citi",       img: "/img/client/citi.png" },
  { title: "Dell",       img: "/img/client/dell.png" },
  { title: "Nissan",     img: "/img/client/nissan.png" },
  { title: "Hyundai",    img: "/img/client/hundai.png" },
  { title: "Red Bull",   img: "/img/client/redbull.png" },
  { title: "Philips",    img: "/img/client/philips.png" },
  { title: "John Deere", img: "/img/client/john-deere.png" },
]

const LOOP = [...BRANDS, ...BRANDS]

export default function Client() {
  return (
    <div className="bg-white pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Label with dividers */}
        <motion.div
          initial={scaleUp.hidden} whileInView={scaleUp.visible}
          transition={transition.base} viewport={viewport}
          className="flex items-center gap-4 mb-8"
        >
          <div className="flex-1 h-px bg-gray-200" />
          <p className="text-sm font-semibold text-black tracking-widest uppercase whitespace-nowrap">
            1k+ Brands Trust Us
          </p>
          <div className="flex-1 h-px bg-gray-200" />
        </motion.div>

        {/* Marquee */}
        <motion.div
          initial={fadeIn.hidden} whileInView={fadeIn.visible}
          transition={{ ...transition.base, delay: 0.2 }} viewport={viewport}
          className="overflow-hidden relative"
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, white, transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, white, transparent)" }} />

          <div
            className="flex items-center gap-6 w-max"
            style={{ animation: "marquee 28s linear infinite" }}
          >
            {LOOP.map((brand, i) => {
              const isHighlight = i === 4 || i === 4 + BRANDS.length
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center h-20 px-6 bg-white border border-gray-100 rounded-xl shadow-sm transition-all ${
                    isHighlight ? "opacity-100 border-[#1a56db]/30 shadow-md" : "opacity-80 hover:opacity-100 hover:shadow-md"
                  }`}
                >
                  <img
                    src={brand.img}
                    alt={brand.title}
                    className="h-16 object-contain"
                  />
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
