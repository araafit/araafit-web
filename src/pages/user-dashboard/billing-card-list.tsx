import { useState } from "react";
import {
  TrashSimpleIcon,
  PencilSimpleIcon,
  CreditCardIcon,
} from "@phosphor-icons/react";
import Button from "../../shared-components/button";
import { useCards, useRemoveCard } from "../../hooks/cards.hooks";
import mastercardLogo from "./mastercard-logo.svg";
import visaLogo from "./visa-logo.svg";
import Modal from "../../shared-components/modal";
import { useSwitch } from "../../shared-hooks/switch";
import Spinner from "../../shared-components/spinner";

/* ------------------------------------------------------------------ */

export default function BillingCardList() {
  const cardStyle = "w-[40px] h-[25px]";

  const [cardIdToBeRemoved, setCardIdToBeRemoved] = useState<string>("");
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const { toggleSwitch: toggleDeleteModal, switchValue: deleteModalIsOpen } =
    useSwitch(false);

  const { data: cards = [], isLoading, isError } = useCards();
  const removeCardMutation = useRemoveCard();

  const initiateCardRemoval = (cardId: string) => {
    setCardIdToBeRemoved(cardId);
    toggleDeleteModal();
  };

  const removeCardHandler = async () => {
    if (cardIdToBeRemoved) {
      await removeCardMutation.mutateAsync(cardIdToBeRemoved);
      toggleDeleteModal();
      setCardIdToBeRemoved("");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" speed="fast" arcColor="#9A6C50" />
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <p className="text-red-600">Error loading cards</p>
      </div>
    );
  }

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
                onClick={() => setSelectedCardId(card.id)}
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
                    {card.maskedNumber}
                  </div>
                  <div className="text-sm text-neutral-500">
                    Expires {card.expiry}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {card.cardholderName}
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
                onClick={() => initiateCardRemoval(card.id)}
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
            text={removeCardMutation.isPending ? "Removing..." : "Remove"}
            variant="solid"
            className="w-full bg-red-500 text-white"
            disabled={removeCardMutation.isPending}
            onClick={removeCardHandler}
          >
            {!removeCardMutation.isPending ? (
              <span>Remove</span>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Removing</span>
                <Spinner
                  size="sm"
                  speed="fast"
                  isLoading={removeCardMutation.isPending}
                  circleColor="#9A6C50"
                />
              </div>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}
