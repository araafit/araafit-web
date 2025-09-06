import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./landing/home/home";
import Contact from "./landing/contact/contact";
import About from "./landing/about/about";
import Login from "./user-auth/login/login";
import ConfirmEmail from "./user-auth/reset/confirm-email";
import PasswordResetPage from "./user-auth/reset/password-reset-page";
import Register from "./user-auth/register/register";
import {
  DashboardHomePage,
  DashboardShopPage,
  DashboardShopFabricDetailPage,
  DashboardShopDressDetailPage,
  DashboardOrdersPage,
  DashboardCartPage,
  DashboardCartCheckout,
  DashboardProfilePage,
  DashboardEditMeasurementPage,
  DashboardOrderDetailPage,
} from "./user-dashboard/import-entry";
import GetMeasured from "./get-measured/get-measured";

/* ---------------------------------------------------------------- */

/**
 * Pages route system
 */
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
    path: "get-measured",
    element: <GetMeasured />,
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
      {
        path: "shop",
        children: [
          { path: "", element: <DashboardShopPage />, index: true },
          {
            path: "dress/:itemName",
            element: <DashboardShopDressDetailPage />,
          },
          {
            path: "fabric/:itemName",
            element: <DashboardShopFabricDetailPage />,
          },
        ],
      },
      {
        path: "orders",
        children: [
          { path: "", element: <DashboardOrdersPage />, index: true },
          { path: ":orderId", element: <DashboardOrderDetailPage /> },
        ],
      },
      {
        path: "cart",
        children: [
          { path: "", element: <DashboardCartPage />, index: true },
          { path: "checkout", element: <DashboardCartCheckout /> },
        ],
      },
      {
        path: "profile",
        children: [
          { path: "", element: <DashboardProfilePage />, index: true },
          { path: "get-measured", element: <DashboardEditMeasurementPage /> },
        ],
      },
    ],
  },
]);

export default pagesRoutes;
