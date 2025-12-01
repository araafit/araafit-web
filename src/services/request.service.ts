import apiClient from "../lib/axios";
import { type ApiResponse } from "./admin-auth.service";
import type { User } from "../stores/auth-store";
import type { Measurements } from "./measurements.service";
import { AxiosError } from "axios";
/* ------------------------------------------------------- */

export interface Fabric {
  id: string;
  name: string;
  category: string;
  description: string;
  materialType: string;
  dressSize: number | null;
  weight: string;
  thickness: string;
  quantityInStock: number;
  price: string;
  pricePerYard: number | null;
  discountType: number | null;
  discountValue: number | null;
  discountStart: number | null;
  discountEnd: number | null;
  totalSize: number | null;
  style: string | null;
  patternType: string | null;
  skinToneRecommendation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FabricSize {
  size: string;
  dressStyle: string;
  yardEstimate: number;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  dressSize: number;
  skinTone: string;
  noteForTailor: string;
  status: string;
  pricePerYard: number;
  totalAmount: number;
  paymentMethod: string;
  deliveryDate: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SewingRequest extends Measurements {
  size: string;
  dressStyle: string;
  yardEstimate: string | number;
  noteForTailor: string;
  gender: string;
  fabricId: string;
}

export interface SewingRequestResponse extends FabricSize {
  id: string;
  user: User;
  fabric: Fabric;
}

export interface SewingRequestReviewPayload {
  fabricId: string;
  styleId: string;
  measurementId: string;
  yardEstimate: number;
  noteForTailor: string;
}

export interface ReviewMeasurements {
  id: string;
  name: string;
  chest: number;
  waist: number;
  hips: number;
  neck: number | null;
  sleeve: number | null;
  inseam: number | null;
  shoulder: number | null;
  height: number;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewPrice {
  pricePerYard: number;
  yardEstimate: number;
  fabricCost: number;
  styleCost: number;
  originalAmount: number;
  discountAmount: number;
  totalAmount: number;
}

interface DiscountApplied {
  name: string;
  value: number;
  type: "percentage" | "fixed";
}

export interface SewingRequestReviewResponse {
  fabric: {
    id: string;
    name: string;
    pricePerYard: number;
    details: string;
  };
  style: {
    id: string;
    dressStyle: string;
    dressSize: string;
    sewingPrice: number;
  };
  measurement: ReviewMeasurements;
  price: ReviewPrice;
  discountApplied: null | DiscountApplied;
}

class FabricRequestService {
  async getSewingRequest() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.get<ApiResponse<any>>("/sewing-requests");

    if (response.status === 401) {
      const error = new AxiosError(
        "Unable to load sewing requests",
        response.status.toString(),
        response.config,
        response.request,
        response
      );

      throw error;
    }

    return response.data;
  }

  async makeSewingRequest(payload: SewingRequest) {
    const response = await apiClient.post<ApiResponse<SewingRequestResponse>>(
      "/sewing-requests/checkout",
      payload
    );

    if (response.status !== 201) {
      const error = new AxiosError(
        "Unable to make sewing request",
        response.status.toString(),
        response.config,
        response.request,
        response
      );
      throw error;
    }

    return response.data;
  }

  /* Review sewing request */
  async sewingRequestReview(payload: SewingRequestReviewPayload) {
    const response = await apiClient.post<
      ApiResponse<SewingRequestReviewResponse>
    >("/sewing-requests/preview", payload);

    if (response.status !== 201) {
      const error = new AxiosError(
        "Unable to make sewing request",
        response.status.toString(),
        response.config,
        response.request,
        response
      );
      throw error;
    }

    return response.data;
  }
}

export const fabricRequestService = new FabricRequestService();
