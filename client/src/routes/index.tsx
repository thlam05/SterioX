import Login from "@/pages/login";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    children: [
      {
        path: "/login",
        element: <Login />
      }

    ]
  }
]);