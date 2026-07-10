import Link from "next/link";
import Header from "@/components/Header";

const features = [
  {
    icon: "📊",
    title: "Plain-English Verdicts",
    description:
      "Stop staring at spreadsheets. Get narratives like 'This property cash flows $340/mo but your cap rate is below market — here's why.'",
  },
  {
    icon: "🏘️",
    title: "Public Rent Comps",
    description:
      "AI fetches comparable rents from public listings and benchmarks your assumptions against the submarket median.",
  },
  {
    icon: "📈",
    title: "Portfolio Ranking",
    description:
      "Compare every holding side-by-side. Rank properties by cash-on-cash return and spot underperformers instantly.",
  },
  {
    icon: "🔮",
    title: "What-If Scenarios",
    description:
      "Model rent increases, vacancy spikes, or rate changes. See cash flow impact before you commit.",
  },
  {
    icon: "📄",
    title: "Shareable Deal Memos",
    description:
      "Auto-generated PDF memos for partners and lenders — professional enough to forward, fast enough to run on every deal.",
  },
  {
    icon: "⚡",
    title: "60-Second Reports",
    description:
      "Input address, price, rent, expenses — get a full investment narrative in under a minute. No analyst required.",
  },
];

const pricingPlans = [
  {
    name: "Pay-as-you-go",
    price: "$9",
    period: "per deal report",
    description: "Perfect for occasional acquisitions or one-off evaluations.",
    features: [
      "Full AI investment verdict",
      "Rent comp analysis",
      "What-if scenario (1 per report)",
      "PDF deal memo export",
      "Credits never expire",
    ],
    cta: "Buy 5 Reports — $39",
    highlighted: false,
  },
  {
    name: "Unlimited",
    price: "$39",
    period: "/month",
    description: "For active investors analyzing deals every week.",
    features: [
      "Unlimited deal reports",
      "Portfolio comparison dashboard",
      "Unlimited what-if scenarios",
      "Priority comp data refresh",
      "White-label PDF memos",
      "Email support",
    ],
    cta: "Start Unlimited",
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="relative overflow-hidden">
        {/* Hero */}
        <section className="relative px-6 pb-24 pt-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-surface-900 to-surface-900" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand-600/5 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-700/40 bg-brand-900/30 px-4 py-1.5 text-sm text-brand-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
              AI-powered deal analysis for real estate investors
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Raw numbers in.
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-emerald-300 bg-clip-text text-transparent">
                Plain-English verdicts out.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              PropertyNarrator turns purchase price, rent, and expenses into
              investment narratives landlords actually understand — with comps,
              portfolio rankings, what-if scenarios, and shareable deal memos.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/demo" className="btn-primary px-8 py-3 text-base">
                Try Interactive Demo
              </Link>
              <Link href="/research" className="btn-secondary px-8 py-3 text-base">
                How we found this idea
              </Link>
            </div>

            {/* Hero preview card */}
            <div className="mx-auto mt-16 max-w-3xl animate-slide-up">
              <div className="glass-card overflow-hidden text-left shadow-2xl shadow-black/40">
                <div className="flex items-center gap-2 border-b border-slate-700/60 bg-surface-700/50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs text-slate-500">
                    1847 Maple Ridge Dr — AI Verdict
                  </span>
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-sm leading-relaxed text-slate-300">
                    <span className="font-semibold text-brand-400">
                      Verdict: Proceed with caution
                    </span>{" "}
                    — This property cash flows{" "}
                    <span className="font-semibold text-white">$340/mo</span> but
                    your{" "}
                    <span className="font-semibold text-amber-400">
                      3.95% cap rate
                    </span>{" "}
                    sits 0.6 points below the submarket median. Five comps within
                    0.7 mi support your rent assumption at $2,440/mo median...
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-md bg-surface-700 px-3 py-1 text-xs text-slate-400">
                      Cap Rate: 3.95%
                    </span>
                    <span className="rounded-md bg-surface-700 px-3 py-1 text-xs text-slate-400">
                      Cash-on-Cash: 5.29%
                    </span>
                    <span className="rounded-md bg-brand-900/40 px-3 py-1 text-xs text-brand-300">
                      5 comps fetched
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-slate-800 bg-surface-800/30 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Everything investors need in one narrative
              </h2>
              <p className="mt-4 text-slate-400">
                DealCheck gives you numbers. PropertyNarrator gives you the
                story behind them.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-card group p-6 transition hover:border-brand-700/40 hover:bg-surface-700/50"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
              Built for investors who are tired of spreadsheets
            </p>
            <blockquote className="mt-6 text-xl italic leading-relaxed text-slate-300">
              &ldquo;I got tired of juggling spreadsheets to track my properties
              and finances. I just want to know which deals cash flow and which
              ones are costing me money.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-slate-500">
              — r/SideProject, real estate investor managing multiple properties
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-t border-slate-800 bg-surface-800/30 px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 text-center">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Simple, investor-friendly pricing
              </h2>
              <p className="mt-4 text-slate-400">
                Pay per report or go unlimited. No enterprise sales calls.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`glass-card relative p-8 ${
                    plan.highlighted
                      ? "border-brand-600/60 ring-1 ring-brand-600/30"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <span className="mt-0.5 text-brand-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/demo"
                    className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-brand-600 text-white hover:bg-brand-500"
                        : "border border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-surface-700"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-700/30 bg-gradient-to-br from-brand-900/40 to-surface-800 p-12 text-center">
            <h2 className="font-display text-3xl font-bold text-white">
              See the full product story
            </h2>
            <p className="mt-4 text-slate-400">
              Explore the interactive demo with realistic portfolio data, AI
              verdicts, what-if scenarios, and PDF deal memos — all mocked,
              zero API keys required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/demo" className="btn-primary px-8 py-3">
                Launch Demo
              </Link>
              <Link href="/developers" className="btn-secondary px-8 py-3">
                Developer Docs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
