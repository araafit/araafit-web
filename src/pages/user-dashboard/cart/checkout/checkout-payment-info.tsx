import { PlusIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { useCardState } from "../../../../shared-hooks/state-store";
import { useSwitch } from "../../../../shared-hooks/switch";
import Button from "../../../../shared-components/button";
import Modal from "../../../../shared-components/modal";
import Spinner from "../../../../shared-components/spinner";
import BillingCardForm, { type CheckoutInfo } from "../../billing-card-form";
import BillingCardList from "../../billing-card-list";
import checkMark from "../../checkmark.png";
import paymentWallet from "../payment-wallet.png";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../../../hooks/orders.hooks";
import { useCart } from "../../../../hooks/cart.hooks";

/* ------------------------------------------------------------------------- */

/**
 * Checkout payment information component
 *
 * @returns ReactElement
 */
export default function CheckoutPaymentInfo() {
  const navigate = useNavigate();
  const billingCards = useCardState((state) => state.cards);
  const { toggleSwitch, switchValue } = useSwitch();
  const {
    toggleSwitch: completedPaymentModalToggle,
    switchValue: completedPaymentModalToggleValue,
  } = useSwitch();
  const checkoutMutation = useCheckout();
  const { data: cart } = useCart();
  const noBillingCards = billingCards.length === 0;

  const currentBillingCardCount = useRef(billingCards.length);

  const checkBillingCardCount = () => {
    if (billingCards.length > currentBillingCardCount.current) {
      currentBillingCardCount.current = billingCards.length;
      return true;
    }

    return false;
  };

  const newBillingCardAdded = checkBillingCardCount();

  if (newBillingCardAdded) {
    setTimeout(() => {
      toggleSwitch();
      completedPaymentModalToggle();
    }, 500);
  }

  // Create checkout info for new card payments
  const checkoutInfo: CheckoutInfo | undefined = {
    callbackUrl: `${window.location.origin}/dashboard/cart/checkout/success`,
  };

  const paymentHandler = async () => {
    // Use the real checkout API instead of fake timeout
    checkoutMutation.mutate();
  };

  const noBilling = (
    <div className="w-full max-w-[500px] flex flex-col items-center justify-center gap-2">
      <img src={paymentWallet} alt="" className="size-[200px]" />

      <p className="font-light text-center text-neutral-500">
        you have not added a payment option.
      </p>

      <Button
        text="Add card"
        variant="solid"
        className="w-full max-w-[175px]"
        onClick={toggleSwitch}
      />
    </div>
  );

  return (
    <div className="w-full h-full bg-white mt-5 rounded-sm p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h5 className="text-[28px] font-semibold">Payment Information</h5>

        <Button
          type="submit"
          variant="clear"
          className=""
          onClick={toggleSwitch}
        >
          <div className="w-full flex items-center gap-2 text-neutral-900">
            <PlusIcon size="20px" />
            <span>Add new card</span>
          </div>
        </Button>
      </div>

      {!noBillingCards && <BillingCardList />}

      <div className="w-full h-full flex flex-col items-center justify-center">
        {noBillingCards && (
          <div className="w-full h-auto flex items-center justify-center mb-6">
            {noBilling}
          </div>
        )}
      </div>

      {!noBillingCards && (
        <div className="w-full flex items-center justify-center py-[2.5rem] px-[1.5rem] border-t border-[#E8E8E8] mt-1">
          <Button
            type="submit"
            variant="solid"
            className={`w-full max-w-[23.4375rem] disabled:bg-neutral-100 disabled:cursor-not-allowed`}
            disabled={checkoutMutation.isPending}
            onClick={paymentHandler}
          >
            <div className="flex items-center justify-center gap-1">
              <span>{checkoutMutation.isPending ? "Processing..." : "Pay Now"}</span>
              {checkoutMutation.isPending && <Spinner size="sm" speed="fast" />}
            </div>
          </Button>
        </div>
      )}

      <Modal
        isOpen={switchValue}
        onClose={toggleSwitch}
        containerClassName="w-full max-w-[26rem]"
      >
        <BillingCardForm 
          checkoutInfo={checkoutInfo}
        />
      </Modal>

      {/* Completed payment modal */}
      <Modal
        isOpen={completedPaymentModalToggleValue}
        onClose={completedPaymentModalToggle}
        containerClassName="w-[25rem] flex flex-col items-center justify-center"
      >
        <img src={checkMark} alt="" className="size-[100px]" />

        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold text-[2rem] text-neutral-950">
            Payment Successful
          </h2>

          <p className="font-light text-neutral-700 text-center leading-snug">
            Your payment of ₦{cart?.total.toLocaleString() || '0.00'} was successful.
          </p>

          <Button
            text="Continue shopping"
            variant="solid"
            className="w-full bg-primary-500 text-white"
            onClick={() => navigate("/dashboard/shop")}
          />
        </div>
      </Modal>
    </div>
  );
}
