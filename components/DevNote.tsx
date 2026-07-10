"use client";

import { useState, useRef, useEffect } from "react";

interface DevNoteProps {
  title: string;
  children: React.ReactNode;
}

export default function DevNote({ title, children }: DevNoteProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-900/60 text-[10px] font-bold text-brand-400 ring-1 ring-brand-700/50 transition hover:bg-brand-800/80 hover:text-brand-300"
        aria-label={`Developer note: ${title}`}
        title="DEV NOTE"
      >
        i
      </button>
      {open && (
        <div className="absolute left-0 top-7 z-50 w-72 animate-fade-in rounded-lg border border-brand-700/40 bg-surface-800 p-3 shadow-xl shadow-black/40">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="rounded bg-brand-900/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400">
              Dev Note
            </span>
            <span className="text-xs font-semibold text-slate-200">{title}</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">{children}</p>
        </div>
      )}
    </div>
  );
}
