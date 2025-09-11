import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import Button from "../../../shared-components/button";
import { useCartStore } from "../../../shared-hooks/state-store";
import shoppingCartImg from "../../../shared-images/shopping-cart.png";
import { useNavigate } from "react-router-dom";
import CartEngine from "../../../shared-components/cart-engine";

/* --------------------------------------------------- */

function GuestCart() {
  const navigate = useNavigate();
  const { items: cartItems } = useCartStore();
  const cartIsEmpty = cartItems.length === 0;

  const emptyCart = (
    <div className="w-full h-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={shoppingCartImg} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        Your cart is empty.
      </p>

      <Button
        text="Browse shop"
        variant="solid"
        className="w-full max-w-[175px]"
        onClick={() => navigate("./register")}
      />
    </div>
  );

  return (
    <GuestPageLayout>
      <div className="w-full lg:w-[71.875rem] relative p-8 bg-white rounded-md overflow-y-scroll">
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-[28px] capitalize">
            {cartIsEmpty ? "My Cart" : `My Cart (${cartItems.length})`}
          </h2>

          <div
            id="cart-container"
            className="size-full h-auto flex items-center justify-center"
          >
            {cartIsEmpty ? (
              emptyCart
            ) : (
              <CartEngine cartData={cartItems} checkoutLink="/cart/checkout" />
            )}
          </div>
        </div>
      </div>
    </GuestPageLayout>
  );
}

export default GuestCart;
