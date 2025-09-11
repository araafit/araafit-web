import { memo, useState } from "react";
import { type CartItem } from "../_shared-data/_cart";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../shared-hooks/state-store";
import { useSwitch } from "../shared-hooks/switch";
import showToast from "../utils/notification";
import Button from "./button";
import Modal from "./modal";
import { MinusIcon, PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { formatPrice } from "../utils/format-price";

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
function CartEngine({ cartData, checkoutLink }: CartEngine) {
  const [orderId, setOrderId] = useState<string | number>();
  const navigate = useNavigate();
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItemCount);
  const decreaseItem = useCartStore((state) => state.decreaseItemCount);
  const { toggleSwitch: toggleModal, switchValue } = useSwitch();

  // Initiate order to be removed and trigger modal
  const triggerModal = (orderId: number | string) => {
    setOrderId(orderId);

    setTimeout(() => {
      toggleModal();
    }, 200);
  };

  // Remove order, close modal and notify user
  const removeOrder = () => {
    if (orderId) {
      removeItem(orderId);

      setTimeout(() => {
        toggleModal();
      }, 200);

      showToast.success("(1) One item has be removed from your cart", {
        duration: 4000,
        position: "top-center",
        style: {
          backgroundColor: "#F6FEF9",
          border: "1px solid #16A34A",
          color: "#16A34A",
          fontSize: "14px",
        },
      });
    }
  };

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
                name={`order_` + item.orderId}
                id=""
                placeholder=""
                title=""
                className="self-start"
              />

              <img
                src={item.image}
                alt=""
                className="w-full max-w-[14.124rem] rounded-md object-cover"
              />
              <div className="h-full flex flex-col gap-6">
                <div className="flex flex-col gap-[12px]">
                  <h4 className="font-inter font-medium text-[18px]">
                    {item.name}
                  </h4>
                  <p className="font-light text-neutral-600">
                    {item.description}
                  </p>
                  <span className="font-semibold">
                    &#8358;{formatPrice(Number(item.cost))}
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-[102px] flex items-center justify-evenly rounded-md py-[7px] px-3 border gap-2 border-neutral-100">
                    <MinusIcon
                      className="cursor-pointer"
                      onClick={() => decreaseItem(idx)}
                    />
                    <span>{item.count}</span>
                    <PlusIcon
                      className="cursor-pointer"
                      onClick={() => increaseItem(idx)}
                    />
                  </div>

                  <TrashSimpleIcon
                    className="size-[20px] text-red-500 cursor-pointer"
                    onClick={() => item.orderId && triggerModal(item.orderId)}
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
            <span className="text-neutral-950">₦170,000.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-800">Total</span>
            <span className="text-neutral-950">₦170,000,00</span>
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
            onClick={removeOrder}
          />
        </div>
      </Modal>
    </div>
  );
}

export default memo(CartEngine);
