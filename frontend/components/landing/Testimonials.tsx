import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "NexFlow AI eliminated over 15 hours of manual data entry per week across our operations team. Our people are now focused on strategy, not spreadsheets. The ROI in the first month was undeniable.",
    name: "Sarah Chen",
    title: "VP of Operations",
    company: "QuantumTech Corp",
    companySize: "850 employees",
    avatar: "SC",
    avatarColor: "from-indigo-500 to-violet-500",
    result: "15 hrs/week saved",
    resultColor: "text-indigo-400",
  },
  {
    quote:
      "We automated our entire lead qualification and CRM update process. Sales closed 42% more deals in Q3 because reps stopped doing admin work and started actually selling. It's transformative.",
    name: "Marcus Williams",
    title: "Head of Revenue",
    company: "Meridian Global",
    companySize: "1,200 employees",
    avatar: "MW",
    avatarColor: "from-emerald-500 to-teal-500",
    result: "+42% deals closed",
    resultColor: "text-emerald-400",
  },
  {
    quote:
      "As a COO managing cross-border operations, NexFlow AI's global compliance and multi-region deployment was a game-changer. We scaled from 3 automations to 50+ without a single new hire.",
    name: "Priya Sharma",
    title: "Chief Operating Officer",
    company: "NovaStar Industries",
    companySize: "3,500 employees",
    avatar: "PS",
    avatarColor: "from-rose-500 to-pink-500",
    result: "50+ workflows, 0 new hires",
    resultColor: "text-rose-400",
  },
  {
    quote:
      "The AI workflow builder is genuinely impressive. I described our invoice reconciliation process in plain text and it built a complete, working automation in under 3 minutes. My team was stunned.",
    name: "James Okonkwo",
    title: "CFO & Co-Founder",
    company: "Apex Dynamics",
    companySize: "220 employees",
    avatar: "JO",
    avatarColor: "from-amber-500 to-orange-500",
    result: "3 min to first automation",
    resultColor: "text-amber-400",
  },
  {
    quote:
      "Customer support ticket routing used to take our team 2+ hours daily. NexFlow AI automated it completely — tickets are now routed and responded to in under 2 minutes. CSAT jumped 28%.",
    name: "Lena Müller",
    title: "Director of Customer Experience",
    company: "Stellar Commerce",
    companySize: "650 employees",
    avatar: "LM",
    avatarColor: "from-cyan-500 to-blue-500",
    result: "+28% customer satisfaction",
    resultColor: "text-cyan-400",
  },
  {
    quote:
      "We evaluated five automation platforms. NexFlow AI was the only one that handled our complex multi-step workflows with conditional logic AND gave us enterprise security features at a reasonable price.",
    name: "David Park",
    title: "CTO",
    company: "Pinnacle Systems",
    companySize: "480 employees",
    avatar: "DP",
    avatarColor: "from-violet-500 to-purple-500",
    result: "Best enterprise value",
    resultColor: "text-violet-400",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            4.9/5 from 2,400+ reviews
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Loved by operations teams
            <br />
            <span className="gradient-text">around the world</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From startups to Fortune 500 companies — here&apos;s what real customers say about
            NexFlow AI transforming their operations.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className="group relative flex flex-col rounded-2xl p-7 border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-indigo-100 mb-4 fill-indigo-50" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>

              {/* Result badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold ${t.resultColor} mb-5`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {t.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.title} · {t.company}</div>
                </div>
                <div className="ml-auto text-xs text-slate-400 hidden sm:block">{t.companySize}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom logos */}
        <div className="mt-14 pt-10 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400 mb-6">Trusted by operations leaders at</p>
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {["QuantumTech", "Meridian Global", "NovaStar", "Apex Dynamics", "Stellar Commerce", "Pinnacle Systems"].map((name) => (
              <span key={name} className="text-slate-300 font-bold text-sm tracking-wide">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
