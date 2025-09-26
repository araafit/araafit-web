import { useState } from "react";
import CheckoutDeliveryInfo from "./checkout-delivery-info";
import CheckoutPaymentInfo from "./checkout-payment-info";
import { useCart } from "../../hooks/cart.hooks";
import Spinner from "../spinner";
import { formatPrice } from "../../utils/format-price";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */

/**
 * Checkout component for rendering the checkout page.
 *
 * @returns ReactElement
 */
function CartCheckout() {
  const [checkoutTab, setCheckoutTab] = useState<
    "payment-detail" | "delivery-detail"
  >("delivery-detail");
  const { data: cart, isLoading, isError, error } = useCart();

  // Show loading state
  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show error state or empty cart
  if (isError || !cart || !cart.items.length) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-600">
            {isError ? "Error loading cart" : "Your cart is empty"}
          </p>
          <p className="text-gray-600">
            {isError
              ? error?.message || "Please try again later"
              : "Add items to cart before checkout"}
          </p>
          <Link to="/shop">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[1.75rem] capitalize">
              Order Summary ({cart.items.length} items)
            </h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold">
                ₦{formatPrice(cart.total)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4"
              >
                <div className="w-full flex gap-6">
                  <img
                    src={
                      item.product.images?.[0]?.url || "/placeholder-image.jpg"
                    }
                    alt={item.product.name}
                    className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                  />
                  <div className="grow flex flex-col gap-2">
                    <h3 className="font-medium text-neutral-900">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold text-neutral-900">
                      ₦{formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {checkoutTab === "delivery-detail" ? (
        <CheckoutDeliveryInfo
          onContinue={() => setCheckoutTab("payment-detail")}
        />
      ) : (
        <CheckoutPaymentInfo redirectionLink="/shop" />
      )}
    </div>
  );
}

export default CartCheckout;
