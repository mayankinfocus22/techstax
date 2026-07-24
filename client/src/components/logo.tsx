import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink">
      <span className="flex size-9 flex-col items-start justify-center gap-1 rounded-xl bg-brand-600 px-2 text-white shadow-sm" aria-hidden="true">
        <span className="h-1 w-5 rounded-full bg-white" />
        <span className="h-1 w-3.5 rounded-full bg-white" />
        <span className="h-1 w-2 rounded-full bg-white" />
      </span>
      <span>
        Tech<span className="text-brand-600">Stax</span>
      </span>
    </Link>
  );
}
