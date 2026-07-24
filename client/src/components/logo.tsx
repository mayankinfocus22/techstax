import { BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
        <BriefcaseBusiness size={19} strokeWidth={2.5} />
      </span>
      Tech<span className="text-brand-600">Stax</span>
    </Link>
  );
}
