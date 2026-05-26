import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LiveStreamPage from "@/pages/LiveStreamPage";
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
        element: <LiveStreamPage></LiveStreamPage>
      },
      {
        path: "/setting",
        element: <SettingPage></SettingPage>
      }
    ]
  }
]);