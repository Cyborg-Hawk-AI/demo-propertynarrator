import Link from "next/link";

interface HeaderProps {
  active?: "home" | "demo" | "developers" | "research";
}

export default function Header({ active }: HeaderProps) {
  const links = [
    { href: "/demo", label: "Demo", key: "demo" as const },
    { href: "/developers", label: "Developers", key: "developers" as const },
    { href: "/research", label: "Research", key: "research" as const },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-surface-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-900/30">
            PN
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            Property<span className="text-brand-400">Narrator</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                active === link.key
                  ? "bg-surface-700 text-white"
                  : "text-slate-400 hover:bg-surface-800 hover:text-slate-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/demo" className="btn-primary text-sm">
          Try Demo
        </Link>
      </div>
    </header>
  );
}
