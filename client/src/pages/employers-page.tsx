import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, XCircle, Check } from "lucide-react";
import { api, ApiError } from "../lib/api";

export function EmployersPage() {
  const [activeModel, setActiveModel] = useState<number>(1); // Default to Contingent Search (index 1)

  // Form states
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [engagementType, setEngagementType] = useState("Not sure yet");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100
    });
  };

  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/brief/submit", {
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        engagementType,
        role: role.trim(),
        notes: notes.trim() || null
      }, false);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const models = [
    {
      idx: "01",
      title: "Retained Search",
      desc: "For senior and leadership roles where the market has to be worked, not skimmed. Exclusive, confidential, staged fees."
    },
    {
      idx: "02",
      title: "Contingent Search",
      desc: "For permanent hires with a clear spec and a live requirement. You only pay when we land the hire."
    },
    {
      idx: "03",
      title: "Contract & Interim",
      desc: "For fast mobilisation into projects with defined timelines. Rate-managed, compliance-handled, on site in days."
    },
    {
      idx: "04",
      title: "Project Team Build",
      desc: "Entire delivery teams - designed, sourced and onboarded together for a build, a migration or a commissioning window."
    },
    {
      idx: "05",
      title: "Embedded / RPO",
      desc: "For scale programs where we sit alongside your talent acquisition function as a dedicated capability."
    }
  ];

  const steps = [
    {
      step: "STEP 01",
      title: "Brief",
      desc: "A 30-minute call. We take the technical requirements - and the human context that never makes the JD."
    },
    {
      step: "STEP 02",
      title: "Market map",
      desc: "We identify who's in-market, who's approachable, and who fits - before we approach anyone."
    },
    {
      step: "STEP 03",
      title: "Screen",
      desc: "Technical assessment by consultants who've worked in the discipline. Every candidate, every time."
    },
    {
      step: "STEP 04",
      title: "Shortlist",
      desc: "Three to five candidates who match the role - not just the keywords. With honest strengths and gaps."
    },
    {
      step: "STEP 05",
      title: "Close",
      desc: "Offer management, reference checks, counter-offer prep and onboarding support - through to day one and beyond."
    }
  ];

  const quotes = [
    {
      quote: "They filled a role two agencies had sat on for months - shortlist in two days, offer signed in two weeks. It changed how we buy recruitment.",
      author: "Placeholder - Head of Engineering",
      company: "Hyperscale operator, Sydney"
    },
    {
      quote: "The technical screening is the differentiator. We stopped burning cycles on candidates who couldn't do the job - every CV they sent could commission a Tier IV.",
      author: "Placeholder - Program Director",
      company: "National build program"
    },
    {
      quote: "It doesn't feel like a recruiter engagement. It feels like an in-house TA lead who happens to sit outside our building - same context, same standards.",
      author: "Placeholder - Chief of Staff",
      company: "Sovereign cloud program"
    }
  ];

  return (
    <div className="w-full bg-space-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      
      {/* 1. HERO SECTION (Dark Mode) */}
      <header 
        className="relative py-24 lg:py-32 border-b border-white/5 bg-space-950 overflow-hidden z-10"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 50, y: 50 });
        }}
      >
        {/* Dynamic Background Glows */}
        <div className="absolute top-0 right-1/4 size-[400px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/4 size-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none z-0" />
        
        {/* Mouse tracking radial glow */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none z-0 ${
            isHovered ? "opacity-60 md:opacity-40" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle 450px at ${mousePos.x}% ${mousePos.y}%, rgba(99, 102, 241, 0.15), transparent 80%), 
                         radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(229, 193, 88, 0.08), transparent 70%)`
          }}
        />
        
        <div className="page-shell relative z-10">
          <div className="max-w-4xl">
            <span className="eyebrow block mb-4">For Employers</span>
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
              <span className="text-[#F8FAFC] block">You send the brief.</span>
              <span className="mt-2 block text-slate-400">We do the market.</span>
              <span className="mt-2 block text-gradient-gold">You do the hire.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
              TechStax recruits the engineers, builders and operators behind Australia's AI infrastructure - one critical hire or an entire delivery team.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#brief-form-section" className="btn-primary px-7 py-4 text-base">
                Send us a brief <ArrowRight size={18} />
              </a>
              <a href="#brief-form-section" className="btn-secondary px-7 py-4 text-base">
                Book a 15-minute call
              </a>
            </div>
          </div>
        </div>
      </header>


      {/* 3. MANIFESTO / PROBLEM (Cream Mode) */}
      <section className="relative py-20 sm:py-24 border-y border-slate-200 bg-gold-50 text-ink">
        <div className="page-shell">
          <div className="max-w-5xl reveal">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700 block mb-4 font-mono">The market right now</span>
            <h2 className="text-3xl font-extrabold leading-snug tracking-tight sm:text-5xl text-ink">
              Every operator is chasing <span className="text-gold-700 bg-gold-100/60 px-1 py-0.5 rounded">the same forty people.</span>{" "}
              <span className="text-slate-600 font-medium">The talent pool didn't scale with the build-out - which means the difference between hitting your milestone and missing it is</span>{" "}
              <span className="text-ink font-semibold">who you know, and who they trust.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* 4. ENGAGEMENT MODELS (Dark Mode) */}
      <section className="relative py-20 sm:py-24 bg-space-900 border-b border-white/5 text-slate-100">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 size-[400px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none z-0" />
        
        <div className="page-shell relative z-10">
          <div className="max-w-3xl mb-12 reveal">
            <span className="eyebrow block mb-4">Engage us</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">One role, one team, one program.</h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              Four ways to work with us. Pick the one that fits your brief - or ask, and we'll tell you which one we'd pick for you.
            </p>
          </div>

          <div className="bg-space-950/60 border border-white/5 rounded-3xl divide-y divide-white/5 p-4 shadow-card reveal">
            {models.map((model, index) => (
              <div
                key={model.idx}
                onClick={() => setActiveModel(index)}
                className={`group flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeModel === index 
                    ? "bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.01)]" 
                    : "hover:bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-sm font-bold tracking-[0.16em] text-gold-400">{model.idx}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{model.title}</h3>
                    <p className="text-sm leading-6 text-slate-400 max-w-3xl">{model.desc}</p>
                  </div>
                </div>
                <div className={`size-10 rounded-full flex items-center justify-center border transition-all duration-300 self-end md:self-auto ${
                  activeModel === index 
                    ? "bg-gold-500 border-gold-500 text-space-950" 
                    : "border-white/15 text-slate-400 group-hover:border-white/30 group-hover:text-white"
                }`}>
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROCESS (Cream Mode) */}
      <section className="relative py-20 sm:py-24 border-y border-slate-200 bg-gold-50 text-ink">
        <div className="page-shell">
          <div className="max-w-3xl mb-12 reveal">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700 block mb-4 font-mono">From brief to hire</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Weeks, not months.</h2>
            <p className="mt-4 text-lg text-slate-600 leading-8">
              Five steps. Every brief goes through the same rigour, whether it's a single role or a fifty-person mobilisation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((item) => (
              <div
                key={item.step}
                className="bg-white border border-slate-200/80 shadow-card p-6 rounded-3xl hover:-translate-y-1 hover:border-gold-500/20 duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-[0.16em] text-gold-700">{item.step}</span>
                    <span className="size-2 rounded-full bg-gold-600 shadow-[0_0_8px_rgba(180,120,40,0.4)]" />
                  </div>
                  <h3 className="text-lg font-bold text-ink mb-3">{item.title}</h3>
                  <p className="text-xs leading-5 text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SCREENING BAR (Dark Mode) */}
      <section className="relative py-20 sm:py-24 bg-space-900 border-y border-white/5 text-slate-100">
        <div className="page-shell">
          <div className="max-w-3xl mb-12 reveal">
            <span className="eyebrow block mb-4">Our screening bar</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">The CVs we send. The ones we don't.</h2>
            <p className="mt-4 text-lg text-slate-400 leading-8">
              Every candidate in your inbox has cleared the same bar. That's the whole promise - and it's why our shortlists are three deep instead of thirty.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* INBOX (Dark Card) */}
            <div className="bg-space-950/60 border border-white/5 p-8 md:p-10 rounded-3xl shadow-card reveal">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                <span className="grid size-10 place-items-center rounded-xl bg-white/5 text-gold-400 border border-white/10">
                  <CheckCircle2 size={22} />
                </span>
                <h3 className="text-xl font-bold text-white">What reaches your inbox</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Project experience at the required scale, verified against real work - not job titles.",
                  "Technical depth we've validated in conversation with someone from the discipline.",
                  "Salary and day-rate alignment already confirmed inside your brief.",
                  "Location, mobility and visa status already checked and documented.",
                  "Notice period known and factored into your start date.",
                  "Cultural fit indicators - how they work, what they've walked away from, why they're moving."
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-slate-300">
                    <span className="text-gold-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FILTERED (Muted Dark Card) */}
            <div className="bg-space-950/20 border border-white/5 p-8 md:p-10 rounded-3xl shadow-card reveal">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                <span className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-400">
                  <XCircle size={22} />
                </span>
                <h3 className="text-xl font-bold text-white/90">What never does</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Anyone we haven't spoken to on a proper screening call.",
                  "Anyone who couldn't answer a technical question in their own words.",
                  "Anyone chasing $50k above market with no supporting story.",
                  "Anyone who ghosted a screening call or missed a call-back.",
                  "Anyone whose employment timeline doesn't add up.",
                  "Anyone we've placed elsewhere in the last twelve weeks."
                ].map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-slate-400">
                    <span className="text-red-500/80 font-bold shrink-0 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS (Cream Mode) */}
      <section className="relative py-20 sm:py-24 border-y border-slate-200 bg-gold-50 text-ink">
        <div className="page-shell">
          <div className="max-w-3xl mb-12 reveal">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700 block mb-4 font-mono">What hiring managers say</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-ink">The relationship outlasts the placement.</h2>
            <p className="mt-4 text-lg text-slate-600 leading-8">
              Real quotes from real hiring managers will live here at launch. These are the shape and tone we're aiming for.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {quotes.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200/80 rounded-3xl p-8 hover:-translate-y-1.5 duration-300 hover:border-gold-500/30 hover:shadow-card flex flex-col justify-between"
              >
                <div>
                  <span className="text-6xl text-gold-500/20 block leading-none font-display mb-4">“</span>
                  <blockquote className="text-base text-slate-800 leading-relaxed font-medium mb-8">
                    {item.quote}
                  </blockquote>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <cite className="not-italic text-sm font-semibold text-ink block">{item.author}</cite>
                  <span className="text-xs text-slate-500 block mt-1">{item.company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BRIEF FORM (Dark Mode) */}
      <section id="brief-form-section" className="relative py-20 sm:py-24 bg-space-950 border-t border-white/5 text-white">
        <div className="page-shell">
          <div className="panel bg-space-900/60 border-white/5 p-8 md:p-16 relative overflow-hidden">
            {/* Dark form backdrop glow */}
            <div className="absolute -bottom-20 -left-20 size-[500px] rounded-full bg-gold-500/5 blur-[150px] pointer-events-none" />
            
            <div className="grid gap-12 lg:grid-cols-2 items-start relative z-10 text-white">
              <div className="max-w-lg">
                <span className="eyebrow block mb-4">Ready?</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Send us the brief.<br /><span className="text-gradient-gold">We'll take it from here.</span>
                </h2>
                <p className="mt-6 text-base text-slate-400 leading-7">
                  A 30-minute call. No sales pitch. Just what you need, what the market looks like, and how fast we can help.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Response within 24 hours, weekdays",
                    "Confidential - no approaches without your sign-off",
                    "No obligation to engage after the call"
                  ].map((promise) => (
                    <li key={promise} className="flex gap-3 text-sm text-slate-300 items-start">
                      <span className="text-gold-500 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{promise}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {submitted ? (
                  <div className="panel bg-white/[0.01] border-white/5 flex flex-col items-center justify-center text-center p-8 sm:p-12">
                    <div className="size-16 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 text-gold-500">
                      <Check size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Brief Received!</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
                      Thank you, <b className="text-white">{name}</b>. We have successfully registered your company brief for <b className="text-white">{company}</b>. Our team will review your requirements for <b className="text-white">{role}</b> and contact you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn-primary px-6 py-3 text-sm"
                    >
                      Send another brief
                    </button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleFormSubmit}>
                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex gap-2">
                        <XCircle size={18} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="fname" className="label">Your name</label>
                        <input
                          id="fname"
                          type="text"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input animate-none"
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="fcompany" className="label">Company</label>
                        <input
                          id="fcompany"
                          type="text"
                          placeholder="Acme Data Centres"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="input animate-none"
                          disabled={submitting}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="femail" className="label">Work email</label>
                        <input
                          id="femail"
                          type="email"
                          placeholder="jane@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input animate-none"
                          disabled={submitting}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="ftype" className="label">Engagement type</label>
                        <select
                          id="ftype"
                          value={engagementType}
                          onChange={(e) => setEngagementType(e.target.value)}
                          className="input appearance-none bg-space-950"
                          disabled={submitting}
                          style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem', backgroundRepeat: 'no-repeat' }}
                        >
                          <option value="Not sure yet" className="bg-space-950 text-slate-100">Not sure yet</option>
                          <option value="Retained search" className="bg-space-950 text-slate-100">Retained search</option>
                          <option value="Contingent search" className="bg-space-950 text-slate-100">Contingent search</option>
                          <option value="Contract / interim" className="bg-space-950 text-slate-100">Contract / interim</option>
                          <option value="Project team build" className="bg-space-950 text-slate-100">Project team build</option>
                          <option value="Embedded / RPO" className="bg-space-950 text-slate-100">Embedded / RPO</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="frole" className="label">Role or program you're hiring for</label>
                      <input
                        id="frole"
                        type="text"
                        placeholder="e.g. Senior Commissioning Engineer, Sydney"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="input animate-none"
                        disabled={submitting}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="fnotes" className="label">Anything we should know (optional)</label>
                      <textarea
                        id="fnotes"
                        placeholder="Timeline, budget context, why it's urgent - whatever helps us respond well."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="input min-h-[110px]"
                        disabled={submitting}
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="btn-primary w-full py-3.5 text-base flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending..." : "Send brief"}
                      {!submitting && <ArrowRight size={18} />}
                    </button>
                    <small className="block text-center text-xs text-slate-500 mt-4">
                      Or email <a href="mailto:contact@techstax.com.au" className="text-gold-500 hover:underline">contact@techstax.com.au</a>
                    </small>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. END LINE (Dark Mode) */}
      <div className="relative py-20 bg-space-950 text-center border-t border-white/5">
        <div className="page-shell">
          <h2 className="text-3xl font-extrabold text-white leading-snug sm:text-4xl max-w-2xl mx-auto">
            The build-out won't wait. <span className="text-gradient-gold">Neither will the good people.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-base">Start the conversation today.</p>
        </div>
      </div>
    </div>
  );
}
