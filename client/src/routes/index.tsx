import { streamApi } from "@/api/streamApi";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import StreamDashboard from "@/pages/StreamDashboardPage";
import StreamPage from "@/pages/StreamPage";
import StreamSetupPage from "@/pages/StreamSetupPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingPage from "@/pages/SettingPage";
import { PATHS } from "@/routes/paths";
import { useAuthStore } from "@/stores/authStore";
import type { StreamResponse } from "@/types/streamType";
import { createBrowserRouter, redirect } from "react-router";

export const router = createBrowserRouter([
  {
    path: PATHS.AUTH.LOGIN,
    element: <LoginPage />
  },
  {
    path: PATHS.AUTH.REGISTER,
    element: <RegisterPage />
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
        element: <HomePage />
      },
      {
        path: "streams/:streamId",
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
        element: <StreamPage />
      },
      {
        path: "setting",
        element: <SettingPage />
      },
      {
        path: "streams/setup",
        element: <StreamSetupPage />
      },
      {
        path: "streams/dashboard",
        element: <StreamDashboard />
      }
    ]
  }
]);