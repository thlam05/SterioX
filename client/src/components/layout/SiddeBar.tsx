import { Compass, Home, PlayCircle, Settings, SquareLibrary, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router";

const menuItems = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Explore", icon: Compass, to: "/explore" },
  { label: "Library", icon: SquareLibrary, to: "/library" },
  { label: "Profile", icon: UserRound, to: "/profile" },
];

const studioItems = [
  { label: "Live rooms", icon: PlayCircle, to: "/live" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar() {
  const pathname = useLocation().pathname;
  const renderItem = (item: (typeof menuItems)[number]) => {
    const Icon = item.icon;
    const isActive = pathname === item.to;
    return <Link key={item.label} to={item.to} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/15" : "text-secondary hover:bg-primary-light hover:text-foreground"}`}><Icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" /><span>{item.label}</span></Link>;
  };

  return <aside className="sticky top-[68px] hidden h-[calc(100dvh-68px)] w-60 shrink-0 border-r border-border/70 bg-background px-4 py-5 lg:flex lg:flex-col"><div className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Browse</div><nav className="flex flex-col gap-1">{menuItems.map(renderItem)}</nav><div className="mb-4 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Your studio</div><nav className="flex flex-col gap-1">{studioItems.map(renderItem)}</nav><div className="mt-auto rounded-2xl border border-primary/20 bg-primary-light/60 p-4"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><PlayCircle className="h-4 w-4" /></div><p className="text-sm font-extrabold text-foreground">Your room is waiting.</p><p className="mt-1 text-xs leading-5 text-secondary">Bring your audience together whenever you are ready.</p><Link to="/streams/setup" className="mt-3 inline-flex text-xs font-bold text-primary hover:underline">Set up a stream <span className="ml-1">↗</span></Link></div></aside>;
}
