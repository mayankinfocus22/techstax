import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight
} from "lucide-react";

export function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <section 
      className="relative overflow-hidden bg-white border-b border-slate-200 min-h-[calc(100vh-140px)] flex items-center"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 50, y: 50 });
      }}
    >
      {/* Interactive Skyline Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/sydney-hero.jpg"
          alt="Sydney Harbour skyline"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: isHovered ? 'transform 0.4s ease-out' : 'transform 0.8s ease-out'
          }}
          className="h-full w-full object-cover opacity-[0.98] brightness-110 contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white md:bg-gradient-to-r md:from-white/95 md:via-white/70 md:to-transparent" />
      </div>

      <div className="page-shell relative z-10 py-20 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3.5 py-1.5 text-xs font-bold text-brand-700 w-fit">
            <Sparkles size={14} /> Built for Momentum
          </div>
          
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Connect directly with premium opportunities.
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-muted">
            TechStax operates as a streamlined gateway for elite technical professionals. We don't post public jobs; we match our vetted candidate base with prime engagements.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/drop-resume" className="btn-primary px-6 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition">
              Drop your resume <ArrowRight size={16} className="ml-1 shrink-0" />
            </Link>
            <a href="mailto:hello@techstax.dev" className="btn-secondary px-6 py-3.5 text-sm font-bold transition">
              Contact us
            </a>
          </div>


        </div>
      </div>
    </section>
  );
}
