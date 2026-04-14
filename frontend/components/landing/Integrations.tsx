import { ArrowRight, Plug } from "lucide-react"

const integrations = [
  { name: "Salesforce", category: "CRM", color: "bg-blue-500", initial: "SF" },
  { name: "HubSpot", category: "CRM", color: "bg-orange-500", initial: "HS" },
  { name: "Slack", category: "Messaging", color: "bg-purple-500", initial: "SL" },
  { name: "Notion", category: "Productivity", color: "bg-gray-800", initial: "N" },
  { name: "Stripe", category: "Payments", color: "bg-indigo-600", initial: "ST" },
  { name: "Shopify", category: "eCommerce", color: "bg-green-600", initial: "SH" },
  { name: "Mailchimp", category: "Email", color: "bg-yellow-500", initial: "MC" },
  { name: "Zendesk", category: "Support", color: "bg-green-500", initial: "ZD" },
  { name: "Jira", category: "Project Mgmt", color: "bg-blue-600", initial: "JR" },
  { name: "GitHub", category: "Dev Tools", color: "bg-gray-900", initial: "GH" },
  { name: "Google Sheets", category: "Spreadsheet", color: "bg-emerald-500", initial: "GS" },
  { name: "Twilio", category: "SMS / Voice", color: "bg-red-500", initial: "TW" },
  { name: "QuickBooks", category: "Accounting", color: "bg-green-700", initial: "QB" },
  { name: "Intercom", category: "Customer IO", color: "bg-blue-400", initial: "IC" },
  { name: "Typeform", category: "Forms", color: "bg-pink-500", initial: "TF" },
  { name: "Airtable", category: "Database", color: "bg-yellow-600", initial: "AT" },
  { name: "Dropbox", category: "Storage", color: "bg-blue-500", initial: "DB" },
  { name: "Webflow", category: "No-Code", color: "bg-indigo-500", initial: "WF" },
  { name: "Pipedrive", category: "Sales CRM", color: "bg-green-500", initial: "PD" },
  { name: "Monday", category: "Work OS", color: "bg-red-500", initial: "MO" },
]

const categories = ["CRM", "Payments", "Messaging", "Email", "eCommerce", "Dev Tools", "Analytics", "Accounting", "Support", "Productivity"]

export default function Integrations() {
  return (
    <section id="integrations" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Plug className="w-3.5 h-3.5" />
            500+ integrations
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Connects with the tools
            <br />
            <span className="gradient-text">your team already uses</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            NexFlow AI integrates natively with every major business platform.
            No middleware, no complexity — just seamless automation across your entire stack.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <span key={cat} className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-slate-400 bg-white/3 hover:bg-white/8 hover:text-slate-200 hover:border-white/20 transition-all cursor-default">
              {cat}
            </span>
          ))}
          <span className="px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
            +490 more
          </span>
        </div>

        {/* Integration grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${integration.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                {integration.initial}
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-tight">
                  {integration.name}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">{integration.category}</div>
              </div>
            </div>
          ))}

          {/* "And many more" card */}
          <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-default">
            <div className="text-2xl font-black text-indigo-400">+480</div>
            <div className="text-xs text-slate-500 text-center">more apps</div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-4">
            Don&apos;t see your app?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors">
              Request an integration
            </a>{" "}
            or use our REST API to connect anything.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
          >
            Browse all integrations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
