// Centralized Framer Motion animation configs

// Viewport config — trigger earlier for a more responsive feel
export const viewport = { once: false, amount: 0.08 as const }

// Durations
export const duration = {
  fast: 0.55,
  base: 0.65,
  slow: 0.85,
}

// Transitions
export const transition = {
  base: { duration: duration.base, ease: [0.22, 1, 0.36, 1] as const },
  slow: { duration: duration.slow, ease: [0.22, 1, 0.36, 1] as const },
  fast: { duration: duration.fast, ease: [0.22, 1, 0.36, 1] as const },
  spring: { type: "spring" as const, stiffness: 260, damping: 22 },
}

// Stagger delay per item (multiply by index)
export const stagger = 0.12

// Fade up — main entry animation
export const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
}

// Fade up — hero (slightly bigger)
export const fadeUpHero = {
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0 },
}

// Scale up — for badges, icons, cards
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1 },
}

// Fade in — simple opacity only
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Slide in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0 },
}

// Slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0 },
}

// Slide in from top
export const slideDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0 },
}
