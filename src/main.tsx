/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import pagesRoutes from "./pages/routes";
import "./style/index.css";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initGTM } from "./lib/gtm";

// Initialize Google Tag Manager
initGTM(import.meta.env.VITE_GTM_ID);

/* ------------------------------------------------------------------------------------------ */

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, or 404 errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403 ||
          error?.response?.status === 404
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={pagesRoutes} />
        <Toaster />
        {/* Only show devtools in development */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
