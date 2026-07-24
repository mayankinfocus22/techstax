import { Link, Outlet } from "react-router-dom";
import { Logo } from "./logo";

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <a href="/#expertise" className="transition hover:text-brand-600">Expertise</a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=Employer%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-brand-600"
            >
              Employers
            </a>
            <a href="/#insights" className="transition hover:text-brand-600">Insights</a>
            <a href="/#about" className="transition hover:text-brand-600">About</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/drop-resume" className="btn-primary px-4 py-2 text-sm">
              Drop Resume
            </Link>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=TechStax%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary hidden px-4 py-2 text-sm sm:inline-flex"
            >
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
          <p>© {new Date().getFullYear()} TechStax. AI Data Centre & Digital Infrastructure Recruitment · Australia.</p>
          <div className="flex gap-5">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=TechStax%20enquiry"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-600"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

