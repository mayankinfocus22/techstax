import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white transition hover:opacity-90">
      <span className="flex size-9 flex-col items-start justify-center gap-1 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-brand-600 px-2 text-white shadow-[0_0_15px_rgba(229,193,88,0.25)]" aria-hidden="true">
        <span className="h-1 w-5 rounded-full bg-white/90" />
        <span className="h-1 w-3.5 rounded-full bg-white/90" />
        <span className="h-1 w-2 rounded-full bg-white/90" />
      </span>
      <span className="tracking-wide">
        Tech<span className="text-gradient-gold">Stax</span>
      </span>
    </Link>
  );
}
