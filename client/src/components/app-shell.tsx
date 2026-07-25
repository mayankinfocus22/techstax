import { Link, Outlet } from "react-router-dom";
import { Logo } from "./logo";

export function AppShell() {
  return (
    <div className="min-h-screen bg-space-950 flex flex-col text-slate-100">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-space-950/70 backdrop-blur-md">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex">
            <a href="/#expertise" className="transition hover:text-gold-500">Expertise</a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sparshpoddar9%40gmail.com&su=Employer%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gold-500"
            >
              Employers
            </a>
            <a href="/#insights" className="transition hover:text-gold-500">Insights</a>
            <a href="/#about" className="transition hover:text-gold-500">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/drop-resume" className="btn-primary px-4.5 py-2.5 text-xs sm:text-sm">
              Drop Resume
            </Link>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sparshpoddar9%40gmail.com&su=TechStax%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary hidden px-4.5 py-2.5 text-xs sm:text-sm sm:inline-flex"
            >
              Contact Us
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-space-950/40 text-slate-400">
        <div className="page-shell flex flex-col gap-4 py-8 text-xs sm:text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TechStax. AI Data Centre & Digital Infrastructure Recruitment · Australia.</p>
          <div className="flex gap-5">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sparshpoddar9%40gmail.com&su=TechStax%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold-500 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

