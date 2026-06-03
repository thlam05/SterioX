import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LivestreamDashboard from "@/pages/LivestreamDashboardPage";
import LivestreamPage from "@/pages/LivestreamPage";
import LivestreamSettingPage from "@/pages/LivestreamSettingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingPage from "@/pages/SettingPage";
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
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "",
        element: <HomePage></HomePage>
      },
      {
        path: "/livestream",
        element: <LivestreamPage></LivestreamPage>
      },
      {
        path: "/setting",
        element: <SettingPage></SettingPage>
      },
      {
        path: "/stream/settings",
        element: <LivestreamSettingPage></LivestreamSettingPage>
      },
      {
        path: "/stream/dashboard",
        element: <LivestreamDashboard></LivestreamDashboard>
      }
    ]
  }
]);