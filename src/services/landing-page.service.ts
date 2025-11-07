import apiClient from "../lib/axios";
import { AxiosError } from "axios";

/* ------------------------------------------------------------ */

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
  errors: never;
}

export interface ClaimDiscount {
  name: string;
  type: string;
  value: string | number;
  endDate: string;
}

export interface ActiveDiscount {
  id: string;
  name: string;
  type: "percentage" | "fixed_amount";
  value: string;
  eligibility: "all_customers" | "guest_customers" | "first_time_buyers";
  usageLimit: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type DiscountObjType = Record<"discount", ClaimDiscount>;

class LandingPageService {
  async claimDiscount(): Promise<DiscountObjType> {
    const response = await apiClient.post<
      ApiResponse<DiscountObjType> | DiscountObjType
    >("/discounts/claim");

    const data = response.data as DiscountObjType;

    return data;
  }

  async getActiveDiscounts(): Promise<ActiveDiscount[]> {
    const response = await apiClient.get<ApiResponse<ActiveDiscount[]>>(
      "/discounts/active"
    );
    const data: ApiResponse<ActiveDiscount[]> = response.data;

    if (!data.success) {
      const axiosError = new AxiosError(
        data.message || "Failed to catch active discount",
        response.status === 401 ? "ERR_BAD_REQUEST" : "ERR_BAD_RESPONSE",
        response.config,
        response.request,
        response
      );

      throw axiosError;
    }

    return data.data;
  }
}

export const landingPageService = new LandingPageService();
