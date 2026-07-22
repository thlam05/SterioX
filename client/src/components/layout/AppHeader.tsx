import { Button } from '@/components/ui/Button';

import Logo from '@/components/ui/Logo';
import { Search, Bell, Flame, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { PATHS } from '@/routes/paths';
import type { UserResponse } from '@/types/userType';

interface AppHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isAuthenticated: boolean;
  user: UserResponse | null;
}

export default function AppHeader({
  isSidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  isAuthenticated,
  user,
}: AppHeaderProps) {
  return (
    <header className="shrink-0 h-16 border-b border-accent bg-background px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="p-2 border-none bg-transparent text-foreground hover:bg-accent"
          onClick={onToggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
        <Logo />
      </div>

      <div className="flex-1 max-w-xl hidden md:flex items-center relative">
        <div className="absolute left-3 text-secondary">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          placeholder="Tìm kiếm kênh, streamer, video..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-accent bg-background text-foreground rounded-xl text-sm"
        />
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="p-2 border-none bg-transparent text-foreground hover:bg-accent relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full"></span>
          </Button>
          <Link to={PATHS.STREAMS.SETUP}>
            <Button
              variant="primary"
              className="hidden sm:flex items-center gap-2"
            >
              <Flame className="w-4 h-4" /> Lên sóng ngay
            </Button>
          </Link>
          <div className="w-9 h-9 rounded-full bg-accent text-foreground flex items-center justify-center font-bold border border-primary">
            <img
              src={user?.avatarImageUrl}
              alt={user?.username || 'Avatar'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to={PATHS.AUTH.LOGIN}>
            <Button className="px-4 py-2 border-accent text-foreground hover:bg-accent">
              Đăng nhập
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
