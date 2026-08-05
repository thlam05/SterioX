import {
  Compass,
  Home,
  PlayCircle,
  Settings,
  SquareLibrary,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router";

const menuItems = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Explore", icon: Compass, to: "/explore" },
  { label: "Library", icon: SquareLibrary, to: "/library" },
  { label: "Profile", icon: UserRound, to: "/profile" },
  { label: "Live", icon: PlayCircle, to: "/live" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background px-4 py-4 lg:flex lg:flex-col">
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.to;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-secondary hover:bg-primary-light hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 rounded-2xl border border-border bg-accent/60 p-3">
        <p className="text-sm font-semibold text-foreground">
          Expand your experience
        </p>
        <p className="mt-1 text-xs text-secondary">
          Follow and interact with the channels you love.
        </p>
      </div>
    </aside>
  );
}
