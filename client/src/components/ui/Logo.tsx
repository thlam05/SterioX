import { Link } from "react-router";
import { Radio } from "lucide-react";

import { PATHS } from "@/routes/paths";

export default function Logo() {
  return (
    <Link
      to={PATHS.PUBLIC.HOME}
      className="group flex items-center gap-3"
      aria-label="Go to home"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
        <Radio className="h-5 w-5" />
      </div>
      <div className="hidden leading-none sm:block"><span className="block text-sm font-black tracking-[-0.04em] text-foreground">Pinklive</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">Live rooms</span></div>
    </Link>
  );
}
