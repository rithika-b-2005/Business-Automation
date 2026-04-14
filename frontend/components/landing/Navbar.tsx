"use client"

import { useState, useEffect } from "react"
import { Menu, X, Zap } from "lucide-react"

const links = [
  { label: "About",        href: "#about" },
  { label: "Services",     href: "#features" },
  { label: "Integrations", href: "#integrations" },
  { label: "Pricing",      href: "#pricing" },
  { label: "Contact",      href: "#cta" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white border-b border-black/[0.08] shadow-sm"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 lg:h-20 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className={`font-black text-xl tracking-tight transition-colors ${scrolled ? "text-black" : "text-white"}`}>
            Nex<span className={scrolled ? "text-black" : "text-white"}>Flow</span>
            <span className={`text-xs font-medium ml-0.5 ${scrolled ? "text-black/40" : "text-white/50"}`}>AI</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-black relative group ${
                scrolled ? "text-black/60 hover:text-black" : "text-white/70 hover:text-white"
              }`}>
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="#"
            className={`text-sm font-medium transition-colors px-4 py-2 ${
              scrolled ? "text-black/60 hover:text-black" : "text-white/70 hover:text-white"
            }`}>
            Sign In
          </a>
          <a href="#pricing"
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
              scrolled
                ? "bg-black text-white hover:bg-black/85 shadow-md"
                : "bg-white text-black hover:bg-white/90 shadow-lg shadow-black/20"
            }`}>
            Get Started Free
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)}
          className={`lg:hidden p-2 transition-colors ${scrolled ? "text-black" : "text-white"}`}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-black/[0.06] px-5 py-5 flex flex-col gap-1 shadow-xl">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-black/70 hover:text-black text-base font-medium py-3 border-b border-black/[0.05] transition-colors">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 mt-5">
            <a href="#" className="flex-1 text-center py-3 rounded-lg text-sm font-semibold text-black/70 border border-black/10 hover:bg-black/5 transition-colors">
              Sign In
            </a>
            <a href="#pricing" onClick={() => setOpen(false)}
              className="flex-1 text-center py-3 rounded-lg text-sm font-bold text-white bg-black hover:bg-black/85 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
