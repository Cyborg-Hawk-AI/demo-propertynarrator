import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-surface-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            PN
          </span>
          <span className="text-sm font-medium text-slate-400">
            PropertyNarrator — Idea Miner demo
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link
            href="/demo"
            className="text-slate-400 transition hover:text-brand-400"
          >
            Live Demo
          </Link>
          <Link
            href="/developers"
            className="text-slate-400 transition hover:text-brand-400"
          >
            Developer Docs
          </Link>
          <Link
            href="/research"
            className="text-slate-400 transition hover:text-brand-400"
          >
            How we found this idea
          </Link>
        </nav>
        <p className="text-xs text-slate-600">
          Mock demo — no real financial advice
        </p>
      </div>
    </footer>
  );
}
