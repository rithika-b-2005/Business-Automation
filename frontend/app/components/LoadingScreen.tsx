"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

function Girl() {
  return (
    <svg viewBox="0 0 180 320" width="180" height="320" xmlns="http://www.w3.org/2000/svg">

      {/* Hair back layer */}
      <ellipse cx="90" cy="72" rx="44" ry="50" fill="#3b1f00" />

      {/* Head */}
      <circle cx="90" cy="78" r="36" fill="#f9c9a0" />

      {/* Hair top/front */}
      <path d="M54 68 Q56 36 90 33 Q124 36 126 68 Q112 54 90 56 Q68 54 54 68Z" fill="#5c2d00" />

      {/* Left hair drape */}
      <path d="M54 72 Q40 110 46 160" stroke="#3b1f00" strokeWidth="20" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      <ellipse cx="78" cy="78" rx="5" ry="5.5" fill="#2a2a2a" />
      <ellipse cx="102" cy="78" rx="5" ry="5.5" fill="#2a2a2a" />
      {/* Eye shine */}
      <circle cx="80" cy="75.5" r="2" fill="white" />
      <circle cx="104" cy="75.5" r="2" fill="white" />

      {/* Blush */}
      <ellipse cx="68" cy="88" rx="8" ry="5" fill="#f0a0a0" opacity="0.45" />
      <ellipse cx="112" cy="88" rx="8" ry="5" fill="#f0a0a0" opacity="0.45" />

      {/* Smile */}
      <path d="M80 93 Q90 103 100 93" stroke="#d07070" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Neck */}
      <rect x="80" y="111" width="20" height="16" rx="5" fill="#f9c9a0" />

      {/* Body / dress */}
      <path d="M58 126 Q90 116 122 126 L134 240 L46 240 Z" fill="#276ef1" />

      {/* Dress neckline detail */}
      <path d="M76 126 Q90 138 104 126" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />

      {/* Dress waist belt */}
      <rect x="52" y="168" width="76" height="10" rx="5" fill="#1a56db" />

      {/* Left arm (relaxed) */}
      <path d="M62 132 Q44 165 48 198" stroke="#f9c9a0" strokeWidth="15" fill="none" strokeLinecap="round" />
      <circle cx="48" cy="200" r="10" fill="#f9c9a0" />

      {/* Right arm (waving) — wrapped in motion group */}
      <motion.g
        style={{ originX: "118px", originY: "132px" }}
        animate={{ rotate: [0, -22, 8, -22, 8, -22, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <path d="M118 132 Q138 118 152 92" stroke="#f9c9a0" strokeWidth="15" fill="none" strokeLinecap="round" />
        <circle cx="153" cy="86" r="12" fill="#f9c9a0" />
        {/* Fingers */}
        <path d="M146 76 Q148 68 154 72" stroke="#f9c9a0" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M151 74 Q153 66 159 70" stroke="#f9c9a0" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M156 76 Q159 69 164 74" stroke="#f9c9a0" strokeWidth="5" fill="none" strokeLinecap="round" />
      </motion.g>

      {/* Legs */}
      <path d="M76 238 Q72 268 70 300" stroke="#1a3a8f" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M104 238 Q108 268 110 300" stroke="#1a3a8f" strokeWidth="18" strokeLinecap="round" fill="none" />

      {/* Shoes */}
      <ellipse cx="68" cy="303" rx="16" ry="8" fill="#1a1a2e" />
      <ellipse cx="112" cy="303" rx="16" ry="8" fill="#1a1a2e" />

    </svg>
  )
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        // Accelerate near end
        const step = p < 70 ? 2.5 : p < 90 ? 1.5 : 0.8
        return Math.min(p + step, 100)
      })
    }, 35)

    const hideTimer = setTimeout(() => setVisible(false), 2600)
    return () => { clearInterval(interval); clearTimeout(hideTimer) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#f7f9ff" }}
        >
          {/* Subtle grid (matches Banner) */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#20262D 1px, transparent 1px), linear-gradient(90deg, #20262D 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Girl walks in from right */}
          <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mb-4"
          >
            {/* Subtle shadow under feet */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full opacity-20"
              style={{ background: "#276ef1", filter: "blur(8px)" }}
            />
            <Girl />
          </motion.div>

          {/* Brand + message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-2 mt-2"
          >
            <p className="text-xl font-semibold tracking-tight text-[#1a2233]">
              Tec Tha
            </p>
            <p className="text-sm text-[#7a8899]">Setting up your experience…</p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 mt-6 w-48 h-1 rounded-full bg-[#e8edf5] overflow-hidden"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#276ef1", width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
