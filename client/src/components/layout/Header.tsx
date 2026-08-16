import { Bell } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-[68px] items-center justify-between gap-4 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <Logo />
      <div className="hidden flex-1 md:block" aria-hidden="true" />
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/streams/setup"><Button className="h-10 px-4"><span className="hidden sm:inline">Go live</span><span className="sm:hidden">Live</span></Button></Link>
        <Button variant="ghost" aria-label="Notifications" className="relative h-10 w-10 rounded-xl p-0 text-secondary hover:text-foreground"><Bell className="h-4 w-4" /><span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" /></Button>
        <button type="button" aria-label="Open profile" className="h-9 w-9 overflow-hidden rounded-xl border border-primary bg-primary-light transition hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User avatar" className="h-full w-full object-cover" /></button>
      </div>
    </header>
  );
}
