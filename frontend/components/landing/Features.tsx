"use client"

import { useState } from "react"
import { ArrowUpRight, Brain, Plug, BarChart3, Users, Shield, Globe, GitBranch, Clock, Cpu } from "lucide-react"

const services = [
  { icon: Brain,    title: "AI Workflow Builder",     desc: "Describe automations in plain English — our AI builds them instantly. Zero code, full power." },
  { icon: Plug,     title: "500+ Integrations",       desc: "Salesforce, HubSpot, Slack, Stripe, Shopify and 490+ more. Two-way sync out of the box." },
  { icon: BarChart3, title: "Real-Time Analytics",   desc: "Live dashboards track every automation and outcome. AI-powered optimization insights built in." },
  { icon: Users,    title: "Team Collaboration",      desc: "Multi-user workspaces, role-based permissions, version history, inline comments." },
  { icon: Shield,   title: "Enterprise Security",     desc: "SOC 2 Type II certified. End-to-end encryption, SSO/SAML, audit logs, GDPR compliant." },
  { icon: Globe,    title: "Global Infrastructure",   desc: "99.9% uptime SLA. 12 data-center regions. HIPAA & CCPA ready. Deploy anywhere." },
  { icon: GitBranch, title: "Conditional Logic",      desc: "Multi-branch workflows with if/else, loops, parallel execution — all visual, no code." },
  { icon: Clock,    title: "Smart Scheduling",        desc: "Cron jobs, event triggers, webhooks, or AI-predicted optimal timing for each workflow." },
  { icon: Cpu,      title: "Custom API Actions",      desc: "Connect any REST or GraphQL API visually. Call external services without writing code." },
]

export default function Features() {
  const [active, setActive] = useState(0)

  return (
    <section id="features" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-3">— Our Services</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            We Solve Business Problems
            <br />
            <span className="text-indigo-600">With Automation</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From simple task automation to enterprise-grade orchestration — everything your operations team needs.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                onMouseEnter={() => setActive(i)}
                className={`group relative rounded-2xl p-7 border transition-all duration-300 cursor-default hover:-translate-y-1 ${
                  active === i
                    ? "bg-indigo-600 border-indigo-600 shadow-2xl shadow-indigo-200"
                    : "bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-100"
                }`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-5 transition-colors ${
                  active === i ? "bg-white/15" : "bg-indigo-50"
                }`}>
                  <Icon className={`w-5 h-5 ${active === i ? "text-white" : "text-indigo-600"}`} />
                </div>

                <h3 className={`text-base font-bold mb-3 ${active === i ? "text-white" : "text-slate-900"}`}>
                  {s.title}
                </h3>
                <p className={`text-sm leading-relaxed ${active === i ? "text-indigo-100" : "text-slate-400"}`}>
                  {s.desc}
                </p>

                {/* Arrow */}
                <div className={`absolute top-6 right-6 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  active === i ? "bg-white/20 opacity-100" : "opacity-0 group-hover:opacity-100 bg-indigo-50"
                }`}>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${active === i ? "text-white" : "text-indigo-600"}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-indigo-200">
            Start Automating Today
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
