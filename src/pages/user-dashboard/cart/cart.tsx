import { CaretRightIcon } from "@phosphor-icons/react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import Button from "../../../shared-components/button";
import shoppingCart from "./shopping-cart.png";
import { useCart } from "../../../hooks/cart.hooks";
import CartEngine from "../../../shared-components/cart-engine";
import Spinner from "../../../shared-components/spinner";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/format-price";

/* -------------------------------------------------------------------- */

/**
 * User dashboard cart page
 *
 * @returns ReactElement
 */
export function DashboardCartPage() {
  const { data: cart, isLoading, isError, error } = useCart();
  const cartItems = cart?.items || [];
  const cartIsEmpty = cartItems.length === 0;

  const BreadCrumb = () => (
    <div className="font-inter font-light capitalize flex items-center">
      <span className="text-primary-900">Araafit</span>
      <CaretRightIcon className="text-[#979797]" />
      <span className="text-[#979797]">Cart</span>
    </div>
  );

  const emptyCart = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={shoppingCart} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        Your cart is empty.
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

  // Show loading state
  if (isLoading) {
    return (
      <UserDashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading cart...</p>
          </div>
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
            <p className="text-red-600">Error loading cart</p>
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
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Cart" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[28px] capitalize">
                {cartIsEmpty ? "My Cart" : `My Cart (${cartItems.length})`}
              </h2>
              {cart && !cartIsEmpty && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-semibold">₦{formatPrice(cart.total)}</p>
                </div>
              )}
            </div>

            <div
              id="cart-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {cartIsEmpty ? (
                emptyCart
              ) : (
                <CartEngine
                  cartData={cartItems.map((item) => ({
                    ...item,
                    image: item.product.images?.[0]?.url || "/placeholder-image.jpg",
                    name: item.product.name,
                    description: item.product.description || `${item.product.category} - Size: ${item.size}`,
                    cost: item.product.price,
                  }))}
                  checkoutLink="/dashboard/cart/checkout"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
