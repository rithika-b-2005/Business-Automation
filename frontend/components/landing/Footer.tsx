import { Zap, Mail, MapPin, Phone, ArrowRight, Globe } from "lucide-react"

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "Status Page", href: "#" },
  ],
  Solutions: [
    { label: "Sales Automation", href: "#" },
    { label: "Marketing Ops", href: "#" },
    { label: "Finance & Billing", href: "#" },
    { label: "HR & Onboarding", href: "#" },
    { label: "Customer Support", href: "#" },
    { label: "E-Commerce", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press Kit", href: "#" },
    { label: "Partners", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Community Forum", href: "#" },
    { label: "Video Tutorials", href: "#" },
    { label: "Templates Library", href: "#" },
    { label: "Certification", href: "#" },
  ],
}

const socialLinks = [
  { label: "X / Twitter", href: "#", char: "𝕏" },
  { label: "LinkedIn", href: "#", char: "in" },
  { label: "GitHub", href: "#", char: "gh" },
  { label: "YouTube", href: "#", char: "▶" },
]

const certifications = [
  { label: "SOC 2 Type II", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { label: "GDPR Ready", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { label: "HIPAA Compliant", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  { label: "ISO 27001", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5">
      {/* Newsletter bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-white mb-1">Stay ahead of the curve</h3>
              <p className="text-sm text-slate-500">Get weekly automation tips, product updates, and industry insights.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/8 transition-all"
              />
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-semibold flex-shrink-0">
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-14">
          {/* Brand column */}
          <div className="col-span-2">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Nex<span className="gradient-text">Flow</span>
                <span className="text-indigo-400 text-sm font-medium ml-0.5">AI</span>
              </span>
            </a>

            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              The all-in-one business automation platform trusted by 25,000+ companies across 150+ countries.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              {[
                { icon: Mail, text: "hello@nexflow.ai" },
                { icon: Phone, text: "+1 (888) 639-5692" },
                { icon: MapPin, text: "San Francisco, CA · London · Singapore" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                  <Icon className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map(({ label, href, char }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold"
                >
                  {char}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-white/5">
          {certifications.map((cert) => (
            <span key={cert.label} className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${cert.color}`}>
              {cert.label}
            </span>
          ))}
          <span className="text-xs text-slate-600 self-center ml-2">All data encrypted in transit & at rest</span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} NexFlow AI, Inc. All rights reserved. · Registered in Delaware, USA.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security", "Accessibility"].map((link) => (
              <a key={link} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
