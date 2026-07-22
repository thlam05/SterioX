import { Outlet } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import AppHeader from "@/components/layout/AppHeader";
import Sidebar from "@/components/layout/Sidebar";
import useTokenIntrospection from "@/hooks/useTokenIntrospection";

export default function MainLayout() {
  const { user, isAuthenticated } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useTokenIntrospection();

  return (
    <div className="h-screen w-full bg-background text-foreground font-sans selection:bg-selection flex flex-col overflow-hidden">
      <AppHeader
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isAuthenticated={isAuthenticated}
        user={user}
      />

      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="flex-1 bg-background p-4 md:p-8 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
