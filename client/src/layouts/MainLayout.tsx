import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/SiddeBar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6">
          <div className="rounded-2xl border border-border bg-accent/40 p-6 text-secondary">
            <Outlet></Outlet>
          </div>
        </main>
      </div>
    </div>
  );
}
