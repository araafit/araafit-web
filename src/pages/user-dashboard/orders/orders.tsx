import DashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import TopBar from "../top-bar";
import shoppingBagIcon from "../images/bag.png";
import { useOrders } from "../../../hooks/orders.hooks";
import { formatPrice } from "../../../utils/format-price";
import { Link } from "react-router-dom";
import { CaretRightIcon } from "@phosphor-icons/react";
import Spinner from "../../../shared-components/spinner";
import type { Order } from "../../../services/orders.service";

/* --------------------------------------------------------------------------- */

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardOrdersPage() {
  const { data: ordersData, isLoading, isError, error } = useOrders(1, 20);
  
  const orders = ordersData?.orders || [];
  const orderIsEmpty = orders.length === 0;

  // Helper function to get display information from order
  const getOrderDisplayInfo = (order: Order) => {
    if (order.type === "product_order" && order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      return {
        name: firstItem.product.name,
        image: firstItem.product.images?.[0]?.url || "/placeholder-image.jpg",
        price: order.totalAmount,
        orderId: order.id,
        status: order.status,
      };
    } else if (order.type === "sewing_request" && order.fabric) {
      return {
        name: `${order.fabric.name} (${order.yardEstimate} yards)`,
        image: "/fabric-placeholder.jpg", // You might want to add a fabric image field
        price: order.totalAmount,
        orderId: order.id,
        status: order.status,
      };
    }
    return null;
  };

  const emptyOrders = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={shoppingBagIcon} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
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

  const statusAlert = (status: string) => {
    const getStatusStyle = (status: string) => {
      const normalizedStatus = status.toLowerCase();
      switch (normalizedStatus) {
        case "pending":
          return "bg-[#FEF3C7] text-[#D97706]";
        case "approved":
          return "bg-[#D1FAE5] text-[#065F46]";
        case "sewing":
          return "bg-[#F0FAFF] text-[#0EA5E9]";
        case "packaging":
          return "bg-[#E0E7FF] text-[#3730A3]";
        case "out for delivery":
          return "bg-[#EFF4FF] text-[#3B76F6]";
        case "delivered":
          return "bg-[#D1FAE5] text-[#065F46]";
        case "complete":
          return "bg-[#D1FAE5] text-[#065F46]";
        case "cancelled":
          return "bg-[#FEE2E2] text-[#991B1B]";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };

    return (
      <span className={`size-fit py-[2px] px-2 text-xs rounded-2xl ${getStatusStyle(status)}`}>
        {status}
      </span>
    );
  };

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Orders</span>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <DashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">Error loading orders</p>
            <p className="text-gray-600">{error?.message || "Please try again later"}</p>
            <Button
              text="Retry"
              variant="solid"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-screen overflow-y-hidden">
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar title="Orders" breadCrumb={<BreadCrumb />} />
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full h-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <h2 className="font-semibold text-[28px] capitalize">
              My Orders {orderIsEmpty ? "" : `(${orders.length})`}
            </h2>

            <div
              id="order-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {orderIsEmpty ? (
                emptyOrders
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {orders.map((order) => {
                    const displayInfo = getOrderDisplayInfo(order);
                    if (!displayInfo) return null;

                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4"
                      >
                        <div className="w-full flex gap-6">
                          <img
                            src={displayInfo.image}
                            alt={displayInfo.name}
                            className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                          />

                          <div className="grow inline-flex flex-col gap-[9px]">
                            <div className="w-full flex items-center justify-between">
                              {statusAlert(displayInfo.status)}
                              <Link
                                to={`/dashboard/orders/${order.id}`}
                                className="underline text-[0.875rem] text-primary-500 cursor-pointer"
                              >
                                View details
                              </Link>
                            </div>
                            
                            <span className="text-neutral-700">
                              Order ID: {order.id}
                            </span>
                            <span className="font-medium text-neutral-900">
                              {displayInfo.name}
                            </span>
                            <span className="text-neutral-900 font-semibold">
                              &#8358;{formatPrice(displayInfo.price)}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
