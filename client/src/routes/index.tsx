import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import CreatorFlowPage from "@/pages/CreatorFlowPage";
import { createBrowserRouter, Navigate } from "react-router";

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
        element: <Navigate to="/creator/streams/room-aurora/new" replace />,
      },
      {
        path: "/creator",
        element: <CreatorFlowPage />,
      },
      {
        path: "/creator/streams/:streamId/new",
        element: <CreatorFlowPage />,
      },
      {
        path: "/creator/streams/:streamId/setup",
        element: <CreatorFlowPage />,
      },
      {
        path: "/creator/streams/:streamId/check",
        element: <CreatorFlowPage />,
      },
      {
        path: "/creator/streams/:streamId/live",
        element: <CreatorFlowPage />,
      },
      {
        path: "/creator/streams/:streamId/summary",
        element: <CreatorFlowPage />,
      },
    ],
  },
]);
