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
  yardEstimate: string;
  noteForTailor: string;
  gender: string;
  fabricId: string;
}

export interface SewingRequestResponse extends FabricSize {
  id: string;
  user: User;
  fabric: Fabric;
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
      "/sewing-requests",
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
}

export const fabricRequestService = new FabricRequestService();
