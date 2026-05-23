import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/Logo";
import { useState } from "react";
import {
  Home,
  Tv,
  Compass,
  Heart,
  History,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  User,
  Flame,
  Eye,
} from "lucide-react";
import { Outlet } from "react-router";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { icon: Home, label: "Trang chủ", active: true },
    { icon: Tv, label: "Livestream" },
    { icon: Compass, label: "Khám phá" },
    { icon: Heart, label: "Theo dõi" },
    { icon: History, label: "Lịch sử xem" },
    { icon: Settings, label: "Cài đặt" }
  ];

  const channels = [
    { name: "Dev_Master", viewers: "4.5k", live: true, avatar: "D" },
    { name: "TechReviewer", viewers: "2.1k", live: true, avatar: "T" },
    { name: "AudioSpace", viewers: "920", live: false, avatar: "A" },
    { name: "DesignLife", viewers: "1.2k", live: true, avatar: "D" },
  ];

  return (
    // Sửa 1: Thêm h-screen và overflow-hidden ở bọc ngoài cùng để cố định khung màn hình ứng dụng
    <div className="h-screen w-full bg-background text-foreground font-sans selection:bg-selection flex flex-col overflow-hidden">

      {/* Header (Giữ nguyên) */}
      <header className="shrink-0 h-16 border-b border-accent bg-background px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="p-2 border-none bg-transparent text-foreground hover:bg-accent"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <Logo />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:flex items-center relative">
          <div className="absolute left-3 text-secondary">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="text"
            placeholder="Tìm kiếm kênh, streamer, video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent bg-background text-foreground rounded-xl text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="p-2 border-none bg-transparent text-foreground hover:bg-accent relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <Button variant="primary" className="hidden sm:flex items-center gap-2">
            <Flame className="w-4 h-4" /> Lên sóng ngay
          </Button>
          <div className="w-9 h-9 rounded-full bg-accent text-foreground flex items-center justify-center font-bold border border-primary">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Sửa 2: Khống chế chiều cao vùng chứa bên dưới bằng chiều cao còn lại của màn hình */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden relative">

        {/* Sửa 3: Thay fixed/sticky thành h-full và thêm tự cuộn độc lập cho sidebar nếu menu quá dài */}
        <aside className={`h-full bg-background border-r border-accent transition-all duration-300 flex flex-col justify-between overflow-y-auto shrink-0 ${isSidebarOpen ? "w-64" : "w-0 md:w-20"}`}>
          <div className="p-4 space-y-6">
            {/* Main Navigation */}
            <nav className="space-y-1">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${item.active ? "bg-selection text-primary" : "text-foreground hover:bg-accent"}`}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? "text-primary" : "text-secondary"}`} />
                  <span className={!isSidebarOpen ? "md:hidden" : ""}>{item.label}</span>
                </a>
              ))}
            </nav>

            <hr className="border-accent" />

            {/* Recommended Channels */}
            <div className={!isSidebarOpen ? "md:hidden" : ""}>
              <h3 className="px-3 text-xs font-bold text-secondary tracking-wider mb-3">Kênh đang theo dõi</h3>
              <div className="space-y-2">
                {channels.map((channel, index) => (
                  <a key={index} href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm border border-accent">
                        {channel.avatar}
                      </div>
                      <div className="text-sm font-medium">
                        <p className="text-foreground truncate max-w-[110px]">{channel.name}</p>
                        {channel.live && <p className="text-xs text-secondary flex items-center gap-1"><Eye className="w-3 h-3 text-danger" /> {channel.viewers}</p>}
                      </div>
                    </div>
                    {channel.live && <div className="w-2 h-2 rounded-full bg-danger"></div>}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Space - Giờ đây chỉ có vùng này được cuộn khi content trong Outlet dài */}
        <main className="flex-1 bg-background p-4 md:p-8 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}