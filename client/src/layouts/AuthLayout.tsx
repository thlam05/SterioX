import { Outlet } from 'react-router';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <Outlet />
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}
