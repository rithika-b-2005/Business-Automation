"use client"

import { Mail, Phone } from "lucide-react"

const NAV = [
  {
    title: "Platform",
    links: ["Workflow Automation", "Integrations", "AI Automation", "Analytics", "Pricing"],
  },
  {
    title: "Use Cases",
    links: ["HR Automation", "Finance Automation", "Sales Automation", "Operations"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact", "Careers", "Privacy", "Terms"],
  },
]

function IconX({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
}
function IconInstagram({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
}
function IconLinkedin({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
}
function IconFacebook({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
}

const socials = [
  { icon: IconFacebook,  label: "Facebook"  },
  { icon: IconX,         label: "Twitter"   },
  { icon: IconInstagram, label: "Instagram" },
  { icon: IconLinkedin,  label: "LinkedIn"  },
]

export default function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #0a1628 0%, #0d2257 55%, #1a3a8f 100%)" }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 py-16 border-b border-white/[0.08]">

          {/* Brand col — spans 2 */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <p className="text-3xl font-normal text-white mb-3">Tec Tha</p>
              <p className="text-base text-white/40 leading-relaxed">
                Automate everything. Scale without limits.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <a href="mailto:tecthaofficial@gmail.com" className="flex items-center gap-2 text-lg text-white hover:text-white/80 transition-colors">
                <Mail className="w-5 h-5 shrink-0" />
                tecthaofficial@gmail.com
              </a>
              <a href="tel:+918807412810" className="flex items-center gap-2 text-lg text-white hover:text-white/80 transition-colors">
                <Phone className="w-5 h-5 shrink-0" />
                +91 88074 12810
              </a>
            </div>

            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center text-white/40 hover:text-white">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols — no navigation */}
          {NAV.map(({ title, links }) => (
            <div key={title}>
              <p className="text-base font-semibold uppercase tracking-[0.15em] text-white/70 mb-5">{title}</p>
              <ul className="flex flex-col gap-3">
                {links.map((label) => (
                  <li key={label}>
                    <span className="text-base text-white/40 cursor-default">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6">
          <p className="text-[11px] text-white/25">© 2025 Tec Tha. All rights reserved</p>
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <span key={item} className="text-[11px] text-white/25">{item}</span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
