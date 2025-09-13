import { CaretRightIcon } from "@phosphor-icons/react";
import UserDashboardLayout from "../../../layouts/user-dashboard/dashboard-layout";
import TopBar from "../top-bar";
import Button from "../../../shared-components/button";
import shoppingCart from "./shopping-cart.png";
import { useCartStore } from "../../../shared-hooks/state-store";
import CartEngine from "../../../shared-components/cart-engine";

/* -------------------------------------------------------------------- */

/**
 * User dashboard cart page
 *
 * @returns ReactElement
 */
export function DashboardCartPage() {
  const { items: cartItems } = useCartStore();
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

      <Button
        text="Browse shop"
        variant="solid"
        className="w-full max-w-[175px]"
      />
    </div>
  );

  return (
    <UserDashboardLayout>
      <div className="h-screen flex flex-col gap-2 relative">
        <TopBar title="Cart" breadCrumb={<BreadCrumb />} />

        <div className="w-full h-[95%] flex flex-col gap-4 p-4 mt-20 overflow-y-scroll">
          <div className="w-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
            <h2 className="font-semibold text-[28px] capitalize">{cartIsEmpty?"My Cart":`My Cart (${cartItems.length})`}</h2>

            <div
              id="cart-container"
              className="w-full h-auto flex items-center justify-center"
            >
              {cartIsEmpty ? emptyCart : <CartEngine cartData={cartItems} checkoutLink="/dashboard/cart/checkout" />}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
