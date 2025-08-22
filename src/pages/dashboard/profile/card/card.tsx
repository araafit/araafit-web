import { useRef } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { useCardState } from "../../../../hooks/state-store";
import { useSwitch } from "../../../../hooks/switch";
import Button from "../../../../shared-components/button";
import Modal from "../../../../shared-components/modal";
import CardList from "./card-list";
import paymentWallet from "./payment-wallet.png";
import checkMark from "./checkmark.png";
import BillingCardForm from "../../billing-card-form";

/* ------------------------------------------------------------------ */

export interface BillingCard {
  id: number | string;
  cardHolder?: string;
  cardType: "mastercard" | "visa" | "other";
  cardNumber: number | string;
  expiry: string;
  cvv: number | string;
}

/**
 * Billing card
 *
 * @returns ReactElement
 */
export default function BillingCards() {
  const billingCards = useCardState((state) => state.cards);
  const { toggleSwitch: addModalToggle, switchValue: addModalIsOpen } =
    useSwitch(false);
  const {
    toggleSwitch: confirmationModalToggle,
    switchValue: confirmationModalIsOpen,
  } = useSwitch(false);
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
      addModalToggle();
      confirmationModalToggle();
    }, 500);
  }

  return (
    <div className="h-full bg-white py-5 px-8 rounded-md flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h5 className="text-[28px] font-semibold">Payment Information</h5>

        <Button
          type="submit"
          variant="clear"
          className=""
          onClick={addModalToggle}
        >
          <div className="w-full flex items-center gap-2 text-neutral-900">
            <PlusIcon size="20px" />
            <span>Add new card</span>
          </div>
        </Button>
      </div>

      {/* Card list */}
      <CardList />

      {/* No card */}
      {billingCards.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <img src={paymentWallet} alt="" className="size-[200px]" />

          <p className="font-light text-center text-neutral-500">
            you have not added a payment option.
          </p>

          <Button
            text="Add card"
            variant="solid"
            className="w-full max-w-[175px]"
            onClick={addModalToggle}
          />
        </div>
      )}

      {/* Added card modal */}
      <Modal
        isOpen={addModalIsOpen}
        onClose={addModalToggle}
        containerClassName="w-full max-w-[26rem]"
      >
        <BillingCardForm />
      </Modal>

      {/* confirmation modal */}
      <Modal
        isOpen={confirmationModalIsOpen}
        onClose={confirmationModalToggle}
        containerClassName="w-[25rem] flex flex-col items-center justify-center"
      >
        <img src={checkMark} alt="" className="size-[100px]" />

        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold text-[2rem] text-neutral-950">
            New Card Added!
          </h2>

          <p className="font-light text-neutral-700 text-center leading-snug">
            You have successfully saved a new card.
          </p>

          <Button
            text="Continue"
            variant="solid"
            className="w-full bg-primary-500 text-white"
            onClick={confirmationModalToggle}
          />
        </div>
      </Modal>
    </div>
  );
}