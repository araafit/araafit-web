import { useState } from "react";
import { recommendedRtw2 } from "../../shared-images/image-entry";
import CheckoutDeliveryInfo from "./checkout-delivery-info";
import CheckoutPaymentInfo from "./checkout-payment-info";

/**
 * Checkout component for rendering the checkout page.
 *
 * @returns ReactElement
 */
function CartCheckout() {
  const [checkoutTab, setCheckoutTab] = useState("delivery-detail");

  return (
    <div className="size-full flex flex-col gap-4 p-4">
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
        <div className="w-full bg-white mt-5 rounded-md p-4 flex flex-col gap-6">
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
        <CheckoutPaymentInfo redirectionLink="/shop" />
      )}
    </div>
  );
}

export default CartCheckout;
