import { streamApi } from "@/api/streamApi";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LivestreamDashboard from "@/pages/LivestreamDashboardPage";
import LivestreamPage from "@/pages/LivestreamPage";
import LivestreamSetupPage from "@/pages/LivestreamSetupPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingPage from "@/pages/SettingPage";
import type { StreamResponse } from "@/types/streamType";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "livestreams/:livestreamId",
        loader: async ({ params }): Promise<StreamResponse | null> => {
          try {
            if (!params.livestreamId) return null;
            const stream = await streamApi.getStreamById(params.livestreamId);
            return stream;
          } catch (err) {
            console.error(err);
            return null;
          }
        },
        element: <LivestreamPage />
      },
      {
        path: "setting",
        element: <SettingPage />
      },
      {
        path: "livestreams/setup",
        element: <LivestreamSetupPage />
      },
      {
        path: "livestreams/dashboard",
        element: <LivestreamDashboard />
      }
    ]
  }
]);