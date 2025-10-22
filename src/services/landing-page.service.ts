import apiClient from "../lib/axios";

/* ------------------------------------------------------------ */

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
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
  type: string;
  value: string;
  eligibility: string;
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
    >("/discount/claim");

    const data = response.data as DiscountObjType;

    return data;
  }

  async getActiveDiscounts(): Promise<ActiveDiscount> {
    const response = await apiClient.get<ApiResponse<ActiveDiscount>>(
      "/discounts/active"
    );
    const data: any = response.data as any;

    return data as ActiveDiscount;
  }
}

export const landingPageService = new LandingPageService();
