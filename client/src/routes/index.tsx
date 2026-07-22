import { streamApi } from '@/api/streamApi';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import StreamDashboard from '@/pages/StreamDashboardPage';
import StreamPage from '@/pages/StreamPage';
import StreamSetupPage from '@/pages/StreamSetupPage';
import SettingPage from '@/pages/SettingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/stores/authStore';
import type { StreamResponse } from '@/types/streamType';
import { createBrowserRouter, Navigate, redirect } from 'react-router';
import AuthLayout from '@/layouts/AuthLayout';

export const router = createBrowserRouter([
  {
    path: PATHS.AUTH.ROOT,
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to={PATHS.AUTH.LOGIN} replace /> },
      {
        path: 'login',
        element: <LoginPage />,
        handle: {
          title: 'Đăng nhập SterioX',
          subtitle:
            'Chào mừng bạn trở lại với nền tảng livestream công nghệ đỉnh cao.',
          headerText: 'Chưa có tài khoản?',
          headerButtonText: 'Đăng ký',
          headerButtonTo: PATHS.AUTH.REGISTER,
          socialAction: 'Đăng nhập',
          mobileText: 'Chưa có tài khoản?',
          mobileLabel: 'Đăng ký',
          mobileTo: PATHS.AUTH.REGISTER,
        },
      },
      {
        path: 'register',
        element: <RegisterPage />,
        handle: {
          title: 'Tạo tài khoản SterioX',
          subtitle:
            'Tham gia cùng chúng tôi để trải nghiệm các buổi livestream công nghệ đỉnh cao mỗi ngày.',
          headerText: 'Đã có tài khoản?',
          headerButtonText: 'Đăng nhập',
          headerButtonTo: PATHS.AUTH.LOGIN,
          socialAction: 'Đăng ký',
          mobileText: 'Đã có tài khoản?',
          mobileLabel: 'Đăng nhập',
          mobileTo: PATHS.AUTH.LOGIN,
        },
      },
    ],
  },
  {
    path: PATHS.HOME,
    loader: () => {
      const { isAuthenticated } = useAuthStore.getState();
      if (!isAuthenticated) return redirect(PATHS.AUTH.LOGIN);
      return null;
    },
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'streams/:streamId',
        loader: async ({ params }): Promise<StreamResponse | null> => {
          try {
            if (!params.streamId) return null;
            const stream = await streamApi.getStreamById(params.streamId);
            return stream;
          } catch (err) {
            console.error(err);
            return null;
          }
        },
        element: <StreamPage />,
      },
      {
        path: 'setting',
        element: <SettingPage />,
      },
      {
        path: 'streams/setup',
        element: <StreamSetupPage />,
      },
      {
        path: 'streams/dashboard',
        element: <StreamDashboard />,
      },
    ],
  },
]);
