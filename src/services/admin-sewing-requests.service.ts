import apiClient from "../lib/axios";
import type { ApiResponse } from "./admin-auth.service";

// Types for Admin Sewing Requests
export interface RequestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface FabricImage {
  id: string;
  url: string;
}

export interface RequestFabric {
  id: string;
  name: string;
  pricePerYard: number;
  images?: FabricImage[];
}

export interface RequestRider {
  id: string;
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface AdminSewingRequest {
  id: string;
  user: RequestUser;
  fabric: RequestFabric;
  rider?: RequestRider;
  size: string;
  dressStyle: string;
  yardEstimate: number;
  bust: number;
  waist: number;
  hips: number;
  height: number;
  dressSize: number;
  skinTone: string;
  noteForTailor?: string;
  pricePerYard: number;
  totalAmount: number;
  status: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetSewingRequestsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface AddRequestRiderRequest {
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface UpdateRequestRiderRequest {
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface UpdateSewingRequestRequest {
  noteForTailor?: string;
  status?: string;
  yardEstimate?: number;
}

export interface UpdateRequestStatusRequest {
  status: string;
}

export interface UpdateRequestStatusResponse {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteRequestResponse {
  message: string;
}

// Admin Sewing Requests Service Class
class AdminSewingRequestsService {
  /**
   * Get sewing requests with optional status filter
   */
  async getSewingRequests(
    params: GetSewingRequestsParams = {}
  ): Promise<AdminSewingRequest[]> {
    const queryParams = new URLSearchParams();

    if (params.status) {
      queryParams.append("status", params.status);
    }
    if (params.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const endpoint = queryParams.toString()
      ? `/sewing-requests?${queryParams.toString()}`
      : "/sewing-requests";

    const response = await apiClient.get<ApiResponse<AdminSewingRequest[]>>(
      endpoint
    );
    return response.data.data;
  }

  /**
   * Add rider to a sewing request
   */
  async addRequestRider(
    requestId: string,
    data: AddRequestRiderRequest
  ): Promise<AdminSewingRequest> {
    const response = await apiClient.post<ApiResponse<AdminSewingRequest>>(
      `/sewing-requests/${requestId}/add-rider`,
      data
    );
    return response.data.data;
  }

  /**
   * Update rider information for a sewing request
   */
  async updateRequestRider(
    requestId: string,
    data: UpdateRequestRiderRequest
  ): Promise<AdminSewingRequest> {
    const response = await apiClient.patch<ApiResponse<AdminSewingRequest>>(
      `/sewing-requests/${requestId}/update-rider`,
      data
    );
    return response.data.data;
  }

  /**
   * Update sewing request
   */
  async updateSewingRequest(
    requestId: string,
    data: UpdateSewingRequestRequest
  ): Promise<AdminSewingRequest> {
    const response = await apiClient.patch<AdminSewingRequest>(
      `/sewing-requests/${requestId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete sewing request
   */
  async deleteSewingRequest(requestId: string): Promise<DeleteRequestResponse> {
    const response = await apiClient.delete<ApiResponse<DeleteRequestResponse>>(
      `/sewing-requests/${requestId}`
    );
    return response.data.data;
  }

  /**
   * Update sewing request status
   */
  async updateRequestStatus(
    requestId: string,
    data: UpdateRequestStatusRequest
  ): Promise<UpdateRequestStatusResponse> {
    const response = await apiClient.patch<ApiResponse<UpdateRequestStatusResponse>>(
      `/admin/requests/${requestId}/status`,
      data
    );
    return response.data.data;
  }
}

// Export singleton instance
export const adminSewingRequestsService = new AdminSewingRequestsService();
export default adminSewingRequestsService;
