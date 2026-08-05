import { Link } from "react-router";
import { Radio } from "lucide-react";

import { PATHS } from "@/routes/paths";

export default function Logo() {
  return (
    <Link
      to={PATHS.PUBLIC.HOME}
      className="flex items-center gap-3"
      aria-label="Go to home"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Radio className="h-6 w-6 animate-pulse" />
      </div>
    </Link>
  );
}
