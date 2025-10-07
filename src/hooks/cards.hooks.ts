import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cardsService,
  type CardTokenizeRequest,
  type CardSaveRequest,
  type CardDirectSaveRequest,
  type CardChargeRequest,
  type CardUpdateRequest,
  type CardCheckoutRequest,
  type SaveAfterPaymentRequest,
} from "../services/cards.service";
import toast from "react-hot-toast";

/* ------------------------------------------ */

// Query hooks for fetching data
export const useCards = () => {
  return useQuery({
    queryKey: ["cards"],
    queryFn: () => cardsService.getCards(),
  });
};

export const useCardPaymentInfo = (cardId: string) => {
  return useQuery({
    queryKey: ["card-payment", cardId],
    queryFn: () => cardsService.getCardPaymentInfo(cardId),
    enabled: !!cardId,
  });
};

// Mutation hooks for actions
export const useTokenizeCard = () => {
  return useMutation({
    mutationFn: (data: CardTokenizeRequest) => cardsService.tokenizeCard(data),
    onSuccess: () => {
      toast.success("Card tokenization initiated");
      // You might want to redirect to the authorization URL here
      // window.location.href = data.authorizationUrl;
    },
    onError: (error: Error) => {
      toast.error(`Card tokenization failed: ${error.message}`);
    },
  });
};

export const useSaveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CardSaveRequest) => cardsService.saveCard(data),
    onSuccess: () => {
      toast.success("Card saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save card: ${error.message}`);
    },
  });
};

export const useDirectSaveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CardDirectSaveRequest) =>
      cardsService.directSaveCard(data),
    onSuccess: () => {
      toast.success("Card added successfully!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to add card: ${error.message}`);
    },
  });
};

export const useChargeCard = () => {
  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: CardChargeRequest;
    }) => cardsService.chargeCard(cardId, data),
    onSuccess: (data) => {
      toast.success(`Payment successful! Reference: ${data.reference}`);
    },
    onError: (error: Error) => {
      toast.error(`Payment failed: ${error.message}`);
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: CardUpdateRequest;
    }) => cardsService.updateCard(cardId, data),
    onSuccess: () => {
      toast.success("Card updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update card: ${error.message}`);
    },
  });
};

export const useRemoveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => cardsService.removeCard(cardId),
    onSuccess: () => {
      toast.success("Card removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove card: ${error.message}`);
    },
  });
};

export const useCheckoutWithCard = () => {
  return useMutation({
    mutationFn: (data: CardCheckoutRequest) =>
      cardsService.checkoutWithCard(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
      window.location.href = data.authorizationUrl;
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
};

export const useSaveAfterPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveAfterPaymentRequest) =>
      cardsService.saveAfterPayment(data),
    onSuccess: () => {
      toast.success("Payment successful, card saved for future use!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save card after payment: ${error.message}`);
    },
  });
};
