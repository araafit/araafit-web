import GuestPageLayout from "../../../layouts/guest/guest-page-layout";
import Button from "../../../shared-components/button";
import { useCart } from "../../../hooks/cart.hooks";
import shoppingCartImg from "../../../shared-images/shopping-cart.png";
import { Link } from "react-router-dom";
import CartEngine from "../../../shared-components/cart-engine";
import Spinner from "../../../shared-components/spinner";
import { formatPrice } from "../../../utils/format-price";

/* --------------------------------------------------- */

function GuestCart() {
  const { data: cart, isLoading, isError, error } = useCart();
  const cartItems = cart?.items || [];
  const cartIsEmpty = cartItems.length === 0;

  const emptyCart = (
    <div className="w-full h-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={shoppingCartImg} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        Your cart is empty.
      </p>

      <Link to="/shop">
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
      <GuestPageLayout>
        <div className="w-full lg:w-[71.875rem] relative p-8 bg-white rounded-md overflow-y-scroll flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </GuestPageLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <GuestPageLayout>
        <div className="w-full lg:w-[71.875rem] relative p-8 bg-white rounded-md overflow-y-scroll flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-red-600">Error loading cart</p>
            <p className="text-gray-600">{error?.message || "Please try again later"}</p>
            <Button
              text="Retry"
              variant="solid"
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </GuestPageLayout>
    );
  }

  return (
    <GuestPageLayout>
      <div className="w-full lg:w-[71.875rem] relative p-8 bg-white rounded-md overflow-y-scroll">
        <div className="flex flex-col gap-6">
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
            className="size-full h-auto flex items-center justify-center"
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
                checkoutLink="/cart/checkout"
              />
            )}
          </div>
        </div>
      </div>
    </GuestPageLayout>
  );
}

export default GuestCart;
