import { useState } from "react";
import UserDashboardLayout from "../../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { recommendedRtw2 } from "../../images/image-entry";
import CheckoutDeliveryInfo from "./checkout-delivery-info";
import CheckoutPaymentInfo from "./checkout-payment-info";

/* ------------------------------------------------------------------------------------------ */

/**
 * Cart checkout
 *
 *
 * @returns ReactElement
 */
export function DashboardCartCheckout() {
  const [checkoutTab, setCheckoutTab] = useState("delivery-detail");

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/cart" className="text-primary-900">
        Caret
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Checkout</span>
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Cart" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-[43rem] flex">
              <div
                className="w-[344px] text-primary-500 cursor-pointer border-t-4 border-t-primary-500"
                onClick={() => setCheckoutTab("delivery-detail")}
              >
                <h4 className="text-primary-500">Your details</h4>
                <p className="font-light text-[0.875rem]">
                  Review your delivery details
                </p>
              </div>

              <div
                className={`w-[344px] text-primary-500 cursor-pointer border-t-4 ${
                  checkoutTab !== "payment-detail"
                    ? "border-t-primary-300"
                    : "border-t-primary-500"
                }"`}
                onClick={() => setCheckoutTab("payment-detail")}
              >
                <h4 className="text-primary-500">Payment information</h4>
                <p className="font-light text-[0.]">
                  Securely enter your payment details
                </p>
              </div>
            </div>
          </div>

          {checkoutTab === "delivery-detail" && (
            <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
              <h2 className="font-semibold text-[1.75rem] capitalize">
                Order Summary
              </h2>

              <div className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4">
                <div className="w-full flex-gap-6">
                  <img
                    src={recommendedRtw2}
                    alt=""
                    className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {checkoutTab === "delivery-detail" ? (
            <CheckoutDeliveryInfo />
          ) : (
            <CheckoutPaymentInfo />
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
