import apiClient from "../lib/axios";
import type { ApiResponse } from "./admin-auth.service";

export type DiscountType = "percentage" | "fixed";
export type DiscountEligibility = "all_customers" | "guest_customers" | "first_time_buyers";

export interface ApiDiscount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  eligibility: DiscountEligibility;
  usageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  claims: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  value: number;
  eligibility: DiscountEligibility;
  usageLimit: number;
  startDate: string;
  endDate: string;
}

export interface UpdateDiscountRequest {
  name?: string;
  type?: DiscountType;
  value?: number;
  eligibility?: DiscountEligibility;
  usageLimit?: number;
  startDate?: string;
  endDate?: string;
}

export interface DeleteDiscountResponse { message: string }

class AdminDiscountsService {
  async getDiscounts(): Promise<ApiDiscount[]> {
    const response = await apiClient.get<ApiResponse<ApiDiscount[]> | ApiDiscount[]>("/discounts");
    const data: any = response.data as any;
    return Array.isArray(data) ? (data as ApiDiscount[]) : ((data.data as ApiDiscount[]) ?? []);
  }

  async getDiscount(id: string): Promise<ApiDiscount> {
    const response = await apiClient.get<ApiResponse<ApiDiscount> | ApiDiscount>(`/discounts/${id}`);
    const data: any = response.data as any;
    return (data.data as ApiDiscount) ?? (data as ApiDiscount);
  }

  async createDiscount(payload: CreateDiscountRequest): Promise<ApiDiscount> {
    const response = await apiClient.post<ApiResponse<ApiDiscount> | ApiDiscount>("/discounts", payload);
    const data: any = response.data as any;
    return (data.data as ApiDiscount) ?? (data as ApiDiscount);
  }

  async updateDiscount(id: string, payload: UpdateDiscountRequest): Promise<ApiDiscount> {
    const response = await apiClient.patch<ApiResponse<ApiDiscount> | ApiDiscount>(`/discounts/${id}`, payload);
    const data: any = response.data as any;
    return (data.data as ApiDiscount) ?? (data as ApiDiscount);
  }

  async deleteDiscount(id: string): Promise<DeleteDiscountResponse> {
    const response = await apiClient.delete<ApiResponse<DeleteDiscountResponse> | DeleteDiscountResponse>(`/discounts/${id}`);
    const data: any = response.data as any;
    return (data.data as DeleteDiscountResponse) ?? (data as DeleteDiscountResponse);
  }

  async toggleDiscount(id: string): Promise<ApiDiscount> {
    const response = await apiClient.patch<ApiResponse<ApiDiscount> | ApiDiscount>(`/discounts/${id}/toggle`, {});
    const data: any = response.data as any;
    return (data.data as ApiDiscount) ?? (data as ApiDiscount);
  }
}

export const adminDiscountsService = new AdminDiscountsService();
export default adminDiscountsService;


