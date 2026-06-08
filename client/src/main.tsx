import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { router } from "@/routes/index";
import { RouterProvider } from 'react-router';
import { SocketProvider } from './context/SocketContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>,
)
