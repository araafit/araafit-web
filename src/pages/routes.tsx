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
import {
  AdminDashboardOverview,
  AdminDashboardRecentActivities,
  AdminDashboardOrders,
  AdminDashboardInventory,
  AdminDashboardViewInventory,
  AdminDashboardEditInventory,
  AdminDashboardUploadInventory,
  AdminDashboardCustomers,
  AdminDashboardCustomersDetails,
  AdminDashboardCustomersActivities,
  AdminDashboardSettings,
  AdminDashboardDiscounts,
} from "./admin-dashboard/import-entry";
import AdminLogin from "./admin-auth/login/login";
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
        element: <Login userType="guest" />,
        index: true,
      },
      {
        path: "admin-login",
        element: <AdminLogin userType="admin" />,
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
  {
    path: "admin-dashboard",
    children: [
      {
        path: "overview",
        element: <AdminDashboardOverview />,
      },
      {
        path: "/admin-dashboard/overview/recent-activity",
        element: <AdminDashboardRecentActivities />,
        // index: true,
      },
      {
        path: "order-management",
        element: <AdminDashboardOrders />,
        index: true,
      },
      {
        path: "inventory",
        element: <AdminDashboardInventory />,
      },
      {
        path: "inventory/:inventoryId",
        element: <AdminDashboardViewInventory />,
      },
      {
        path: "inventory/:inventoryId/edit",
        element: <AdminDashboardEditInventory />,
      },
      {
        path: "inventory/upload",
        element: <AdminDashboardUploadInventory />,
      },
      {
        path: "orders",
        children: [
          { path: "", element: <DashboardOrdersPage />, index: true },
          { path: ":orderId", element: <DashboardOrderDetailPage /> },
        ],
      },
      {
        path: "customers",
        element: <AdminDashboardCustomers />,
      },
      {
        path: "customers/:customersId",
        element: <AdminDashboardCustomersDetails />,
      },

      {
        path: "customers/123/activities",
        element: <AdminDashboardCustomersActivities />,
      },
      {
        path: "settings",
        element: <AdminDashboardSettings />,
      },
      {
        path: "discounts",
        element: <AdminDashboardDiscounts />,
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
