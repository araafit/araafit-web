import { useRef } from "react";
import { useCardState } from "../../shared-hooks/state-store";
import { useSwitch } from "../../shared-hooks/switch";
import Button from "../button";
import Modal from "../modal";
// import Spinner from "../spinner";
import BillingCardForm from "../../pages/user-dashboard/billing-card-form";
import BillingCardList from "../../pages/user-dashboard/billing-card-list";
import { checkMark } from "../../shared-images/image-entry";
import { paymentWallet } from "../../shared-images/image-entry";
import { useNavigate } from "react-router-dom";
// import { useCheckout } from "../../hooks/orders.hooks";
import { useCart } from "../../hooks/cart.hooks";
import { formatPrice } from "../../utils/format-price";
import { useCards } from "../../hooks/cards.hooks";

/* ---------------------------------------------------------------------------------- */

/**
 * Checkout payment information component
 *
 * @returns ReactElement
 */
export default function CheckoutPaymentInfo({
  redirectionLink,
}: {
  redirectionLink?: string;
}) {
  const { data: cart, isSuccess } = useCart();
  const { data: cards = [] } = useCards();
  const navigate = useNavigate();
  const billingCards = useCardState((state) => state.cards);
  const { toggleSwitch, switchValue } = useSwitch();
  const {
    toggleSwitch: completedPaymentModalToggle,
    switchValue: completedPaymentModalToggleValue,
  } = useSwitch();
  // const checkoutMutation = useCheckout();

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

  /*const paymentHandler = async () => {
    // Use the real checkout API instead of fake timeout
    checkoutMutation.mutate();
  };*/

  const noBilling = cards.length === 0 && (
    <div className="w-full flex flex-col items-center justify-center gap-2">
      <img src={paymentWallet} alt="" className="size-[200px]" />

      {/* <p className="font-light text-center text-neutral-500">
        you have not added a payment option.
      </p> */}

      <Button
        text="Pay Now"
        variant="solid"
        className="w-full max-w-[175px]"
        onClick={toggleSwitch}
      />
    </div>
  );

  return (
    <div className="size-full ] bg-white mt-5 rounded-md p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h5 className="text-[28px] font-semibold">Payment Information</h5>
      </div>

      {noBilling}

      {cards.length > 0 && <BillingCardList />}

      {/* <div className="w-full flex items-center justify-center py-[2.5rem] px-[1.5rem] border-t border-[#E8E8E8] mt-1">
        <Button
          type="submit"
          variant="solid"
          className={`w-full max-w-[23.4375rem] disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:text-opacity-40`}
          disabled={checkoutMutation.isPending || checkoutMutation.isIdle}
          onClick={paymentHandler}
        >
          <div className="flex items-center justify-center gap-1">
            <span>Pay Now</span>

            <Spinner
              size="sm"
              speed="fast"
              isLoading={checkoutMutation.isPending}
              arcColor="#9A6C50"
            />
          </div>
        </Button>
      </div> */}

      {/* Billing form */}
      <Modal
        isOpen={switchValue}
        onClose={toggleSwitch}
        containerClassName="w-full max-w-[26rem]"
      >
        <BillingCardForm />
      </Modal>

      {/* Completed payment modal */}
      <Modal
        isOpen={isSuccess && completedPaymentModalToggleValue}
        onClose={completedPaymentModalToggle}
        containerClassName="w-[25rem] flex flex-col items-center justify-center"
      >
        <img src={checkMark} alt="" className="size-[100px]" />

        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold text-[2rem] text-neutral-950">
            Payment Successful
          </h2>

          <p className="font-light text-neutral-700 text-center leading-snug">
            Your payment of [₦{cart && formatPrice(cart.total)}] was successful.
          </p>

          <Button
            text="Continue shopping"
            variant="solid"
            className="w-full bg-primary-500 text-white"
            onClick={
              redirectionLink ? () => navigate(redirectionLink) : () => {}
            }
          />
        </div>
      </Modal>
    </div>
  );
}
