"use client";

import { useState, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import DevNote from "@/components/DevNote";
import {
  DEMO_PROPERTY,
  PORTFOLIO_PROPERTIES,
  COMP_RENTS,
  ACTIVITY_FEED,
  AI_VERDICT,
  DEAL_MEMO_CONTENT,
  calculateMetrics,
  formatCurrency,
  formatCurrencyPrecise,
  formatPercent,
  type Property,
} from "@/lib/mockData";

type Tab = "analyze" | "portfolio" | "scenarios" | "memo" | "activity";
type SortKey = "cashOnCash" | "capRate" | "monthlyCashFlow" | "purchasePrice";
type Toast = { id: number; message: string; type: "success" | "info" | "warning" };

let toastId = 0;

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up rounded-lg border px-4 py-3 text-sm shadow-xl ${
            t.type === "success"
              ? "border-brand-700/50 bg-brand-900/90 text-brand-100"
              : t.type === "warning"
                ? "border-amber-700/50 bg-amber-900/90 text-amber-100"
                : "border-slate-600 bg-surface-800 text-slate-200"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
      {sub && (
        <p
          className={`mt-1 text-xs ${
            trend === "up"
              ? "text-brand-400"
              : trend === "down"
                ? "text-red-400"
                : "text-slate-500"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function CashFlowChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-xs text-slate-400">{d.label}</span>
          <div className="relative h-6 flex-1 overflow-hidden rounded bg-surface-700">
            <div
              className={`absolute left-0 top-0 h-full rounded transition-all duration-500 ${
                d.value >= 0 ? "bg-brand-600/80" : "bg-red-600/80"
              }`}
              style={{ width: `${(Math.abs(d.value) / max) * 100}%` }}
            />
          </div>
          <span
            className={`w-20 text-right text-xs font-medium ${
              d.value >= 0 ? "text-brand-400" : "text-red-400"
            }`}
          >
            {formatCurrencyPrecise(d.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState<Tab>("analyze");
  const [property, setProperty] = useState<Property>(DEMO_PROPERTY);
  const [analyzing, setAnalyzing] = useState(false);
  const [verdictVisible, setVerdictVisible] = useState(true);
  const [compsExpanded, setCompsExpanded] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("cashOnCash");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    "prop-104"
  );
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "owned" | "evaluating">("all");
  const [rentAdjust, setRentAdjust] = useState(0);
  const [vacancyAdjust, setVacancyAdjust] = useState(5);
  const [rateAdjust, setRateAdjust] = useState(6.75);
  const [memoModalOpen, setMemoModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("sarah.chen@pacificcrest.com");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [credits, setCredits] = useState(12);
  const [plan, setPlan] = useState<"paygo" | "unlimited">("paygo");

  const addToast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const metrics = useMemo(() => calculateMetrics(property), [property]);

  const scenarioMetrics = useMemo(() => {
    const adjusted: Property = {
      ...property,
      monthlyRent: property.monthlyRent * (1 + rentAdjust / 100),
      vacancyRate: vacancyAdjust,
      mortgageRate: rateAdjust,
    };
    return calculateMetrics(adjusted);
  }, [property, rentAdjust, vacancyAdjust, rateAdjust]);

  const sortedPortfolio = useMemo(() => {
    let filtered = [...PORTFOLIO_PROPERTIES];
    if (portfolioFilter !== "all") {
      filtered = filtered.filter((p) =>
        portfolioFilter === "owned"
          ? p.status === "owned"
          : p.status === "evaluating" || p.status === "under-contract"
      );
    }
    filtered.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortAsc ? av - bv : bv - av;
    });
    return filtered;
  }, [sortKey, sortAsc, portfolioFilter]);

  const filteredActivity = useMemo(() => {
    if (activityFilter === "all") return ACTIVITY_FEED;
    return ACTIVITY_FEED.filter((a) => a.type === activityFilter);
  }, [activityFilter]);

  const medianCompRent = useMemo(() => {
    const rents = COMP_RENTS.map((c) => c.rent).sort((a, b) => a - b);
    const mid = Math.floor(rents.length / 2);
    return rents.length % 2 ? rents[mid] : (rents[mid - 1] + rents[mid]) / 2;
  }, []);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setVerdictVisible(false);
    addToast("Fetching rent comps from public data sources...", "info");
    setTimeout(() => {
      addToast(`Found ${COMP_RENTS.length} comps — median ${formatCurrency(medianCompRent)}/mo`, "success");
      setTimeout(() => {
        setAnalyzing(false);
        setVerdictVisible(true);
        addToast("AI verdict generated — cap rate below submarket median", "warning");
        if (plan === "paygo") setCredits((c) => Math.max(0, c - 1));
      }, 800);
    }, 1200);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
    addToast(`Portfolio sorted by ${key}`, "info");
  };

  const handleScenarioPreset = (preset: string) => {
    switch (preset) {
      case "rent+10":
        setRentAdjust(10);
        setVacancyAdjust(5);
        setRateAdjust(property.mortgageRate);
        addToast("Scenario: +10% rent increase applied", "success");
        break;
      case "vacancy15":
        setRentAdjust(0);
        setVacancyAdjust(15);
        setRateAdjust(property.mortgageRate);
        addToast("Scenario: 15% vacancy rate applied", "warning");
        break;
      case "rate+1":
        setRentAdjust(0);
        setVacancyAdjust(5);
        setRateAdjust(property.mortgageRate + 1);
        addToast("Scenario: +1% interest rate applied", "warning");
        break;
      case "reset":
        setRentAdjust(0);
        setVacancyAdjust(5);
        setRateAdjust(property.mortgageRate);
        addToast("Scenario reset to baseline", "info");
        break;
    }
  };

  const handleGenerateMemo = () => {
    setMemoModalOpen(true);
    addToast("Deal memo generated — ready for review", "success");
  };

  const handleDownloadPdf = () => {
    addToast("PDF downloaded: Maple_Ridge_Deal_Memo_Mar2026.pdf", "success");
  };

  const handleShareMemo = () => {
    setShareModalOpen(true);
  };

  const handleSendShare = () => {
    setShareModalOpen(false);
    addToast(`Deal memo sent to ${shareEmail}`, "success");
  };

  const cashFlowBreakdown = [
    { label: "Gross Rent", value: property.monthlyRent },
    { label: "Vacancy (-5%)", value: -(property.monthlyRent * 0.05) },
    { label: "Operating Exp.", value: -property.monthlyExpenses },
    { label: "Debt Service", value: -metrics.mortgage },
    { label: "Net Cash Flow", value: metrics.monthlyCashFlow },
  ];

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: "analyze", label: "Deal Analyzer" },
    { id: "portfolio", label: "Portfolio", badge: "5" },
    { id: "scenarios", label: "What-If" },
    { id: "memo", label: "Deal Memo" },
    { id: "activity", label: "Activity", badge: "6" },
  ];

  return (
    <>
      <Header active="demo" />
      <ToastContainer toasts={toasts} />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Demo header bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              PropertyNarrator Demo
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Marcus Delgado · Delgado Holdings LLC · Austin, TX portfolio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card flex items-center gap-3 px-4 py-2">
              <span className="text-xs text-slate-500">Plan:</span>
              <button
                onClick={() => {
                  setPlan("paygo");
                  addToast("Switched to pay-as-you-go plan", "info");
                }}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  plan === "paygo"
                    ? "bg-brand-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Pay-go
              </button>
              <button
                onClick={() => {
                  setPlan("unlimited");
                  addToast("Switched to unlimited plan ($39/mo)", "success");
                }}
                className={`rounded px-2 py-1 text-xs font-medium transition ${
                  plan === "unlimited"
                    ? "bg-brand-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Unlimited
              </button>
            </div>
            <div className="glass-card px-4 py-2 text-sm">
              <span className="text-slate-500">Credits: </span>
              <span className="font-semibold text-brand-400">
                {plan === "unlimited" ? "∞" : credits}
              </span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-slate-700/60 bg-surface-800/50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                addToast(`Switched to ${tab.label}`, "info");
              }}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-900/30"
                  : "text-slate-400 hover:bg-surface-700 hover:text-slate-200"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === tab.id
                      ? "bg-brand-500 text-white"
                      : "bg-surface-600 text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ANALYZE TAB */}
        {activeTab === "analyze" && (
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Input form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Property Input
                  </h2>
                  <DevNote title="Property Input">
                    Production: form submits to API → stores in Supabase. Address
                    geocoded via Google Places or Mapbox for comp radius search.
                  </DevNote>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Street Address
                    </label>
                    <input
                      className="input-field"
                      value={property.address}
                      onChange={(e) =>
                        setProperty({ ...property, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        City
                      </label>
                      <input
                        className="input-field"
                        value={property.city}
                        onChange={(e) =>
                          setProperty({ ...property, city: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        State
                      </label>
                      <input
                        className="input-field"
                        value={property.state}
                        onChange={(e) =>
                          setProperty({ ...property, state: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Purchase Price
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={property.purchasePrice}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            purchasePrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Down Payment
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={property.downPayment}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            downPayment: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Monthly Rent
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={property.monthlyRent}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            monthlyRent: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Monthly Expenses
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={property.monthlyExpenses}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            monthlyExpenses: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Rate %
                      </label>
                      <input
                        type="number"
                        step="0.125"
                        className="input-field"
                        value={property.mortgageRate}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            mortgageRate: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Beds
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={property.beds}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            beds: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-400">
                        Baths
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        className="input-field"
                        value={property.baths}
                        onChange={(e) =>
                          setProperty({
                            ...property,
                            baths: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {analyzing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Analyzing...
                      </span>
                    ) : (
                      "Generate AI Verdict"
                    )}
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <MetricCard
                  label="Monthly Cash Flow"
                  value={formatCurrencyPrecise(metrics.monthlyCashFlow)}
                  sub={
                    metrics.monthlyCashFlow > 0 ? "Positive flow" : "Negative flow"
                  }
                  trend={metrics.monthlyCashFlow > 0 ? "up" : "down"}
                />
                <MetricCard
                  label="Cap Rate"
                  value={formatPercent(metrics.capRate)}
                  sub="Submarket: 4.55%"
                  trend="down"
                />
                <MetricCard
                  label="Cash-on-Cash"
                  value={formatPercent(metrics.cashOnCash)}
                  sub="vs portfolio avg 6.0%"
                  trend="neutral"
                />
                <MetricCard
                  label="Annual NOI"
                  value={formatCurrency(metrics.annualNOI)}
                  sub="Before debt service"
                  trend="neutral"
                />
              </div>
            </div>

            {/* Verdict + Comps */}
            <div className="space-y-6 lg:col-span-3">
              {/* Cash flow chart */}
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center">
                  <h2 className="font-display text-lg font-semibold text-white">
                    Cash Flow Breakdown
                  </h2>
                  <DevNote title="Financial Model">
                    Production: server-side calculation engine using same formulas.
                    Expense categories itemized; vacancy and capex reserves
                    configurable per investor profile.
                  </DevNote>
                </div>
                <CashFlowChart data={cashFlowBreakdown} />
              </div>

              {/* AI Verdict */}
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="font-display text-lg font-semibold text-white">
                      AI Investment Verdict
                    </h2>
                    <DevNote title="AI Narrative Generation">
                      Production: property metrics + comps sent to self-hosted
                      LLaMA via prompt template. Returns structured narrative with
                      verdict, risks, and negotiation targets. Cached per property
                      hash.
                    </DevNote>
                  </div>
                  <button
                    onClick={() => {
                      setVerdictVisible(!verdictVisible);
                      addToast(
                        verdictVisible ? "Verdict collapsed" : "Verdict expanded",
                        "info"
                      );
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {verdictVisible ? "Collapse" : "Expand"}
                  </button>
                </div>
                {analyzing ? (
                  <div className="flex items-center gap-3 py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600/30 border-t-brand-500" />
                    <div>
                      <p className="text-sm text-slate-300">
                        Running financial model...
                      </p>
                      <p className="text-xs text-slate-500">
                        Fetching comps · Generating narrative
                      </p>
                    </div>
                  </div>
                ) : verdictVisible ? (
                  <div className="prose-sm space-y-3 text-sm leading-relaxed text-slate-300">
                    {AI_VERDICT.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: para
                            .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white'>$1</strong>")
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Verdict hidden</p>
                )}
              </div>

              {/* Rent Comps */}
              <div className="glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h2 className="font-display text-lg font-semibold text-white">
                      Comparable Rents
                    </h2>
                    <DevNote title="Public Rent Comps">
                      Production: agent scrapes Zillow, Rentometer, Craigslist,
                      HUD FMR within configurable radius. Results deduplicated and
                      median-calculated. Refreshed on each new analysis.
                    </DevNote>
                  </div>
                  <button
                    onClick={() => {
                      setCompsExpanded(!compsExpanded);
                      addToast(
                        compsExpanded ? "Comps table collapsed" : "Comps table expanded",
                        "info"
                      );
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    {compsExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>
                {compsExpanded && (
                  <>
                    <div className="mb-4 flex items-center gap-4 rounded-lg bg-surface-700/50 px-4 py-3">
                      <span className="text-sm text-slate-400">
                        Median comp rent:
                      </span>
                      <span className="font-display text-lg font-bold text-brand-400">
                        {formatCurrency(medianCompRent)}/mo
                      </span>
                      <span className="text-xs text-slate-500">
                        Your assumption: {formatCurrency(property.monthlyRent)}/mo
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wider text-slate-500">
                            <th className="pb-3 pr-4">Address</th>
                            <th className="pb-3 pr-4">Distance</th>
                            <th className="pb-3 pr-4">Rent</th>
                            <th className="pb-3 pr-4">Beds/Baths</th>
                            <th className="pb-3 pr-4">Sqft</th>
                            <th className="pb-3">Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {COMP_RENTS.map((comp) => (
                            <tr
                              key={comp.address}
                              className="cursor-pointer border-b border-slate-800 transition hover:bg-surface-700/50"
                              onClick={() =>
                                addToast(
                                  `Comp detail: ${comp.address} — ${formatCurrency(comp.rent)}/mo from ${comp.source}`,
                                  "info"
                                )
                              }
                            >
                              <td className="py-3 pr-4 font-medium text-slate-200">
                                {comp.address}
                              </td>
                              <td className="py-3 pr-4 text-slate-400">
                                {comp.distance}
                              </td>
                              <td className="py-3 pr-4 font-semibold text-brand-400">
                                {formatCurrency(comp.rent)}
                              </td>
                              <td className="py-3 pr-4 text-slate-400">
                                {comp.beds}/{comp.baths}
                              </td>
                              <td className="py-3 pr-4 text-slate-400">
                                {comp.sqft.toLocaleString()}
                              </td>
                              <td className="py-3 text-xs text-slate-500">
                                {comp.source}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === "portfolio" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <h2 className="font-display text-lg font-semibold text-white">
                  Portfolio Comparison
                </h2>
                <DevNote title="Portfolio Ranking">
                  Production: pulls all owned properties from Supabase, recalculates
                  metrics nightly. Supports custom sort, filters, and CSV export.
                  Alerts when cap rate drops below threshold.
                </DevNote>
              </div>
              <div className="flex items-center gap-2">
                {(["all", "owned", "evaluating"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setPortfolioFilter(f);
                      addToast(
                        `Filter: ${f === "all" ? "All properties" : f}`,
                        "info"
                      );
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                      portfolioFilter === f
                        ? "bg-brand-600 text-white"
                        : "bg-surface-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-surface-700/30 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Status</th>
                    <th
                      className="cursor-pointer px-4 py-3 hover:text-brand-400"
                      onClick={() => handleSort("purchasePrice")}
                    >
                      Price {sortKey === "purchasePrice" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 hover:text-brand-400"
                      onClick={() => handleSort("monthlyCashFlow")}
                    >
                      Cash Flow {sortKey === "monthlyCashFlow" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 hover:text-brand-400"
                      onClick={() => handleSort("capRate")}
                    >
                      Cap Rate {sortKey === "capRate" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-3 hover:text-brand-400"
                      onClick={() => handleSort("cashOnCash")}
                    >
                      CoC Return {sortKey === "cashOnCash" && (sortAsc ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-3">Tenant</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPortfolio.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`cursor-pointer border-b border-slate-800 transition hover:bg-surface-700/50 ${
                        selectedPortfolioId === p.id ? "bg-brand-900/20" : ""
                      }`}
                      onClick={() => {
                        setSelectedPortfolioId(p.id);
                        addToast(`Selected: ${p.address}`, "info");
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {idx === 0 && sortKey === "cashOnCash" && !sortAsc && (
                            <span className="rounded bg-brand-600/30 px-1.5 py-0.5 text-[10px] font-bold text-brand-400">
                              #1
                            </span>
                          )}
                          <div>
                            <p className="font-medium text-slate-200">
                              {p.address}
                            </p>
                            <p className="text-xs text-slate-500">
                              {p.city}, {p.state}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === "owned"
                              ? "bg-brand-900/50 text-brand-300"
                              : p.status === "evaluating"
                                ? "bg-amber-900/50 text-amber-300"
                                : "bg-blue-900/50 text-blue-300"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatCurrency(p.purchasePrice)}
                      </td>
                      <td
                        className={`px-4 py-3 font-semibold ${
                          p.monthlyCashFlow > 0 ? "text-brand-400" : "text-red-400"
                        }`}
                      >
                        {formatCurrencyPrecise(p.monthlyCashFlow)}/mo
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatPercent(p.capRate)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">
                        {formatPercent(p.cashOnCash)}
                      </td>
                      <td className="max-w-[180px] truncate px-4 py-3 text-xs text-slate-500">
                        {p.tenant}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedPortfolioId && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {(() => {
                  const sel = PORTFOLIO_PROPERTIES.find(
                    (p) => p.id === selectedPortfolioId
                  )!;
                  return (
                    <>
                      <MetricCard
                        label="Selected Property"
                        value={sel.address.split(" ")[0] + "..."}
                        sub={`${sel.city}, ${sel.state}`}
                      />
                      <MetricCard
                        label="Cash-on-Cash Rank"
                        value={`#${sortedPortfolio.findIndex((p) => p.id === sel.id) + 1} of ${sortedPortfolio.length}`}
                        sub={`${formatPercent(sel.cashOnCash)} return`}
                        trend={
                          sortedPortfolio.findIndex((p) => p.id === sel.id) === 0
                            ? "up"
                            : "neutral"
                        }
                      />
                      <MetricCard
                        label="vs Portfolio Avg"
                        value={
                          sel.cashOnCash > 6
                            ? `+${(sel.cashOnCash - 6).toFixed(2)}%`
                            : `${(sel.cashOnCash - 6).toFixed(2)}%`
                        }
                        sub="Compared to 6.0% avg"
                        trend={sel.cashOnCash > 6 ? "up" : "down"}
                      />
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* SCENARIOS TAB */}
        {activeTab === "scenarios" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6">
              <div className="mb-6 flex items-center">
                <h2 className="font-display text-lg font-semibold text-white">
                  What-If Scenario Engine
                </h2>
                <DevNote title="Scenario Modeling">
                  Production: client sends scenario params to API; server
                  recalculates full pro forma including amortization schedule.
                  Scenarios saved per property for comparison history.
                </DevNote>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                {[
                  { id: "rent+10", label: "Rent +10%" },
                  { id: "vacancy15", label: "Vacancy 15%" },
                  { id: "rate+1", label: "Rate +1%" },
                  { id: "reset", label: "Reset" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleScenarioPreset(preset.id)}
                    className="rounded-lg border border-slate-600 bg-surface-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-600 hover:text-brand-300"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Rent Adjustment</span>
                    <span className="font-medium text-white">
                      {rentAdjust > 0 ? "+" : ""}
                      {rentAdjust}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    value={rentAdjust}
                    onChange={(e) => {
                      setRentAdjust(Number(e.target.value));
                    }}
                    onMouseUp={() =>
                      addToast(`Rent adjustment: ${rentAdjust}%`, "info")
                    }
                    className="w-full accent-brand-500"
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Vacancy Rate</span>
                    <span className="font-medium text-white">{vacancyAdjust}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={vacancyAdjust}
                    onChange={(e) => setVacancyAdjust(Number(e.target.value))}
                    onMouseUp={() =>
                      addToast(`Vacancy rate: ${vacancyAdjust}%`, "info")
                    }
                    className="w-full accent-brand-500"
                  />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">Interest Rate</span>
                    <span className="font-medium text-white">{rateAdjust}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.125"
                    value={rateAdjust}
                    onChange={(e) => setRateAdjust(Number(e.target.value))}
                    onMouseUp={() =>
                      addToast(`Interest rate: ${rateAdjust}%`, "info")
                    }
                    className="w-full accent-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-white">
                Scenario Results — {property.address}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  label="Baseline Cash Flow"
                  value={formatCurrencyPrecise(metrics.monthlyCashFlow)}
                  sub="/month"
                />
                <MetricCard
                  label="Scenario Cash Flow"
                  value={formatCurrencyPrecise(scenarioMetrics.monthlyCashFlow)}
                  sub={`${scenarioMetrics.monthlyCashFlow >= metrics.monthlyCashFlow ? "+" : ""}${formatCurrencyPrecise(scenarioMetrics.monthlyCashFlow - metrics.monthlyCashFlow)} delta`}
                  trend={
                    scenarioMetrics.monthlyCashFlow >= metrics.monthlyCashFlow
                      ? "up"
                      : "down"
                  }
                />
                <MetricCard
                  label="Baseline Cap Rate"
                  value={formatPercent(metrics.capRate)}
                />
                <MetricCard
                  label="Scenario Cap Rate"
                  value={formatPercent(scenarioMetrics.capRate)}
                  sub={`${scenarioMetrics.capRate >= metrics.capRate ? "+" : ""}${(scenarioMetrics.capRate - metrics.capRate).toFixed(2)}%`}
                  trend={
                    scenarioMetrics.capRate >= metrics.capRate ? "up" : "down"
                  }
                />
              </div>

              <div className="glass-card p-6">
                <h4 className="mb-4 text-sm font-semibold text-slate-300">
                  Side-by-Side Comparison
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      label: "Effective Rent",
                      base: formatCurrency(metrics.effectiveRent),
                      scenario: formatCurrency(scenarioMetrics.effectiveRent),
                    },
                    {
                      label: "Debt Service",
                      base: formatCurrencyPrecise(metrics.mortgage),
                      scenario: formatCurrencyPrecise(scenarioMetrics.mortgage),
                    },
                    {
                      label: "Annual Cash Flow",
                      base: formatCurrency(metrics.monthlyCashFlow * 12),
                      scenario: formatCurrency(
                        scenarioMetrics.monthlyCashFlow * 12
                      ),
                    },
                    {
                      label: "Cash-on-Cash",
                      base: formatPercent(metrics.cashOnCash),
                      scenario: formatPercent(scenarioMetrics.cashOnCash),
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2 text-sm"
                    >
                      <span className="text-slate-400">{row.label}</span>
                      <span className="text-center text-slate-300">{row.base}</span>
                      <span className="text-center font-medium text-brand-400">
                        {row.scenario}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  addToast("Scenario saved to property history", "success");
                }}
                className="btn-primary w-full"
              >
                Save Scenario
              </button>
            </div>
          </div>
        )}

        {/* MEMO TAB */}
        {activeTab === "memo" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <h2 className="font-display text-lg font-semibold text-white">
                  Shareable Deal Memo
                </h2>
                <DevNote title="PDF Deal Memo">
                  Production: LLM generates memo sections → Puppeteer renders branded
                  PDF with charts. Shareable link with expiring token for lenders.
                  Tracks opens and downloads.
                </DevNote>
              </div>
              <div className="flex gap-2">
                <button onClick={handleGenerateMemo} className="btn-primary">
                  Generate Memo
                </button>
                <button onClick={handleDownloadPdf} className="btn-secondary">
                  Download PDF
                </button>
                <button onClick={handleShareMemo} className="btn-secondary">
                  Share with Lender
                </button>
              </div>
            </div>

            <div className="glass-card mx-auto max-w-3xl p-8">
              <div className="mb-6 border-b border-slate-700 pb-6 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-brand-400">
                  {DEAL_MEMO_CONTENT.title}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">
                  {DEAL_MEMO_CONTENT.property}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Prepared by {DEAL_MEMO_CONTENT.preparedBy} for{" "}
                  {DEAL_MEMO_CONTENT.preparedFor}
                </p>
                <p className="text-xs text-slate-500">{DEAL_MEMO_CONTENT.date}</p>
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Executive Summary
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  {DEAL_MEMO_CONTENT.executiveSummary}
                </p>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {DEAL_MEMO_CONTENT.keyMetrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg bg-surface-700/50 p-3 text-center"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {m.label}
                    </p>
                    <p className="mt-1 font-display text-sm font-bold text-white">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-red-400">Risks</h4>
                  <ul className="space-y-2">
                    {DEAL_MEMO_CONTENT.risks.map((r) => (
                      <li key={r} className="flex gap-2 text-sm text-slate-400">
                        <span className="text-red-400">•</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-brand-400">
                    Opportunities
                  </h4>
                  <ul className="space-y-2">
                    {DEAL_MEMO_CONTENT.opportunities.map((o) => (
                      <li key={o} className="flex gap-2 text-sm text-slate-400">
                        <span className="text-brand-400">•</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-lg font-semibold text-white">
                Activity Feed
              </h2>
              <div className="flex flex-wrap gap-2">
                {["all", "report", "scenario", "memo", "comp", "alert"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActivityFilter(f);
                        addToast(`Activity filter: ${f}`, "info");
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                        activityFilter === f
                          ? "bg-brand-600 text-white"
                          : "bg-surface-700 text-slate-400 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="space-y-3">
              {filteredActivity.map((item) => (
                <div
                  key={item.id}
                  className="glass-card flex cursor-pointer items-start gap-4 p-4 transition hover:border-brand-700/30"
                  onClick={() =>
                    addToast(`Activity: ${item.message}`, "info")
                  }
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                      item.type === "report"
                        ? "bg-brand-900/50 text-brand-400"
                        : item.type === "scenario"
                          ? "bg-purple-900/50 text-purple-400"
                          : item.type === "memo"
                            ? "bg-blue-900/50 text-blue-400"
                            : item.type === "comp"
                              ? "bg-amber-900/50 text-amber-400"
                              : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {item.type === "report"
                      ? "📊"
                      : item.type === "scenario"
                        ? "🔮"
                        : item.type === "memo"
                          ? "📄"
                          : item.type === "comp"
                            ? "🏘️"
                            : "⚠️"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">{item.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        {new Date(item.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      {item.property && <span>{item.property}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Memo Modal */}
      {memoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setMemoModalOpen(false)}
        >
          <div
            className="glass-card max-h-[80vh] w-full max-w-lg overflow-y-auto p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-white">
              Deal Memo Preview
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Full memo generated for {DEAL_MEMO_CONTENT.property}. In production,
              this renders as a branded PDF via Puppeteer.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>✓ Executive summary</p>
              <p>✓ Key metrics table (8 metrics)</p>
              <p>✓ Risk assessment (3 items)</p>
              <p>✓ Opportunity analysis (3 items)</p>
              <p>✓ Rent comp appendix</p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  handleDownloadPdf();
                  setMemoModalOpen(false);
                }}
                className="btn-primary flex-1"
              >
                Download PDF
              </button>
              <button
                onClick={() => setMemoModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-white">
              Share Deal Memo
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Send a secure link to your lender or partner. Link expires in 7 days.
            </p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Recipient Email
              </label>
              <input
                className="input-field"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Message (optional)
              </label>
              <textarea
                className="input-field h-20 resize-none"
                defaultValue="Hi Sarah — attached is the deal memo for the Maple Ridge acquisition. DSCR is 1.28x at asking. Let me know if you need anything else."
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSendShare} className="btn-primary flex-1">
                Send Memo
              </button>
              <button
                onClick={() => setShareModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
