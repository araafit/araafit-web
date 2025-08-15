import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import pagesRoutes from './pages/routes'
import './style/index.css'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={pagesRoutes} />
    <Toaster/>
  </StrictMode>,
)
