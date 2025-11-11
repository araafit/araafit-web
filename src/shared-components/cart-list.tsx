import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwitch } from "../shared-hooks/switch";
//import showToast from "../utils/notification";
import Button from "./button";
import Modal from "./modal";
import { MinusIcon, PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { formatPrice } from "../utils/format-price";
import { useUpdateQuantity, useRemoveFromCart } from "../hooks/cart.hooks";
import type { CartItem } from "../services/cart.service";
import Spinner from "./spinner";

/* ---------------------------------------------------------------------- */

interface CartEngine {
  cartData: CartItem[];
  checkoutLink: string;
}

/**
 * CartEngine component for rendering the shopping cart items.
 *
 * @returns ReactElement
 */
function CartList({ cartData, checkoutLink }: CartEngine) {
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const navigate = useNavigate();
  const updateQuantityMutation = useUpdateQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const { toggleSwitch: toggleModal, switchValue } = useSwitch();

  // Initiate item to be removed and trigger modal
  const triggerModal = (itemId: string) => {
    setItemToRemove(itemId);
    setTimeout(() => {
      toggleModal();
    }, 200);
  };

  // Handle quantity updates
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // If quantity is 0 or less, trigger removal modal
      setItemToRemove(itemId);
      toggleModal();
      return;
    }

    updateQuantityMutation.mutate({
      itemId,
      request: {
        quantity: newQuantity,
      },
    });
  };

  // Remove item, close modal and notify user
  const removeItem = () => {
    if (itemToRemove) {
      removeFromCartMutation.mutate(itemToRemove);
      setTimeout(() => {
        toggleModal();
        setItemToRemove(null);
      }, 200);
    }
  };

  const totalPrice = cartData.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {cartData.map((item, idx) => (
          <div
            key={idx}
            className="w-full border border-neutral-100 rounded-md py-2 px-4"
          >
            <div className="flex gap-6">
              <input
                type="checkbox"
                name={`order_` + item.id}
                id=""
                placeholder=""
                title="checkbox"
                className="self-start"
              />

              <img
                src={item.product.images?.[0]?.url || "/placeholder-image.jpg"}
                alt=""
                className="w-full max-w-[14.124rem] rounded-md object-cover"
              />
              <div className="h-full flex flex-col gap-6">
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-inter font-medium text-[18px]">
                    {item.product.name}
                  </h4>
                  <p className="font-light text-neutral-600">
                    {item.product.description}
                  </p>
                  <span className="font-semibold">
                    &#8358;{formatPrice(Number(item.product.price))}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-[102px] flex items-center justify-evenly rounded-md py-[7px] px-3 border gap-2 border-neutral-100">
                    <MinusIcon
                      className={`cursor-pointer ${
                        updateQuantityMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        !updateQuantityMutation.isPending &&
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    />
                    <span className="flex items-center gap-1">
                      {item.quantity}
                      {updateQuantityMutation.isPending && (
                        <Spinner
                          size="sm"
                          arcColor="#9a6c50"
                          isLoading={updateQuantityMutation.isPending}
                        />
                      )}
                    </span>
                    <PlusIcon
                      className={`cursor-pointer ${
                        updateQuantityMutation.isPending
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        !updateQuantityMutation.isPending &&
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    />
                  </div>

                  <TrashSimpleIcon
                    className={`size-[20px] text-red-500 cursor-pointer ${
                      removeFromCartMutation.isPending
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      !removeFromCartMutation.isPending && triggerModal(item.id)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="w-full bg-[#F7F3EF] px-6 py-4 rounded-md flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-neutral-800">Tax</span>
            <span className="text-neutral-950">₦0.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-800">Subtotal</span>
            <span className="text-neutral-950">₦{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-800">Total</span>
            <span className="text-neutral-950">₦{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <Button
          text="Checkout"
          variant="solid"
          className="w-full max-w-[375px]"
          onClick={() => navigate(checkoutLink)}
        />
      </div>

      {/* Deletion confirmation modal */}
      <Modal
        isOpen={switchValue}
        onClose={toggleModal}
        containerClassName="w-[25rem]"
      >
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold text-[2rem] text-neutral-950">
            Remove item
          </h2>
          <p className="font-light text-neutral-700 text-center leading-snug">
            Are you sure you want to remove this item from your cart?
          </p>

          <Button
            text="No"
            variant="solid"
            className="w-full text-white"
            onClick={toggleModal}
          />

          <Button
            text="Yes"
            variant="clear"
            className="w-full text-neutral-900 shadow-sm"
            onClick={removeItem}
          />
        </div>
      </Modal>
    </div>
  );
}

export default memo(CartList);
