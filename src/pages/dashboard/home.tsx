import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";
import { useOrdersStore, useShopStore } from "../../hooks/state-store";
import DashboardLayout from "../../layouts/dashboard/dashboard-layout";
import Button from "../../shared-components/button";
import { formatPrice } from "../../utils/format-price";
import shoppingBagIcon from "./images/bag.png";
import TopBar from "./top-bar";

/* ---------------------------------------------------- */

/**
 * Dashboard home page
 *
 * @returns ReactElement
 */
export function DashboardHomePage() {
  const { items: orderItems } = useOrdersStore();
  const { readyToWearDresses, recommendedFabrics } = useShopStore();
  const orderIsEmpty = orderItems.length === 0;

  const title = (
    <div className="font-lora">
      Welcome, <span className="font-lora text-[#1C1C1C]">Eni</span>
    </div>
  );

  const emptyCart = (
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

  return (
    <DashboardLayout>
      <div className="h-screen">
        <div className="flex flex-col gap-2 relative mb-4">
          <TopBar title={title} breadCrumb="home" />

          <div className="p-2">home</div>
        </div>

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[28px] capitalize">
                Ongoing Orders
              </h2>

              <span className="capitalize text-neutral-400 cursor-pointer">
                See all
              </span>
            </div>

            <div
              id="order-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {orderIsEmpty ? (
                emptyCart
              ) : (
                <div className="w-full flex flex-col gap-4">
                  {orderItems.slice(-2).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4"
                    >
                      <div className="flex gap-6">
                        <img
                          src={item.image}
                          alt=""
                          className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                        />

                        <div className="inline-flex flex-col gap-[9px]">
                          {statusAlert(item.status.toLowerCase())}
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

                      <span
                        className="underline text-primary-500 cursor-pointer"
                        onClick={() => console.log("View order details")}
                      >
                        View details
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ready to wear dress */}
          <div className="w-full bg-white rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-[28px] capitalize">
                Ready to wear dresses
              </h2>
              <span className="capitalize text-neutral-400">See all</span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {readyToWearDresses.map((item, idx) => (
                <div key={idx + item.orderId} className="rounded-t-md">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-[11.0625rem] object-top"
                  />

                  <div className="rounded-b-md border border-neutral-100 py-2 px-3">
                    <div className="font-light text-neutral-700 mb-2">
                      {item.name}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-900 font-semibold leading-a">
                        ₦{formatPrice(Number(item.cost))}
                      </span>

                      <ShoppingCartSimpleIcon
                        className="size-[20px] cursor-pointer text-primary-500"
                        onClick={() => console.log("Add to cart")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended fabrics */}
          <div className="w-full bg-white rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[28px] capitalize">
                Recommended Fabrics
              </h2>
              <span className="capitalize text-neutral-400">See all</span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {recommendedFabrics.map((item, idx) => (
                <div key={idx + item.orderId} className="rounded-t-md">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-[11.0625rem] object-top"
                  />

                  <div className="rounded-b-md border border-neutral-100 py-2 px-3">
                    <div className="font-light text-neutral-700 mb-2">
                      {item.name}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-900 font-semibold leading-a">
                        ₦{formatPrice(Number(item.cost))}/yd
                      </span>

                      <ShoppingCartSimpleIcon
                        className="size-[20px] cursor-pointer text-primary-500"
                        onClick={() => console.log("Add to cart")}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
