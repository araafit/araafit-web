import apiClient from "../lib/axios";
import type { ApiResponse } from "./auth.service";

// Card interfaces
export interface Card {
  id: string;
  cardholderName: string;
  maskedNumber: string;
  last4: string;
  expiry: string;
  cardType: "visa" | "mastercard" | "other";
  bank: string;
  brand: string;
  isActive: boolean;
  createdAt: string;
}

export interface CardTokenizeRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
  callbackUrl?: string; // Optional callback URL for popup flow
}

export interface CardTokenizeResponse {
  message: string;
  authorizationUrl: string;
  reference: string;
  cardholderName: string;
}

export interface CardSaveRequest {
  reference: string;
  cardholderName: string;
}

export interface CardSaveResponse {
  message: string;
  card: {
    id: string;
    cardholderName: string;
    last4: string;
    expMonth: string;
    expYear: string;
    cardType: string;
    bank: string;
    brand: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface CardDirectSaveRequest {
  cardholderName: string;
  authorizationCode: string;
  bin: string;
  last4: string;
  expMonth: string;
  expYear: string;
  cardType: string;
  bank: string;
  brand: string;
  countryCode: string;
  signature: string;
  customerCode: string;
}

export interface CardPaymentInfo {
  id: string;
  authorizationCode: string;
  maskedNumber: string;
  cardType: string;
  bank: string;
  brand: string;
  reusable: boolean;
}

export interface CardChargeRequest {
  amount: number;
  email: string;
  reference: string;
}

export interface CardChargeResponse {
  message: string;
  reference: string;
  amount: number;
  status: string;
}

export interface CardUpdateRequest {
  cardholderName: string;
}

export interface CardUpdateResponse {
  message: string;
}

export interface CardCheckoutRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
  amount: number;
  reference: string;
  saveCard: boolean;
  callbackUrl: string;
  metadata: string;
}

export interface CardCheckoutResponse {
  message: string;
  authorizationUrl: string;
  reference: string;
  amount: number;
  saveCard: boolean;
}

export interface SaveAfterPaymentRequest {
  reference: string;
}

export interface SaveAfterPaymentResponse {
  message: string;
  cardSaved: boolean;
  card: {
    id: string;
    cardholderName: string;
    last4: string;
    expiry: string;
    cardType: string;
    bank: string;
    brand: string;
    createdAt: string;
  };
}

// Service functions
export const cardsService = {
  // Get all user cards
  async getCards(): Promise<Card[]> {
    try {
      const response = await apiClient.get<ApiResponse<Card[]>>("/cards");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cards:", error);
      throw error;
    }
  },

  // Tokenize card (step 1 of adding new card)
  async tokenizeCard(data: CardTokenizeRequest): Promise<CardTokenizeResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CardTokenizeResponse>>(
        "/cards/tokenize",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error tokenizing card:", error);
      throw error;
    }
  },

  // Save tokenized card (step 2 of adding new card)
  async saveCard(data: CardSaveRequest): Promise<CardSaveResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CardSaveResponse>>(
        "/cards/save",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error saving card:", error);
      throw error;
    }
  },

  // Direct save card (if frontend handles tokenization)
  async directSaveCard(data: CardDirectSaveRequest): Promise<Card> {
    try {
      const response = await apiClient.post<ApiResponse<Card>>("/cards", data);
      return response.data.data;
    } catch (error) {
      console.error("Error directly saving card:", error);
      throw error;
    }
  },

  // Get card payment info
  async getCardPaymentInfo(cardId: string): Promise<CardPaymentInfo> {
    try {
      const response = await apiClient.get<ApiResponse<CardPaymentInfo>>(
        `/cards/${cardId}/payment`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching card payment info for ${cardId}:`, error);
      throw error;
    }
  },

  // Charge card
  async chargeCard(
    cardId: string,
    data: CardChargeRequest
  ): Promise<CardChargeResponse> {
    try {
      const response = await apiClient.post<CardChargeResponse>(
        `/cards/${cardId}/charge`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error charging card ${cardId}:`, error);
      throw error;
    }
  },

  // Update card
  async updateCard(
    cardId: string,
    data: CardUpdateRequest
  ): Promise<CardUpdateResponse> {
    try {
      const response = await apiClient.patch<CardUpdateResponse>(
        `/cards/${cardId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating card ${cardId}:`, error);
      throw error;
    }
  },

  // Remove card
  async removeCard(cardId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(
        `/cards/${cardId}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing card ${cardId}:`, error);
      throw error;
    }
  },

  // Checkout with card (combines card addition and payment)
  async checkoutWithCard(data: CardCheckoutRequest): Promise<CardCheckoutResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CardCheckoutResponse>>(
        "/cards/checkout",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error during card checkout:", error);
      throw error;
    }
  },

  // Save card after successful payment
  async saveAfterPayment(data: SaveAfterPaymentRequest): Promise<SaveAfterPaymentResponse> {
    try {
      const response = await apiClient.post<ApiResponse<SaveAfterPaymentResponse>>(
        "/cards/save-after-payment",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Error saving card after payment:", error);
      throw error;
    }
  },
};
