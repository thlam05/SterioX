import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
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
        element: <></>
      }
    ]
  }
]);