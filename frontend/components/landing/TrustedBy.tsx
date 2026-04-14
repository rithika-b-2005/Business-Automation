const companies = [
  "QuantumTech", "Meridian Global", "Apex Dynamics", "NovaStar",
  "Pinnacle Systems", "Vortex Solutions", "Stellar Commerce", "Atlas Ventures",
]

export default function TrustedBy() {
  return (
    <section className="bg-white py-14 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-10">
          10,000+ Brands Trust Us
        </p>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex gap-10 animate-marquee-left w-max">
            {[...companies, ...companies].map((name, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 hover:text-indigo-500 transition-colors whitespace-nowrap group">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">{name[0]}</span>
                </div>
                <span className="font-bold text-sm tracking-wide">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row — matching Infotek style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-10 border-t border-slate-100">
          {[
            { value: "25,000+", label: "Active Businesses", icon: "🏢" },
            { value: "150+",    label: "Countries Served",  icon: "🌍" },
            { value: "500M+",   label: "Tasks Automated",   icon: "⚡" },
            { value: "6,561+",  label: "Satisfied Clients", icon: "⭐" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold text-slate-900 mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
