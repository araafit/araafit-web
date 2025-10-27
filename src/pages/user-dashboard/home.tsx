import { CaretRightIcon } from "@phosphor-icons/react";
import { useCartStore } from "../../shared-hooks/state-store";
import UserDashboardLayout from "../../layouts/user-dashboard/dashboard-layout";
import Button from "../../shared-components/button";
import { formatPrice } from "../../utils/format-price";
import shoppingBagIcon from "./images/bag.png";
import TopBar from "./top-bar";
import { Link } from "react-router-dom";
import Card from "../../shared-components/card";
import { useDashboardData } from "../../hooks/user-dashboard.hooks";
import type { Order } from "../../services/orders.service";
import type { Product } from "../../services/products.service";
import LoaderView from "../../layouts/user-dashboard/loader";
import { useLocalStorage } from "../../shared-hooks/loca-storage";

/* -------------------------------------------------------------------- */

type StoredUser = {
  state: {
    adminUser: Record<string, string | null>;
    isAdmin: boolean;
    isUser: boolean;
    user: Record<string, string | null>;
  };
  version: number;
};

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardHomePage() {
  const { orders, dresses, fabrics, isLoading, isError, error } =
    useDashboardData();
  const addToCart = useCartStore((state) => state.addItem);
  const {
    storedValue: {
      state: { user: storedUser },
    },
  } = useLocalStorage<StoredUser | null>("araafit-auth-storage", null);

  const orderItems = orders.data || [];
  const readyToWearDresses = dresses.data || [];
  const recommendedFabrics = fabrics.data || [];
  const orderIsEmpty = orderItems.length === 0;

  const title = (
    <div className="font-lora text-[#979797]">
      {!storedUser ? (
        <span className="">Welcome</span>
      ) : (
        <div className="font-lora">
          Welcome,{" "}
          <span className="font-lora text-[#1C1C1C]">
            {storedUser?.firstName}
          </span>
        </div>
      )}
    </div>
  );

  const emptyOrder = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2 p-4">
      <img src={shoppingBagIcon} alt="" className="size-[150px] lg:size-[200px]" />

      <p className="font-light text-center text-neutral-500 text-sm lg:text-base">
        You haven't placed any orders yet. Browse through our curated collection
        based on your unique measurements and style.
      </p>

      <Link to="/dashboard/shop">
        <Button
          text="Browse shop"
          variant="solid"
          className="w-full max-w-[175px]"
        />
      </Link>
    </div>
  );

  const statusAlert = (status: string) => (
    <span
      className={`size-fit py-[2px] px-2 text-xs rounded-2xl ${
        status === "sewing"
          ? "bg-[#F0FAFF] text-[#0EA5E9]"
          : status === "packaging"
          ? "bg-[#FFF7ED] text-[#EA580C]"
          : status === "out for delivery"
          ? "bg-[#EFF4FF] text-[#3B76F6]"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );

  // Helper function to get order display data
  const getOrderDisplayData = (order: Order) => {
    if (
      order.type === "product_order" &&
      order.items &&
      order.items.length > 0
    ) {
      const firstItem = order.items[0];
      return {
        name: firstItem.product.name,
        image: firstItem.product.images?.[0]?.url || shoppingBagIcon,
      };
    } else if (order.type === "sewing_request" && order.fabric) {
      return {
        name: `${order.fabric.name} (${order.yardEstimate} yards)`,
        image: shoppingBagIcon, // Default image for fabric orders
      };
    }
    return {
      name: "Order",
      image: shoppingBagIcon,
    };
  };

  // Helper function to convert Product to CartItem
  const productToCartItem = (product: Product) => ({
    orderId: `cart-${product.id}`,
    name: product.name,
    description: product.description,
    cost: product.price,
    image: product.images?.[0]?.url || shoppingBagIcon,
    count: 1,
  });

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Home</span>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <LoaderView />
        </div>
      </UserDashboardLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">Error loading dashboard data</p>
            <p className="text-gray-600">
              {error?.message || "Please try again later"}
            </p>
            <Button
              text="Retry"
              variant="solid"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative">
          <TopBar title={title} breadCrumb={<BreadCrumb />} />
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-2 lg:p-4 mt-16 lg:mt-20 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-2 lg:p-4 flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xl lg:text-[28px] capitalize">
                Ongoing Orders
              </h2>

              <Link to="/dashboard/orders">
                <span className="capitalize text-neutral-400 cursor-pointer hover:text-primary-500 transition-colors">
                  See all
                </span>
              </Link>
            </div>

            <div
              id="order-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {orderIsEmpty ? (
                emptyOrder
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {orderItems.slice(-2).map((order) => {
                    const displayData = getOrderDisplayData(order);
                    return (
                      <div
                        key={order.id}
                        className="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-neutral-100 rounded-md py-2 px-2 lg:px-4 gap-4"
                      >
                        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6">
                          <img
                            src={displayData.image}
                            alt={displayData.name}
                            className="w-full lg:w-[14.125rem] h-48 lg:h-[8.75rem] object-cover rounded-md"
                          />

                          <div className="grow inline-flex flex-col gap-[9px]">
                            <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                              {statusAlert(order.status.toLowerCase())}
                              <Link
                                to={`/dashboard/orders/${order.id}`}
                                className="underline text-[0.875rem] text-primary-500 cursor-pointer"
                              >
                                View details
                              </Link>
                            </div>

                            <span className="text-neutral-700 text-sm lg:text-base">
                              Order ID: {order.id}
                            </span>
                            <span className="font-medium text-neutral-900 text-sm lg:text-base">
                              {displayData.name}
                            </span>
                            <span className="text-neutral-900 font-semibold text-sm lg:text-base">
                              &#8358;{formatPrice(order.totalAmount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Ready to wear dress */}
          <div className="w-full bg-white rounded-sm p-2 lg:p-4 flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-xl lg:text-[28px] capitalize">
                Ready to wear dresses
              </h2>
              <Link to="/dashboard/shop">
                <span className="capitalize text-neutral-400 cursor-pointer hover:text-primary-500 transition-colors">
                  See all
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {readyToWearDresses.map((product) => (
                <Card
                  key={product.id}
                  itemName={product.name}
                  itemCost={product.price}
                  itemImage={product.images?.[0]?.url || shoppingBagIcon}
                  link={`/dashboard/shop/dress/${product.id}`}
                  product={product}
                  addToCart={() => addToCart(productToCartItem(product))}
                />
              ))}
            </div>
          </div>

          {/* Recommended fabrics */}
          <div className="w-full bg-white rounded-sm p-2 lg:p-4 flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xl lg:text-[28px] capitalize">
                Recommended Fabrics
              </h2>
              <Link to="/dashboard/shop">
                <span className="capitalize text-neutral-400 cursor-pointer hover:text-primary-500 transition-colors">
                  See all
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {recommendedFabrics.map((product) => (
                <Card
                  key={product.id}
                  itemName={product.name}
                  itemCost={product.price}
                  itemImage={product.images?.[0]?.url || shoppingBagIcon}
                  link={`/dashboard/shop/fabric/${product.id}`}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}