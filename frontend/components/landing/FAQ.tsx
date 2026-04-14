"use client"

import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How is NexFlow AI different from Zapier or Make.com?",
    answer:
      "NexFlow AI combines visual automation with a native AI engine — you can describe any workflow in plain English and our AI builds it for you in seconds. Unlike Zapier or Make, we offer enterprise-grade features (SSO, audit logs, SOC 2) on every plan, unlimited branching logic with no extra cost, and a transparent per-workflow pricing model rather than per-task fees that balloon as you scale.",
  },
  {
    question: "Do I need any technical skills or coding knowledge?",
    answer:
      "Not at all. NexFlow AI is built for business teams, not engineers. Our visual drag-and-drop builder and AI assistant mean anyone can create powerful automations. If you do have technical skills, our custom API actions, webhooks, and JavaScript code steps give you unlimited flexibility.",
  },
  {
    question: "Which integrations are available right now?",
    answer:
      "We currently offer 500+ native integrations across CRM (Salesforce, HubSpot, Pipedrive), payments (Stripe, PayPal, Square), communications (Slack, Gmail, Outlook, Twilio), project management (Jira, Asana, Monday.com, Notion), eCommerce (Shopify, WooCommerce), and many more. We also support any REST API, GraphQL endpoint, or webhook — so you can connect virtually any tool.",
  },
  {
    question: "Is my company's data safe and compliant?",
    answer:
      "Absolutely. NexFlow AI is SOC 2 Type II certified, GDPR compliant, and CCPA compliant. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We offer EU data residency, HIPAA-compliant infrastructure for healthcare clients, and full audit logging on Enterprise plans. We never sell or share your data with third parties.",
  },
  {
    question: "Can I try NexFlow AI before paying?",
    answer:
      "Yes — every plan comes with a 14-day free trial with no credit card required. You get full access to all features of your chosen plan during the trial. If you don't love it, just cancel before day 14 and you won't be charged anything.",
  },
  {
    question: "What happens if I exceed my automation run limit?",
    answer:
      "We'll notify you when you approach your limit and won't abruptly stop your automations. On Starter and Growth plans, you can purchase additional run packs or upgrade at any time. On Enterprise, you have unlimited runs with no overage charges.",
  },
  {
    question: "Can I use NexFlow AI with a team? How does collaboration work?",
    answer:
      "NexFlow AI is built for teams. You can invite members, assign role-based permissions (admin, editor, viewer), share workflows across the workspace, leave inline comments, and track changes with version history. Enterprise plans include SSO/SAML for centralized identity management and SCIM for automated user provisioning.",
  },
  {
    question: "Do you offer support and onboarding assistance?",
    answer:
      "All plans include access to our documentation, video tutorials, and community forum. Growth plans get priority email and chat support with a 4-hour SLA. Enterprise clients receive a dedicated Customer Success Manager, personalized onboarding, quarterly business reviews, and 24/7 phone support.",
  },
  {
    question: "Can NexFlow AI handle high-volume, enterprise-grade workloads?",
    answer:
      "Yes. Our infrastructure is built on multi-region cloud architecture with auto-scaling capabilities, handling billions of automation runs per month globally. We maintain a 99.9% uptime SLA (99.99% for Enterprise) and have processed workflows for clients running millions of tasks per day without disruption.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 lg:py-32 bg-white relative">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            Got questions?
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            Frequently asked
            <br />
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-slate-500">
            Everything you need to know about NexFlow AI.
            Can&apos;t find an answer?{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 transition-colors">
              Chat with our team
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-indigo-200 shadow-md shadow-indigo-50"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`text-sm sm:text-base font-semibold transition-colors ${isOpen ? "text-indigo-700" : "text-slate-800 hover:text-slate-900"}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-indigo-100" : "bg-slate-100"}`}>
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="w-full h-px bg-indigo-100 mb-5" />
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
