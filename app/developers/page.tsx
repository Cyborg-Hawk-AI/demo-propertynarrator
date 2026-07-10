import Link from "next/link";
import Header from "@/components/Header";

const features = [
  {
    id: "property-input",
    title: "Property Input Form",
    location: "Demo → Deal Analyzer tab → left panel",
    tryIt: "Edit any field (address, price, rent, expenses) and click 'Generate AI Verdict'",
    mocked:
      "Form state is client-side React state seeded from DEMO_PROPERTY. No persistence or geocoding.",
    production:
      "POST /api/properties with address, financials → geocode via Mapbox → store in Supabase properties table. Validate inputs server-side.",
  },
  {
    id: "ai-verdict",
    title: "AI Investment Verdict",
    location: "Demo → Deal Analyzer tab → AI Investment Verdict card",
    tryIt: "Click 'Generate AI Verdict' — watch loading state, then narrative appears. Toggle Collapse/Expand.",
    mocked:
      "Pre-written AI_VERDICT string from mockData.ts. Loading spinner is timed setTimeout (2s).",
    production:
      "Agent pipeline: metrics + comps → prompt template → self-hosted LLaMA → structured JSON (verdict, risks, recommendation) → render markdown.",
  },
  {
    id: "rent-comps",
    title: "Comparable Rent Fetching",
    location: "Demo → Deal Analyzer tab → Comparable Rents table",
    tryIt: "Click any comp row for detail toast. Toggle Collapse/Expand. Median calculated live from COMP_RENTS.",
    mocked:
      "5 hardcoded comps with sources (Zillow, Rentometer, Craigslist, etc.). Median computed client-side.",
    production:
      "Scraper agent queries public APIs/listings within 0.5–1mi radius. Dedup by address. Cache 24h in Redis. Sources attributed.",
  },
  {
    id: "cash-flow",
    title: "Cash Flow Breakdown & Metrics",
    location: "Demo → Deal Analyzer tab → metric cards + bar chart",
    tryIt: "Change rent/expenses in form — metrics and chart update instantly.",
    mocked:
      "calculateMetrics() in mockData.ts runs amortization + NOI formulas client-side.",
    production:
      "Same formulas on server. Expense line itemized (tax, insurance, mgmt, maintenance reserve, HOA). Configurable vacancy default per user.",
  },
  {
    id: "portfolio",
    title: "Portfolio Comparison & Ranking",
    location: "Demo → Portfolio tab",
    tryIt: "Click column headers to sort. Filter All/Owned/Evaluating. Click a row to select and see rank cards below.",
    mocked:
      "5 properties in PORTFOLIO_PROPERTIES with pre-calculated metrics. Sort/filter is client-side.",
    production:
      "GET /api/portfolio → join properties + latest metrics. Nightly cron recalculates. Export CSV. Alert when cap rate drops >0.3%.",
  },
  {
    id: "scenarios",
    title: "What-If Scenario Engine",
    location: "Demo → What-If tab",
    tryIt: "Use preset buttons (Rent +10%, Vacancy 15%, Rate +1%) or drag sliders. Click 'Save Scenario'.",
    mocked:
      "Sliders adjust rentAdjust, vacancyAdjust, rateAdjust state. scenarioMetrics recalculated via calculateMetrics().",
    production:
      "POST /api/scenarios with property_id + params → server runs full pro forma → save to scenarios table with timestamp.",
  },
  {
    id: "deal-memo",
    title: "Shareable PDF Deal Memo",
    location: "Demo → Deal Memo tab",
    tryIt: "Click Generate Memo (modal), Download PDF (toast), Share with Lender (email modal → send toast).",
    mocked:
      "Static DEAL_MEMO_CONTENT rendered as HTML preview. PDF download and email are toast notifications only.",
    production:
      "LLM generates memo sections → Puppeteer renders branded PDF → S3 upload → shareable expiring link. Email via Resend/SendGrid.",
  },
  {
    id: "activity",
    title: "Activity Feed",
    location: "Demo → Activity tab",
    tryIt: "Filter by type (report, scenario, memo, comp, alert). Click any item for detail toast.",
    mocked:
      "6 hardcoded ACTIVITY_FEED items with timestamps. Filter is client-side.",
    production:
      "Event log in Supabase (property_analyzed, scenario_saved, memo_shared, etc.). Real-time via Supabase subscriptions.",
  },
  {
    id: "pricing",
    title: "Credits & Plan Toggle",
    location: "Demo → top-right header bar",
    tryIt: "Toggle Pay-go vs Unlimited. Generate a verdict on pay-go to decrement credits.",
    mocked:
      "Local credits counter (starts at 12). Unlimited shows ∞. No Stripe integration.",
    production:
      "Stripe Checkout for $9/report credits or $39/mo subscription. Webhook updates user credits/plan in Supabase.",
  },
  {
    id: "dev-notes",
    title: "DEV NOTE Tooltips",
    location: "Throughout /demo — click the (i) icon beside section headers",
    tryIt: "Click any blue 'i' badge next to a feature title to see production integration notes.",
    mocked:
      "Static tooltip content in DevNote component. Click-outside to dismiss.",
    production:
      "Remove in production build or gate behind ?dev=true query param.",
  },
];

