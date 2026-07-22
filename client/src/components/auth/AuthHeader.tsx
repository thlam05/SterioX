import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { Link } from "react-router";

interface AuthHeaderProps {
  text: string;
  buttonText: string;
  buttonTo: string;
}

export default function AuthHeader({ text, buttonText, buttonTo }: AuthHeaderProps) {
  return (
    <header className="px-6 py-4 md:px-12 border-b border-accent flex justify-between items-center bg-background">
      <Logo />
      <div className="hidden md:flex items-center space-x-4 text-sm font-bold">
        <span className="text-secondary">{text}</span>
        <Link to={buttonTo}>
          <Button variant="outline">
            {buttonText}
          </Button>
        </Link>
      </div>
    </header>
  );
}
