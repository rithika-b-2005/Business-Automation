"use client"

import { useEffect, useState } from "react"
import Header from "@/app/components/Header"
import { motion } from "framer-motion"
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { Zap, Users, DollarSign } from "lucide-react"
import { fadeUp, transition, viewport } from "@/lib/animations"

const COLOR = "#475569"

const PRODUCTS = [
  {
    icon: Zap,
    name: "FlowBot",
    tag: "Workflow Automation",
    badge: "Most Popular",
    desc: "Automate repetitive tasks across your entire organisation with zero code. Build powerful workflows using drag-and-drop in minutes.",
    features: ["Visual workflow builder", "200+ app integrations", "Conditional logic & branching", "Real-time execution logs"],
  },
  {
    icon: Users,
    name: "SalesPulse",
    tag: "CRM & Sales",
    badge: "New",
    desc: "Manage your entire sales pipeline in one place. Track leads, automate follow-ups, and close deals faster with AI-powered insights.",
    features: ["Lead scoring & tracking", "Automated follow-up sequences", "Pipeline analytics", "Email & call integration"],
  },
  {
    icon: DollarSign,
    name: "FinanceFlow",
    tag: "Finance & Billing",
    badge: "Popular",
    desc: "Streamline invoicing, expense tracking, and financial reporting. Get real-time visibility into your company's financial health.",
    features: ["Automated invoicing", "Expense management", "Revenue dashboards", "Multi-currency support"],
  },
]

type Product = typeof PRODUCTS[0]

export default function ExplorePage() {
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => { window.location.href = "/landing" }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])


  return (
    <div className="min-h-screen" style={{ background: "#f3f4f6" }}>
      <Header />

      {/* ── Back button ── */}
      <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <button
          onClick={() => window.location.href = "/landing"}
          className="flex items-center gap-1.5 text-sm text-[#7a8899] hover:text-[#276ef1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="pt-6 pb-10 px-4 sm:px-6 text-center" style={{ background: "#f3f4f6" }}>
        <div className="max-w-xl mx-auto">
          <motion.h1
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.1 }}
            className="text-3xl font-normal leading-[1.15] tracking-tight text-black mb-3"
          >
            Explore Our Products
          </motion.h1>
          <motion.p
            initial={fadeUp.hidden} animate={fadeUp.visible}
            transition={{ ...transition.base, delay: 0.2 }}
            className="text-sm text-[#7a8899] leading-relaxed"
          >
            One platform. Powerful products. Built to automate, connect, and scale every part of your business — no coding required.
          </motion.p>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="px-4 sm:px-6 pb-8 sm:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PRODUCTS.map((product, i) => {
              const Icon = product.icon
              return (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: false, amount: 0.08 }}
                  className="bg-white border border-[#e8edf5] rounded-2xl p-6 hover:shadow-md hover:border-[#276ef1]/20 transition-all group flex flex-col shadow-sm"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${COLOR}12` }}>
                        <Icon className="w-5 h-5" style={{ color: COLOR }} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.tag}</p>
                      </div>
                    </div>
                    {product.badge && (
                      <Badge variant="outline" className="text-xs rounded-full px-2.5 shrink-0 bg-gray-100 text-gray-500 border-gray-200">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.desc}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {product.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: COLOR }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-4 sm:px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={fadeUp.hidden} whileInView={fadeUp.visible}
            transition={transition.slow} viewport={viewport}
            className="bg-white border border-[#e8edf5] rounded-2xl px-6 py-6 sm:px-8 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-sm"
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">Not sure where to start?</h2>
              <p className="text-sm text-[#7a8899]">Book a free demo and our team will walk you through the right products for your business.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button asChild className="rounded-xl font-semibold px-5 h-10 text-white gap-2 text-sm w-full sm:w-auto" style={{ background: "#276ef1" }}>
                <Link href="/demo">Book a Free Demo <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl px-5 h-10 border-[#e8edf5] text-gray-700 hover:border-[#276ef1]/30 text-sm w-full sm:w-auto">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Product Dialog ── */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg w-[calc(100%-2rem)] sm:w-full rounded-2xl p-0 overflow-hidden [&>button]:outline-none [&>button]:ring-0 [&>button]:shadow-none" style={{ maxHeight: "88vh" }}>
          {selected && (
            <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ maxHeight: "88vh" }}>
              <div className="px-7 py-6">
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-1">{selected.name}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 leading-relaxed mb-5">{selected.desc}</DialogDescription>
                <ul className="flex flex-col gap-3 mb-6">
                  {selected.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#276ef1]" />
                      <span className="text-sm text-gray-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full rounded-xl font-semibold text-white text-sm" style={{ background: "#276ef1" }} asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
