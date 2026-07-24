import { Link, Outlet } from "react-router-dom";
import { Logo } from "./logo";

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/drop-resume" className="btn-primary px-4 py-2 text-sm">
              Drop Resume
            </Link>
            <a href="mailto:hello@techstax.dev" className="btn-secondary px-4 py-2 text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="page-shell flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TechStax. Work that fits.</p>
          <div className="flex gap-5">
            <a href="mailto:hello@techstax.dev" className="hover:text-brand-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

