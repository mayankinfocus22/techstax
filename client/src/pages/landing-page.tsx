import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
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
        className="relative flex min-h-[calc(100vh-140px)] items-center overflow-hidden border-b border-white/5 bg-space-950"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 50, y: 50 });
        }}
      >
        {/* Deep glowing background lights */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          {/* Base Background Image (Floats in from right and stays moderately visible) */}
          <img
            src="/sydney-hero.jpg"
            alt="Sydney Harbour skyline"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.6s ease-out"
            }}
            className="h-full w-full object-cover opacity-[0.22] mix-blend-luminosity filter brightness-[0.8] contrast-125 animate-float-right"
          />

          {/* Spotlight Highlight Image (Brightens the picture around cursor on hover) */}
          <img
            src="/sydney-hero.jpg"
            alt=""
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovered ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.6s ease-out, opacity 0.4s ease-out",
              opacity: isHovered ? 0.45 : 0,
              WebkitMaskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`,
              maskImage: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, black 20%, transparent 100%)`
            }}
            className="absolute inset-0 h-full w-full object-cover filter brightness-[0.95] contrast-110 pointer-events-none animate-float-right"
          />

          {/* Custom radial glow tracking mouse position */}
          <div
            className="absolute inset-0 transition-opacity duration-500 opacity-60 pointer-events-none md:opacity-40"
            style={{
              background: `radial-gradient(circle 450px at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15), transparent 80%), 
                           radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(229, 193, 88, 0.08), transparent 70%)`
            }}
          />
          {/* Constant corner glow spots */}
          <div className="absolute top-1/4 right-1/4 size-[400px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 size-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
        </div>

        <div className="page-shell relative z-10 py-20 lg:py-28 animate-float-left">
          <div className="max-w-3xl">
            <h1 className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
              <span className="text-[#F8FAFC] block" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>The build-out is here.</span>
              <span className="mt-2 block text-[#FFFFFF]" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>Someone has to build it.</span>
              <span className="mt-2 block text-[#F4B942]" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>We find that someone.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              TechStax recruits the engineers, builders and operators behind Australia's AI infrastructure — one critical hire or an entire delivery team.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/drop-resume" className="btn-primary px-7 py-4 text-base">
                Drop your CV <ArrowRight size={18} />
              </Link>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=TechStax%20Employer%20Enquiry"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary px-7 py-4 text-base"
              >
                Hiring Talent? Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-space-900 border-b border-white/5 py-20 sm:py-24">
        <div className="page-shell">
          <div className="max-w-5xl">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-6 text-3xl font-extrabold leading-snug tracking-tight text-white sm:text-5xl">
              Most recruiters send CVs.{" "}
              <span className="text-slate-400 font-medium">We've delivered the programs, run the migrations and sat in the war rooms —</span>{" "}
              so we screen candidates the way <span className="text-gradient-gold">your own engineers would.</span>
            </h2>
          </div>
        </div>
      </section>

      <section id="expertise" className="bg-gold-50 border-y border-slate-200 py-20 sm:py-24">
        <div className="page-shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Expertise</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">The whole facility. One partner.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">From the first shovel to 24/7 operations — six practices that cover everything a data centre needs to exist.</p>
          </div>
          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
            {expertise.map(([title, description], index) => (
              <div
                key={title}
                className="group grid gap-3 border-b border-slate-150/80 last:border-b-0 px-6 py-6 transition-all duration-300 hover:bg-gold-50/40 md:grid-cols-[56px_1.1fr_1.4fr_28px] md:items-center md:gap-6"
              >
                <span className="text-xs font-extrabold tracking-[0.14em] text-brand-600">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-extrabold text-ink transition group-hover:text-brand-600 sm:text-xl">{title}</h3>
                <p className="text-sm leading-6 text-slate-500">{description}</p>
                <ArrowRight className="hidden text-slate-400 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-brand-600 md:block" size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-space-900 border-b border-white/5 py-20 text-white sm:py-24">
        <div className="page-shell">
          <p className="eyebrow">Why TechStax</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">Three things we do that most don't.</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.03] hover:border-gold-500/30 hover:shadow-[0_0_30px_rgba(229,193,88,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-space-950 shadow-[0_0_15px_rgba(229,193,88,0.25)]">
                      <Icon size={21} />
                    </span>
                    <span className="text-xs font-bold tracking-[0.16em] text-gold-400">— 0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold leading-snug text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="insights" className="bg-gold-50 border-y border-slate-200 py-20 sm:py-24">
        <div className="page-shell">
          <p className="eyebrow">Intelligence</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">We trade in market truth.</h2>
          <p className="mt-4 text-lg text-slate-600">The best firms in this sector publish what they know. So do we.</p>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl border border-slate-200/50 bg-gradient-to-br from-space-900 to-space-950 p-8 text-white sm:p-10 shadow-float group hover:border-gold-500/30 transition-all duration-500">
              <span className="absolute -right-4 -top-10 text-[9rem] font-black leading-none text-gold-500/5 select-none transition group-hover:text-gold-500/10 duration-500">2026</span>
              <div className="absolute top-8 right-8 size-20 rounded-full bg-gold-500/5 blur-2xl pointer-events-none group-hover:bg-gold-500/15 duration-500" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Flagship report</p>
              <h3 className="mt-3 text-3xl font-extrabold text-white">The Australian Data Centre Salary Guide</h3>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Salaries, day rates and demand signals across every discipline in the build-out — from HV trades to AI platform teams.</p>
              <div className="mt-8">
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
            <div className="grid gap-6">
              <article className="rounded-3xl border border-slate-200 bg-white p-8 hover:border-gold-500/30 transition-all duration-300 shadow-card">
                <p className="eyebrow">Insights</p>
                <h3 className="mt-3 text-xl font-extrabold text-ink">Market briefings</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Short, sharp reads on where talent demand is heading — written for hiring managers, not marketers.</p>
              </article>
              <article className="rounded-3xl border border-slate-200 bg-white p-8 hover:border-gold-500/30 transition-all duration-300 shadow-card">
                <p className="eyebrow">Talent maps</p>
                <h3 className="mt-3 text-xl font-extrabold text-ink">Know before you hire</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">Planning a project team? We'll map the market for your region and discipline before you commit budget.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-space-900 border-b border-white/5 py-20 sm:py-24">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">You get a person, not a portal.</h2>
            <p className="mt-5 leading-7 text-slate-350">The consultant who takes your call knows the difference between a Level 3 and Level 5 commissioning engineer — because pretending otherwise is how bad hires happen.</p>
            <p className="mt-4 leading-7 text-slate-350">One point of contact. Straight answers. Feedback within days, not weeks. And a relationship that outlasts the placement.</p>
          </div>
          <blockquote className="relative rounded-3xl border border-gold-500/20 bg-gold-500/5 p-8 text-xl font-bold leading-relaxed text-white shadow-2xl sm:p-10">
            <span className="absolute left-6 top-1 text-7xl leading-none text-gold-500/10">“</span>
            <p className="relative pt-5">With the right consultant it's not about the margins — it's about the relationship. That's the bar we hold ourselves to on every brief.</p>
            <footer className="mt-6 text-sm font-semibold text-gold-400">The TechStax standard</footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-gold-50 py-20 sm:py-24 border-b border-slate-200">
        <div className="page-shell">
          <div className="relative overflow-hidden rounded-4xl bg-white border border-slate-200 p-8 shadow-card sm:p-12 lg:p-16">
            <div className="absolute right-0 top-0 size-[300px] rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-0 size-[300px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-600">Candidates</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Sixty seconds now. The right call later.</h2>
              <p className="mt-5 leading-7 text-slate-600">Drop your CV once and you're on the radar of every TechStax consultant. When a role genuinely fits, you hear from us — not a mail-merge.</p>
              <Link to="/drop-resume" className="btn-primary mt-8 px-7 py-3.5 inline-flex">Upload your CV <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-space-950 py-20 text-center sm:py-24">
        <div className="page-shell">
          <FileText className="mx-auto size-12 text-gold-500 filter drop-shadow-[0_0_8px_rgba(229,193,88,0.2)]" />
          <h2 className="mx-auto mt-6 max-w-5xl px-1 pb-2 text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
            Hiring? Looking?<span className="mt-2 block text-gradient-gold">Either way — talk to us.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">The build-out won't wait, and neither will the good people. Start the conversation today.</p>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=mayank%40infocusgroup.au&su=TechStax%20enquiry"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-10 px-8 py-4 text-base"
          >
            Start a conversation <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </>
  );
}
