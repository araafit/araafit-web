import { useRef } from "react";
import {
  TrashSimpleIcon,
  PencilSimpleIcon,
  CreditCardIcon,
} from "@phosphor-icons/react";
import Button from "../../shared-components/button";
import { useCardState } from "../../hooks/state-store";
import mastercardLogo from "./mastercard-logo.svg";
import visaLogo from "./visa-logo.svg";
import Modal from "../../shared-components/modal";
import { useSwitch } from "../../hooks/switch";

/* ------------------------------------------------------------------ */

export default function BillingCardList() {
  const cardStyle = "w-[40px] h-[25px]";

  const cardIdToBeRemoved = useRef<number | string>(0);

  const { toggleSwitch: toggleDeleteModal, switchValue: deleteModalIsOpen } =
    useSwitch(false);

  const cards = useCardState((state) => state.cards);
  const selectedCardId = useCardState((state) => state.selectedCardId);
  const selectCard = useCardState((state) => state.selectCard);
  const removeCardFromState = useCardState((state) => state.removeCard);

  const setCardIdToBeRemoved = (cardId: number | string) => {
    toggleDeleteModal();

    if (cardIdToBeRemoved.current) cardIdToBeRemoved.current = cardId;
  };

  const removeCardHandler = () => {
    setTimeout(() => toggleDeleteModal(), 500);

    removeCardFromState(cardIdToBeRemoved.current);
  };

  return (
    <>
      <div className="w-full space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border border-[#B9B9B9] rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex items-center flex-grow">
              <div
                className="size-4 rounded-full border-2 border-primary-500 flex items-center justify-center cursor-pointer"
                onClick={() => selectCard(card.id)}
              >
                {selectedCardId === card.id && (
                  <div className="size-[6px] rounded-full bg-primary-500" />
                )}
              </div>

              <div className="flex items-center ml-4">
                {card.cardType === "mastercard" ? (
                  <img src={mastercardLogo} alt="" className={`${cardStyle}`} />
                ) : card.cardType === "visa" ? (
                  <img src={visaLogo} alt="" className={`${cardStyle}`} />
                ) : (
                  <CreditCardIcon size="40px" />
                )}
                <div className="ml-4">
                  <div className="text-sm font-normal text-neutral-900">
                    xxxx xxxx xxxx {card.cardNumber}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Expires {card.expiry}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="button"
                aria-label="Edit card"
                className="size-[40px]"
              >
                <PencilSimpleIcon size="20px" className="text-neutral-900" />
              </Button>

              <Button
                type="button"
                aria-label="Delete card"
                onClick={() => setCardIdToBeRemoved(card.id)}
                className="size-[40px]"
              >
                {<TrashSimpleIcon size="20px" className="text-red-500" />}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onClose={toggleDeleteModal}
        containerClassName="w-[25rem]"
      >
        <div className="flex flex-col items-center gap-3">
          <h2 className="font-semibold text-[2rem] text-neutral-950">
            Remove Card
          </h2>
          <p className="font-light text-neutral-700 text-center leading-snug">
            Are you sure you want to remove this card and its information? This
            action cannot be undone.
          </p>

          <Button
            text="Cancel"
            variant="clear"
            className="w-full text-neutral-900 shadow-sm"
            onClick={toggleDeleteModal}
          />

          <Button
            text="Remove"
            variant="solid"
            className="w-full bg-red-500 text-white"
            onClick={removeCardHandler}
          />
        </div>
      </Modal>
    </>
  );
}
