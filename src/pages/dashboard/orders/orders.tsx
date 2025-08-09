import DashboardLayout from "../../../layouts/dashboard/dashboard-layout";
import Button from "../../../shared-components/button";
import TopBar from "../top-bar";
import shoppingBagIcon from "../images/bag.png";
import { useOrdersStore } from "../../../hooks/state-store";
import { formatPrice } from "../../../utils/format-price";
import { Link, useLocation } from "react-router-dom";
import { CaretRightIcon } from "@phosphor-icons/react";

/* --------------------------------------------------------------------------- */

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardOrdersPage() {
  const { items: orderItems } = useOrdersStore();
  const location = useLocation();

  const orderIsEmpty = orderItems.length === 0;

  const emptyOrders = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={shoppingBagIcon} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        You haven’t placed any orders yet. Browse through our curated collection
        based on your unique measurements and style.
      </p>

      <Button
        text="Browse shop"
        variant="solid"
        className="w-full max-w-[175px]"
      />
    </div>
  );

  const statusAlert = (status: string) => (
    <span
      className={`size-fit py-[2px] px-2 text-xs rounded-2xl ${
        status === "sewing"
          ? "bg-[#F0FAFF] text-[#0EA5E9]"
          : status === "out for delivery"
          ? "bg-[#EFF4FF] text-[#3B76F6]"
          : ""
      }`}
    >
      {status}
    </span>
  );

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Orders</span>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="h-screen overflow-y-hidden">
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar title="Orders" breadCrumb={<BreadCrumb />} />
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full h-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <h2 className="font-semibold text-[28px] capitalize">
              My Orders {orderIsEmpty ? "" : `(${orderItems.length})`}
            </h2>

            <div
              id="order-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {orderIsEmpty ? (
                emptyOrders
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {orderItems.slice(-2).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4"
                    >
                      <div className="w-full flex gap-6">
                        <img
                          src={item.image}
                          alt=""
                          className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                        />

                        <div className="grow inline-flex flex-col gap-[9px]">
                          <div className="w-full flex items-center justify-between">
                            {statusAlert(item.status.toLowerCase())}
                            <Link
                              to={`/dashboard/orders/${item.orderId.replaceAll(
                                " ",
                                "-"
                              )}`}
                              className="underline text-[0.875rem] text-primary-500 cursor-pointer"
                            >
                              View details
                            </Link>
                          </div>
                          
                          <span className="text-neutral-700">
                            Order ID: {item.orderId}
                          </span>
                          <span className="font-medium text-neutral-900">
                            {item.name}
                          </span>
                          <span className="text-neutral-900 font-semibold">
                            &#8358;{formatPrice(Number(item.cost))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
