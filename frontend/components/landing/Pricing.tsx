"use client"

import { useState } from "react"
import { Check, ArrowRight, Zap, Building2, Rocket } from "lucide-react"

const plans = [
  {
    name: "Starter",
    icon: Rocket,
    description: "Perfect for small teams ready to automate their first workflows.",
    monthlyPrice: 29,
    annualPrice: 19,
    color: "from-slate-600 to-slate-700",
    border: "border-slate-200",
    buttonClass: "bg-slate-900 text-white hover:bg-slate-800",
    features: [
      "Up to 5 users",
      "1,000 automation runs / month",
      "50+ integrations",
      "Visual workflow builder",
      "Email & chat support",
      "5 active workflows",
      "Basic analytics",
      "Community access",
    ],
    notIncluded: ["AI workflow generation", "Custom API actions", "SSO / SAML", "SLA guarantee"],
  },
  {
    name: "Growth",
    icon: Zap,
    description: "For scaling teams that need more power, more integrations, and AI.",
    monthlyPrice: 99,
    annualPrice: 69,
    color: "from-indigo-600 to-violet-600",
    border: "border-indigo-300",
    buttonClass: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-200",
    popular: true,
    features: [
      "Up to 25 users",
      "25,000 automation runs / month",
      "500+ integrations",
      "AI workflow generation",
      "Conditional logic & branching",
      "Custom API actions",
      "Priority support (4h SLA)",
      "Advanced analytics & reporting",
      "Unlimited active workflows",
      "Version history (30 days)",
      "Webhook triggers",
      "Team collaboration tools",
    ],
    notIncluded: ["SSO / SAML", "Custom SLA", "Dedicated account manager"],
  },
  {
    name: "Enterprise",
    icon: Building2,
    description: "For large organizations with complex needs, compliance, and global scale.",
    monthlyPrice: null,
    annualPrice: null,
    color: "from-slate-800 to-slate-900",
    border: "border-slate-200",
    buttonClass: "bg-slate-900 text-white hover:bg-slate-800",
    features: [
      "Unlimited users",
      "Unlimited automation runs",
      "All 500+ integrations",
      "AI workflow generation",
      "SSO / SAML / SCIM",
      "Custom SLA (99.99% uptime)",
      "Dedicated account manager",
      "24/7 phone & email support",
      "Custom API rate limits",
      "On-premise deployment option",
      "HIPAA / GDPR compliance pack",
      "Audit logs & governance tools",
      "Custom data retention policies",
      "White-label options",
    ],
    notIncluded: [],
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Simple, transparent pricing
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Start free. Scale as
            <br />
            <span className="gradient-text">your business grows.</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            All plans include a 14-day free trial. No credit card required.
            Cancel or change plans any time.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-white text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white text-slate-900" : "text-slate-400 hover:text-slate-200"}`}
            >
              Annual
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-bold">Save 30%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border ${plan.border} ${
                  plan.popular
                    ? "bg-white shadow-2xl shadow-indigo-100 scale-[1.02] lg:scale-105"
                    : "bg-white/3 hover:bg-white/5 transition-colors"
                } overflow-hidden`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
                )}
                {plan.popular && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${plan.popular ? "text-slate-900" : "text-white"}`}>{plan.name}</h3>
                    </div>
                  </div>

                  <p className={`text-sm mb-6 ${plan.popular ? "text-slate-500" : "text-slate-400"}`}>{plan.description}</p>

                  {/* Price */}
                  <div className="mb-7">
                    {price !== null ? (
                      <div className="flex items-end gap-2">
                        <span className={`text-5xl font-black ${plan.popular ? "text-slate-900" : "text-white"}`}>
                          ${price}
                        </span>
                        <span className={`text-sm pb-2 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>/mo</span>
                        {annual && (
                          <span className="text-xs text-slate-400 pb-2">billed annually</span>
                        )}
                      </div>
                    ) : (
                      <div className={`text-3xl font-black ${plan.popular ? "text-slate-900" : "text-white"}`}>
                        Custom pricing
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href="#"
                    className={`w-full py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 text-center mb-7 hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 ${plan.buttonClass}`}
                  >
                    {price !== null ? "Start Free Trial" : "Contact Sales"}
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* Divider */}
                  <div className={`border-t ${plan.popular ? "border-slate-100" : "border-white/10"} mb-6`} />

                  {/* Features */}
                  <div className="flex-1">
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                      What&apos;s included
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? "bg-indigo-100" : "bg-indigo-500/20"}`}>
                            <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-indigo-600" : "text-indigo-400"}`} strokeWidth={3} />
                          </div>
                          <span className={plan.popular ? "text-slate-600" : "text-slate-400"}>{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm opacity-40">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5">
                            <div className="w-1.5 h-0.5 bg-slate-500 rounded-full" />
                          </div>
                          <span className="text-slate-500 line-through">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-slate-400 text-sm">
            All plans include 14-day free trial · No credit card required ·{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2">
              Compare all features
            </a>
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Need a custom plan for a large organization?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Talk to our sales team →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
