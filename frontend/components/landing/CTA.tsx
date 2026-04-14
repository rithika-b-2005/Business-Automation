import { ArrowRight, CheckCircle } from "lucide-react"

const benefits = [
  "14-day free trial",
  "No credit card required",
  "Setup in under 10 minutes",
  "Cancel any time",
]

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-slate-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Join 25,000+ businesses already automating with NexFlow AI
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-6">
          Ready to automate
          <br />
          <span className="gradient-text">your business?</span>
        </h2>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Stop wasting time on repetitive tasks. Start your free trial today and
          see why thousands of operations teams choose NexFlow AI to scale smarter.
        </p>

        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 w-full sm:w-auto justify-center"
          >
            Start Your Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white glass-dark hover:bg-white/10 border border-white/10 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            Talk to Sales
          </a>
        </div>

        {/* Small print */}
        <p className="text-slate-600 text-xs mt-8">
          By starting a trial, you agree to our{" "}
          <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Privacy Policy</a>.
        </p>

        {/* Decorative cards */}
        <div className="mt-16 grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto opacity-30 pointer-events-none select-none">
          {["CRM Sync", "Lead Routing", "Invoicing", "Reporting", "Onboarding", "Support"].map((label) => (
            <div key={label} className="glass-dark rounded-xl py-2.5 px-2 text-xs text-slate-300 text-center border border-white/5">
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
