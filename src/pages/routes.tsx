import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./landing/home/home";
import Contact from "./landing/contact/contact";
import About from "./landing/about/about";
import Login from "./auth/login/login";
import ConfirmEmail from "./auth/reset/confirm-email";
import PasswordResetPage from "./auth/reset/password-reset-page";
import Register from "./auth/register/register";
import {
  DashboardHomePage,
  DashboardShopPage,
  DashboardOrdersPage,
  DashboardCartPage,
  DashboardProfilePage,
} from "./dashboard/import-entry";

/* ---------------------------------------------------------------- */

const pagesRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contact",
    element: <Contact />,
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: <Login />,
        index: true,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "reset",
        children: [
          { path: "confirm-email", element: <ConfirmEmail />, index: true },
          { path: "reset-password", element: <PasswordResetPage /> },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    children: [
      { path: "", element: <DashboardHomePage />, index: true },
      { path: "shop", element: <DashboardShopPage /> },
      { path: "orders", element: <DashboardOrdersPage /> },
      { path: "cart", element: <DashboardCartPage /> },
      { path: "profile", element: <DashboardProfilePage /> },
    ],
  },
]);

export default pagesRoutes;
