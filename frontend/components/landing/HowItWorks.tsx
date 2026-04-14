import { MousePointerClick, Plug, Rocket } from "lucide-react"

const steps = [
  { num: "01", icon: MousePointerClick, title: "Create a Service",     desc: "Connect your apps in seconds. NexFlow detects your stack and suggests the best automations." },
  { num: "02", icon: Plug,             title: "Request a Meeting",     desc: "Our AI designs the perfect workflow for you — or use the drag-and-drop builder yourself." },
  { num: "03", icon: Rocket,           title: "Process Monitoring",    desc: "Monitor all automations in real time. Get AI insights and scale without touching a server." },
  { num: "04", icon: Rocket,           title: "Final Delivery",        desc: "Your workflows go live instantly. Track ROI from day one with live performance dashboards." },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-3">— How We Work</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
            Standard Work Process
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            From sign-up to live automation in under 10 minutes. No engineers needed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.num} className="relative group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%-1rem)] w-8 h-px bg-indigo-200 z-10" />
                )}

                <div className="bg-white rounded-2xl p-7 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1 h-full">
                  {/* Number + Icon */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-4xl font-black text-slate-100 leading-none">{step.num}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Blue CTA banner — matching Infotek "Stay Connected With Cutting-Edge IT" */}
        <div className="mt-16 rounded-3xl overflow-hidden relative"
          style={{ background: "linear-gradient(120deg, #04082e 0%, #0d1580 40%, #4338ca 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }} />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-10">
            <div>
              <p className="text-indigo-300 text-sm font-semibold mb-2">📞 +1 (888) 639-5692</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Stay Connected With
                <br />
                Cutting-Edge Automation
              </h3>
            </div>
            <a href="#pricing"
              className="flex-shrink-0 px-8 py-4 rounded-xl text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-200 hover:-translate-y-0.5 shadow-xl whitespace-nowrap">
              Get a Demo →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
