import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Sparkles,
  UploadCloud,
  Users
} from "lucide-react";

const expertise = [
  ["Leadership & Delivery", "The directors and program leads who carry a build from business case to handover."],
  ["Design & Engineering", "The engineers who decide how a facility stands, cools, powers and survives."],
  ["Construction & Commissioning", "The people who build it — and the people who prove it works before go-live."],
  ["Power & Cooling", "HV, UPS, generators, chillers and BMS — the trades that keep the lights and racks on."],
  ["Cloud, AI & ICT", "The platform, network and ML engineers who turn a building into compute."],
  ["Operations & Critical Environments", "The teams who own uptime, every hour, for the life of the facility."]
];

const differentiators = [
  {
    icon: CheckCircle2,
    title: "Technical screening, done by technologists",
    description: "Every candidate is assessed by people who've delivered infrastructure programs. If they reach your inbox, they can do the job."
  },
  {
    icon: Users,
    title: "One consultant, start to finish",
    description: "No handoffs and no resourcers you've never met. The person who takes your brief is the person who fills it — and picks up the phone next year."
  },
  {
    icon: BarChart3,
    title: "Teams, not just placements",
    description: "Need a commissioning crew or an entire project team? We design, source and mobilise whole teams as one engagement."
  }
];

export function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <>
      <section
        className="relative flex min-h-[calc(100vh-140px)] items-center overflow-hidden border-b border-slate-200 bg-white"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 50, y: 50 });
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 select-none">
          <img
            src="/sydney-hero.jpg"
            alt="Sydney Harbour skyline"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? "scale(1.03)" : "scale(1)",
              transition: isHovered ? "transform 0.4s ease-out" : "transform 0.8s ease-out"
            }}
            className="h-full w-full object-cover opacity-[0.98] brightness-110 contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white md:bg-gradient-to-r md:from-white/95 md:via-white/70 md:to-transparent" />
        </div>

        <div className="page-shell relative z-10 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700">
              <Sparkles size={14} />
              AI Data Centre & Digital Infrastructure Recruitment · Australia
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-5xl lg:text-7xl">
              The build-out is here.
              <span className="mt-1 block text-slate-500">Someone has to build it.</span>
              <span className="mt-1 block text-brand-600">We find that someone.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              TechStax recruits the engineers, builders and operators behind Australia's AI infrastructure — one critical hire or an entire delivery team.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="bg-white py-20 sm:py-24">
        <div className="page-shell">
          <div className="max-w-5xl">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              Most recruiters send CVs.{" "}
              <span className="text-slate-500">We've delivered the programs, run the migrations and sat in the war rooms —</span>{" "}
              so we screen candidates the way <span className="text-brand-600">your own engineers would.</span>
            </h2>
          </div>
        </div>
      </section>

      <section id="expertise" className="border-y border-slate-200 bg-surface py-20 sm:py-24">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Expertise</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">The whole facility. One partner.</h2>
            <p className="mt-4 text-lg leading-8 text-muted">From the first shovel to 24/7 operations — six practices that cover everything a data centre needs to exist.</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            {expertise.map(([title, description], index) => (
              <div key={title} className="group grid gap-3 border-b border-slate-200 px-6 py-6 transition last:border-b-0 hover:bg-brand-50/50 md:grid-cols-[56px_1fr_1.4fr_28px] md:items-center md:gap-6">
                <span className="text-xs font-extrabold tracking-[0.14em] text-brand-600">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-extrabold text-ink sm:text-xl">{title}</h3>
                <p className="text-sm leading-6 text-muted">{description}</p>
                <ArrowRight className="hidden text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600 md:block" size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 text-white sm:py-24">
        <div className="page-shell">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Why TechStax</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Three things we do that most don't.</h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-1 hover:bg-white/[0.07]">
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-brand-600"><Icon size={21} /></span>
                    <span className="text-xs font-bold tracking-[0.16em] text-blue-300">— 0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold leading-snug">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="insights" className="border-y border-slate-200 bg-surface py-20 sm:py-24">
        <div className="page-shell">
          <p className="eyebrow">Intelligence</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">We trade in market truth.</h2>
          <p className="mt-4 text-lg text-muted">The best firms in this sector publish what they know. So do we.</p>
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
              <span className="absolute -right-4 -top-10 text-[9rem] font-black leading-none text-brand-500/10">2026</span>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Flagship report</p>
              <h3 className="mt-3 text-3xl font-extrabold">The Australian Data Centre Salary Guide</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Salaries, day rates and demand signals across every discipline in the build-out — from HV trades to AI platform teams.</p>
              <div className="mt-7">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=Salary%20Guide%20Early%20Access"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Get early access
                </a>
              </div>
            </article>
            <div className="grid gap-5">
              <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <p className="eyebrow">Insights</p><h3 className="mt-3 text-xl font-extrabold text-ink">Market briefings</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Short, sharp reads on where talent demand is heading — written for hiring managers, not marketers.</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
                <p className="eyebrow">Talent maps</p><h3 className="mt-3 text-xl font-extrabold text-ink">Know before you hire</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Planning a project team? We'll map the market for your region and discipline before you commit budget.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">You get a person, not a portal.</h2>
            <p className="mt-5 leading-7 text-muted">The consultant who takes your call knows the difference between a Level 3 and Level 5 commissioning engineer — because pretending otherwise is how bad hires happen.</p>
            <p className="mt-4 leading-7 text-muted">One point of contact. Straight answers. Feedback within days, not weeks. And a relationship that outlasts the placement.</p>
          </div>
          <blockquote className="relative rounded-3xl border border-brand-100 bg-brand-50 p-8 text-xl font-bold leading-relaxed text-ink shadow-card sm:p-10">
            <span className="absolute left-6 top-1 text-7xl leading-none text-brand-200">“</span>
            <p className="relative pt-5">With the right consultant it's not about the margins — it's about the relationship. That's the bar we hold ourselves to on every brief.</p>
            <footer className="mt-6 text-sm font-semibold text-brand-700">The TechStax standard</footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-white pb-20 sm:pb-24">
        <div className="page-shell">
          <div className="grid items-center gap-10 overflow-hidden rounded-4xl bg-ink p-8 text-white shadow-float sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Candidates</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Sixty seconds now. The right call later.</h2>
              <p className="mt-5 max-w-xl leading-7 text-slate-300">Drop your CV once and you're on the radar of every TechStax consultant. When a role genuinely fits, you hear from us — not a mail-merge.</p>
              <Link to="/drop-resume" className="btn-primary mt-7 px-6 py-3.5">Upload your CV <ArrowRight size={16} /></Link>
            </div>
            <Link to="/drop-resume" className="group rounded-3xl border-2 border-dashed border-brand-500 bg-brand-500/10 p-10 text-center transition hover:scale-[1.01] hover:bg-brand-500/15">
              <UploadCloud className="mx-auto size-12 text-blue-300 transition group-hover:-translate-y-1" />
              <strong className="mt-5 block text-lg">Drag & drop your resume</strong>
              <span className="mt-2 block text-sm text-slate-400">PDF or DOCX · up to 5MB · private & secure</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-surface py-20 text-center sm:py-24">
        <div className="page-shell">
          <FileText className="mx-auto size-10 text-brand-600" />
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Hiring? Looking?<span className="mt-1 block text-brand-600">Either way — talk to us.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted">The build-out won't wait, and neither will the good people. Start the conversation today.</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=TechStax%20enquiry"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-8 px-7 py-3.5"
          >
            Start a conversation <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
