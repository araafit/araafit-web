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
import AdminConfirmEmail from "./admin-auth/reset/confirm-email";
import AdminPasswordResetPage from "./admin-auth/reset/password-reset-page";
import {
  GetMeasured,
  ManualMeasurement,
  MeasurementSummary,
  PickGender,
} from "./get-measured/import-entry";
import {
  GuestShopPage,
  GuestDressDetailPage,
  GuestFabricDetailPage,
} from "./guest/guest-shop/import-entry";
import GuestCartPage from "./guest/cart/guest-cart";
import GuestCartCheckout from "./guest/cart/guest-cart-checkout";
import PaystackCallback from "./paystack-callback";
import CheckoutSuccess from "./user-dashboard/cart/checkout/checkout-success";
import { FabricRequestSummary } from "./guest/guest-shop/fabric-request-summary";
import {
  AllShop,
  KidsShop,
  WomenShop,
  MenShop,
} from "./user-dashboard/shop/shop-pages-export";
import ShopLayout from "./user-dashboard/shop/context/shop-layout";
import { OrderStatusProvider } from "./admin-dashboard/orders-management/table-status-context-provider";

/* -------------------------------------------------------------------------------------------------------- */

/**
 * Pages route system
 */
const pagesRoutes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "paystack-callback",
    element: <PaystackCallback />,
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
    children: [
      {
        path: "",
        element: <GetMeasured />,
        index: true,
      },
      {
        path: "/get-measured/manual",
        element: <PickGender />,
      },
      {
        path: "/get-measured/manual/measurement",
        element: <ManualMeasurement />,
      },
      {
        path: "/get-measured/summary",
        element: <MeasurementSummary />,
      },
    ],
  },
  {
    path: "shop",
    children: [
      {
        path: "",
        element: <GuestShopPage />,
        index: true,
      },
      {
        path: "dress/:itemName",
        element: <GuestDressDetailPage />,
      },
      {
        path: "fabric/:itemName",
        element: <GuestFabricDetailPage />,
      },
      {
        path: ":fabricId/summary",
        element: <FabricRequestSummary />,
      },
    ],
  },
  {
    path: "cart",
    children: [
      {
        path: "",
        element: <GuestCartPage />,
        index: true,
      },
      {
        path: "checkout",
        element: <GuestCartCheckout />,
      },
    ],
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
    path: "admin-auth",
    children: [
      {
        path: "reset",
        children: [
          { path: "", element: <AdminConfirmEmail />, index: true },
          { path: "reset-password", element: <AdminPasswordResetPage /> },
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
          {
            path: "all",
            element: (
              <ShopLayout>
                <AllShop />
              </ShopLayout>
            ),
            index: true,
          },
          {
            path: "men",
            element: (
              <ShopLayout>
                <MenShop />
              </ShopLayout>
            ),
          },
          {
            path: "women",
            element: (
              <ShopLayout>
                <WomenShop />
              </ShopLayout>
            ),
          },
          {
            path: "kids",
            element: (
              <ShopLayout>
                <KidsShop />
              </ShopLayout>
            ),
          },
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
          { path: "checkout/success", element: <CheckoutSuccess /> },
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
        index: true,
      },
      {
        path: "/admin-dashboard/overview/recent-activity",
        element: <AdminDashboardRecentActivities />,
      },
      {
        path: "order-management",
        element: (
          <OrderStatusProvider>
            <AdminDashboardOrders />
          </OrderStatusProvider>
        ),
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
        path: "customers/:customersId/activities",
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
