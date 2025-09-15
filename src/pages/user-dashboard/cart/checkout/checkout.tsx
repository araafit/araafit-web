import { useState } from "react";
import UserDashboardLayout from "../../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../../top-bar";
import { CaretRightIcon } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import CheckoutDeliveryInfo from "./checkout-delivery-info";
import CheckoutPaymentInfo from "./checkout-payment-info";
import { useCart } from "../../../../hooks/cart.hooks";
//import { useCheckout } from "../../../../hooks/orders.hooks";
import Spinner from "../../../../shared-components/spinner";
import { formatPrice } from "../../../../utils/format-price";

/* ------------------------------------------------------------------------------------------ */

/**
 * Cart checkout
 *
 *
 * @returns ReactElement
 */
export function DashboardCartCheckout() {
  const [checkoutTab, setCheckoutTab] = useState("delivery-detail");
  const { data: cart, isLoading: cartLoading, isError: cartError, error: cartErrorMsg } = useCart();
  //const checkoutMutation = useCheckout();

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <Link to="/dashboard/cart" className="text-primary-900">
        Cart
      </Link>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Checkout</span>
    </div>
  );

  // Show loading state
  if (cartLoading) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

  // Show error state or empty cart
  if (cartError || !cart || !cart.items.length) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">
              {cartError ? "Error loading cart" : "Your cart is empty"}
            </p>
            <p className="text-gray-600">
              {cartError ? cartErrorMsg?.message || "Please try again later" : "Add items to cart before checkout"}
            </p>
            <Link to="/dashboard/cart">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                Back to Cart
              </button>
            </Link>
          </div>
        </div>
      </UserDashboardLayout>
    );
  }

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
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[1.75rem] capitalize">
                  Order Summary ({cart.items.length} items)
                </h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-semibold">₦{formatPrice(cart.total)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border border-neutral-100 rounded-md py-2 px-4">
                    <div className="w-full flex gap-6">
                      <img
                        src={item.product.images?.[0]?.url || "/placeholder-image.jpg"}
                        alt={item.product.name}
                        className="w-[14.125rem] h-[8.75rem] object-cover rounded-md"
                      />
                      <div className="grow flex flex-col gap-2">
                        <h3 className="font-medium text-neutral-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-neutral-900">₦{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkoutTab === "delivery-detail" ? (
            <CheckoutDeliveryInfo onContinue={() => setCheckoutTab("payment-detail")} />
          ) : (
            <CheckoutPaymentInfo />
          )}
        </div>
      </div>
    </UserDashboardLayout>
  );
}
