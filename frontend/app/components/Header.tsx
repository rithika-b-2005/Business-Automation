"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV = [
  { label: "About",        href: "#about",        id: "about"        },
  { label: "Services",     href: "#services",     id: "services"     },
  { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
  { label: "Careers",      href: "#careers",      id: "careers"      },
  { label: "Testimonials", href: "#testimonials", id: "testimonials" },
  { label: "FAQ",          href: "#faq",          id: "faq"          },
]

const AGENT_PATHS = ["/workflow", "/leads", "/marketing", "/sales"]

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const pathname = usePathname()

    const hideNav = pathname === "/" || pathname === "/register"
    const isAgentPage = AGENT_PATHS.some(p => pathname === p || pathname.startsWith(p))

    useEffect(() => {
        const loggedInPaths = ["/landing", "/contact", "/explore", "/careers", "/careers/apply", "/demo", ...AGENT_PATHS]
        setIsLoggedIn(loggedInPaths.some(p => pathname === p || pathname.startsWith(p)))
    }, [pathname])

    // Track active section via IntersectionObserver
    useEffect(() => {
        if (hideNav) return
        const observers: IntersectionObserver[] = []
        NAV.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id)
                },
                { threshold: 0.25, rootMargin: "-64px 0px -55% 0px" }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach(o => o.disconnect())
    }, [hideNav])

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" })
        window.location.href = "/"
    }

    return (
        <motion.header
            initial={{ y: -72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black/[0.06]"
        >

            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

                {/* Logo */}
                <Link href={isLoggedIn ? "/landing" : "/"} className="flex items-center gap-2.5 shrink-0">
                    <img src="/img/logo.png" alt="Tec Tha" width={36} height={36} className="rounded-full" />
                    <span className="text-lg font-semibold tracking-tight text-black">Tec Tha</span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
                    {!hideNav && NAV.map(({ label, href, id }) => {
                        const isActive = activeSection === id
                        return (
                            <a key={label} href={href} className="relative">
                                <Button
                                    variant="ghost"
                                    className={`relative text-sm rounded-full px-4 transition-colors duration-200 ${
                                        isActive
                                            ? "text-[#276ef1] bg-[#eff6ff] hover:bg-[#eff6ff]"
                                            : "text-black/60 hover:text-black hover:bg-black/5"
                                    }`}
                                >
                                    {label}
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute bottom-1.5 left-4 right-4 h-[2px] rounded-full bg-[#276ef1]"
                                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                </Button>
                            </a>
                        )
                    })}
                </nav>

                {/* Right CTAs */}
                <div className="hidden md:flex items-center gap-2.5 shrink-0">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    ) : pathname === "/register" ? (
                        <Link href="/"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all">
                            <LogIn className="w-3.5 h-3.5" />
                            Log In
                        </Link>
                    ) : pathname === "/" ? (
                        <Link href="/register"
                            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                            style={{ background: "#276ef1" }}>
                            <UserPlus className="w-3.5 h-3.5" />
                            Register
                        </Link>
                    ) : (
                        <>
                            <Link href="/"
                                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:border-gray-400 hover:text-gray-900 transition-all">
                                <LogIn className="w-3.5 h-3.5" />
                                Log In
                            </Link>
                            <Link href="/register"
                                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                                style={{ background: "#276ef1" }}>
                                <UserPlus className="w-3.5 h-3.5" />
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden bg-white border-t border-black/[0.06] px-6 py-4 flex flex-col gap-1"
                >
                    {!hideNav && NAV.map(({ label, href, id }) => (
                        <a key={label} href={href} onClick={() => setMobileOpen(false)}>
                            <Button
                                variant="ghost"
                                className={`w-full justify-start rounded-xl transition-colors ${
                                    activeSection === id
                                        ? "text-[#276ef1] bg-[#eff6ff]"
                                        : "text-black/60 hover:text-black"
                                }`}
                            >
                                {label}
                            </Button>
                        </a>
                    ))}
                    <div className="flex gap-2 pt-3">
                        {isLoggedIn ? (
                            <button
                                onClick={() => { setMobileOpen(false); handleLogout() }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Logout
                            </button>
                        ) : pathname === "/register" ? (
                            <Link href="/" onClick={() => setMobileOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                                <LogIn className="w-3.5 h-3.5" />
                                Log In
                            </Link>
                        ) : pathname === "/" ? (
                            <Link href="/register" onClick={() => setMobileOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white"
                                style={{ background: "#276ef1" }}>
                                <UserPlus className="w-3.5 h-3.5" />
                                Register
                            </Link>
                        ) : (
                            <>
                                <Link href="/" onClick={() => setMobileOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                                    <LogIn className="w-3.5 h-3.5" />
                                    Log In
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold text-white"
                                    style={{ background: "#276ef1" }}>
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.header>
    )
}
