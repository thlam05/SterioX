import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SiddeBar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-[100dvh] bg-background">
      <Header />
      <div className="flex min-h-[calc(100dvh-68px)]">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
