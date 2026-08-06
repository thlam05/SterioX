import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import StreamSetupPage from "@/pages/StreamSetupPage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/streams/setup",
        element: <StreamSetupPage />,
      },
    ],
  },
]);
