import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      <Logo />

      <div className="flex-1 max-w-xl relative">
        <Input
          type="text"
          placeholder="Search something..."
          className="w-full pr-10 pl-4 py-2 bg-accent/50 border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="primary" className="h-10 border-accent-foreground">
          <span>Go live</span>
        </Button>

        <Button
          variant="ghost"
          size="md"
          className="relative h-10 w-10 rounded-full p-0 shrink-0"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5 text-secondary transition-colors hover:text-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <button
          type="button"
          className="h-10 w-10 shrink-0 rounded-full border-2 border-primary bg-primary-light overflow-hidden transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
