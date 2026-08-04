import { Home, Tv, Compass, Heart, History, Settings } from 'lucide-react';
import { Link } from 'react-router';
import { PATHS } from '@/routes/paths';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
}

const navigationItems: NavItem[] = [
  { icon: Home, label: 'Trang chủ', path: PATHS.HOME, active: true },
  { icon: Tv, label: 'Stream', path: PATHS.STREAMS.DASHBOARD },
  { icon: Compass, label: 'Khám phá', path: PATHS.HOME },
  { icon: Heart, label: 'Theo dõi', path: PATHS.HOME },
  { icon: History, label: 'Lịch sử xem', path: PATHS.HOME },
  { icon: Settings, label: 'Cài đặt', path: PATHS.SETTING },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`h-full bg-background border-r border-accent flex flex-col justify-between shrink-0
        transition-[width] duration-300 ease-in-out will-change-[width]
        ${isOpen ? 'w-64' : 'w-0 md:w-20'}`}
    >
      <div className="p-4 space-y-6 w-64">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-200
                ${item.active ? 'bg-selection text-primary' : 'text-foreground hover:bg-accent'}`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 ${item.active ? 'text-primary' : 'text-secondary'}`}
              />
              <span
                className={`whitespace-nowrap transition-opacity duration-200
                  ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100 md:hidden'}`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <hr className="border-accent" />
      </div>
    </aside>
  );
}