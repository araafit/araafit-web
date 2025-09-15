import {
  CaretRightIcon,
  HouseSimpleIcon,
  MapPinSimpleIcon,
  PackageIcon,
} from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import TopBar from "../top-bar";
import OrderHistory from "./order-history";
import { useOrder, useCancelOrder } from "../../../hooks/orders.hooks";
import Spinner from "../../../shared-components/spinner";
import { formatPrice } from "../../../utils/format-price";
import type { Order } from "../../../services/orders.service";

/* --------------------------------------------------- */

export function DashboardOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, isError, error } = useOrder(orderId || "");
  const cancelOrderMutation = useCancelOrder();

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

  // Helper function to get order display information
  const getOrderDisplayInfo = (order: Order) => {
    if (order.type === "product_order" && order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      return {
        name: firstItem.product.name,
        image: firstItem.product.images?.[0]?.url || "/placeholder-image.jpg",
        price: order.totalAmount,
        size: firstItem.size,
        quantity: firstItem.quantity,
      };
    } else if (order.type === "sewing_request" && order.fabric) {
      return {
        name: order.fabric.name,
        image: "/fabric-placeholder.jpg",
        price: order.totalAmount,
        size: "Custom",
        quantity: order.yardEstimate || 1,
      };
    }
    return null;
  };

  const handleCancelOrder = () => {
    if (orderId && window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/orders" className="text-primary-900">
        Orders
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">{orderId}</span>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  // Show error state
  if (isError || !order) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">Error loading order details</p>
            <p className="text-gray-600">{error?.message || "Order not found"}</p>
            <Link to="/dashboard/orders">
              <Button text="Back to Orders" variant="solid" />
            </Link>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  const displayInfo = getOrderDisplayInfo(order);
  if (!displayInfo) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">Invalid order data</p>
            <Link to="/dashboard/orders">
              <Button text="Back to Orders" variant="solid" />
            </Link>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  const canCancel = order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "approved";

  return (
    <UserDashboardLayout>
      <div className="h-screen overflow-y-hidden">
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar
            title="Orders"
            breadCrumb={<BreadCrumb />}
            rightSide={
              canCancel ? (
                <Button
                  text={cancelOrderMutation.isPending ? "Cancelling..." : "Cancel"}
                  variant="clear"
                  className="w-full max-w-[10.625rem] border border-neutral-200 text-red-500 hover:bg-red-50"
                  disabled={cancelOrderMutation.isPending}
                  onClick={handleCancelOrder}
                />
              ) : <div />
            }
          />
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <h2 className="font-semibold text-[28px] capitalize">
              Tracking Information
            </h2>

            <div className="w-full border border-neutral-100 rounded-md py-5 px-8">
              <div className="inline-flex flex-col gap-[9px] text-[0.875rem] mb-3">
                {statusAlert(order.status)}
                <span className="font-light text-[#494949]">
                  Order ID: {order.id}
                </span>
                <span className="font-light text-[#494949]">
                  Date Ordered: {new Date(order.createdAt).toLocaleString()}
                </span>
                {order.deliveryDate && (
                  <span className="font-light text-[#494949]">
                    Expected Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 h-[3.9375rem]">
                <div className="h-full flex flex-col gap-1">
                  <HouseSimpleIcon className="size-[1.25rem]" />
                  <span className="font-semibold text-[0.875rem]">Araafit</span>
                  <small>{new Date(order.createdAt).toLocaleDateString()}</small>
                </div>

                <div className="h-[5px] rounded-full bg-[#F7F3EF] relative grow">
                  <div className="size-[2rem] bg-primary-200 flex items-center justify-center rounded-full absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2">
                    <PackageIcon className="text-primary-900" />
                  </div>
                </div>

                <div className="h-full flex flex-col gap-1">
                  <MapPinSimpleIcon className="size-[1.25rem]" />
                  <span className="font-semibold text-[0.875rem]">You</span>
                  <small>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</small>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pb-12">
            <div className="py-5 px-8 bg-white rounded-md flex flex-col gap-6">
              <h3 className="text-[1.75rem] font-semibold">Order History</h3>

              <OrderHistory />
            </div>

            <div className="py-5 px-8 flex bg-white rounded-md flex-col justify-center gap-6">
              <h3 className="text-[1.75rem] font-semibold">Order Summary</h3>

              <img src={displayInfo.image} alt={displayInfo.name} className="w-full h-64 object-cover rounded-md" />

              <div className="w-full flex flex-col item-center justify-center gap-4">
                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">
                    Item name:
                  </span>

                  <span className="font-medium text-neutral-950">
                    {displayInfo.name}
                  </span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">
                    {order.type === "product_order" ? "Size:" : "Yards:"}
                  </span>

                  <span className="font-medium text-neutral-950">{displayInfo.size}</span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">Quantity:</span>

                  <span className="font-medium text-neutral-950">{displayInfo.quantity}</span>
                </div>

                <div className="w-full flex items-center justify-between">
                  <span className="text-neutral-900 font-light">Total Amount:</span>

                  <span className="font-medium text-neutral-950">
                    ₦{formatPrice(order.totalAmount)}
                  </span>
                </div>

                {order.rider && (
                  <>
                    <div className="w-full h-px bg-gray-200 my-2"></div>
                    <div className="w-full flex items-center justify-between">
                      <span className="text-neutral-900 font-light">Rider:</span>
                      <span className="font-medium text-neutral-950">{order.rider.name}</span>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <span className="text-neutral-900 font-light">Rider Phone:</span>
                      <span className="font-medium text-neutral-950">{order.rider.phone}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}

