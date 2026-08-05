import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SiddeBar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-auto px-2 py-2 lg:px-4 lg:py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