const architecture = [
  {
    step: "1",
    title: "User Input",
    desc: "Investor enters address + financials via web form or CSV import",
  },
  {
    step: "2",
    title: "Geocode & Comp Fetch",
    desc: "Agent geocodes address, scrapes public rent listings within radius",
  },
  {
    step: "3",
    title: "Financial Model",
    desc: "Server calculates NOI, cap rate, cash-on-cash, DSCR with amortization",
  },
  {
    step: "4",
    title: "AI Narrative",
    desc: "Self-hosted LLaMA generates plain-English verdict from metrics + comps",
  },
  {
    step: "5",
    title: "PDF & Share",
    desc: "Puppeteer renders deal memo → S3 → shareable link emailed to lender",
  },
];

export default function DevelopersPage() {
  return (
    <>
      <Header active="developers" />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-400">
            Developer Documentation
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            PropertyNarrator Feature Map
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Every feature in the interactive demo, what it does, where to click,
            what&apos;s mocked vs. production, and the intended integration path.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/demo" className="btn-primary">
              Open Live Demo
            </Link>
            <Link href="/research" className="btn-secondary">
              View Research
            </Link>
          </div>
        </div>

        {/* Architecture */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-xl font-semibold text-white">
            Intended Production Data Flow
          </h2>
          <div className="grid gap-4 sm:grid-cols-5">
            {architecture.map((a) => (
              <div key={a.step} className="glass-card p-4 text-center">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {a.step}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-white">{a.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-16">
          <h2 className="mb-4 font-display text-xl font-semibold text-white">
            Recommended Tech Stack
          </h2>
          <div className="glass-card grid gap-4 p-6 sm:grid-cols-2">
            {[
              { layer: "Frontend", tech: "Next.js 14 App Router + Tailwind" },
              { layer: "Database", tech: "Supabase (Postgres + auth + realtime)" },
              { layer: "AI Narrative", tech: "Self-hosted LLaMA via Ollama/vLLM" },
              { layer: "PDF Export", tech: "Puppeteer server-side rendering" },
              { layer: "Comp Data", tech: "Scraper agents + Rentometer/Zillow APIs" },
              { layer: "Payments", tech: "Stripe (credits + subscription)" },
            ].map((item) => (
              <div key={item.layer} className="flex gap-3">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-brand-400">
                  {item.layer}
                </span>
                <span className="text-sm text-slate-300">{item.tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature list */}
        <section>
          <h2 className="mb-6 font-display text-xl font-semibold text-white">
            Feature-by-Feature Guide
          </h2>
          <div className="space-y-6">
            {features.map((f) => (
              <div key={f.id} className="glass-card p-6">
                <h3 className="font-display text-lg font-semibold text-white">
                  {f.title}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Where to find it
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{f.location}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      How to try it
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{f.tryIt}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
                      Mocked in demo
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{f.mocked}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-400">
                      Production plan
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{f.production}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deploy notes */}
        <section className="mt-16">
          <div className="rounded-xl border border-slate-700 bg-surface-800/50 p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              Deployment Notes
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• This demo deploys to Vercel with zero configuration — no env vars, no custom server</li>
              <li>• All interactivity is client-side React state with hardcoded sample data</li>
              <li>• Production MVP estimate: 2–3 weeks (Next.js + Supabase + self-hosted LLaMA + Puppeteer)</li>
              <li>• No auth, database, or API keys in this mock — add Supabase + Stripe for production</li>
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
