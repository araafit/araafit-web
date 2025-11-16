import apiClient from "../lib/axios";
import type { ApiResponse } from "./admin-auth.service";

// Types for Admin Orders
export interface OrderUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  deliveryAddress: string;
  dateOfBirth: string;
  password: string | null;
  isVerified: boolean;
  phoneNumber: string | null;
  city: string | null;
  zipCode: string | null;
  dressSize: string | null;
  skinTone: string | null;
  isGuest: boolean;
  createdAt: string; // or Date
  isActive: boolean;
  blockReason: string | null;
}

export interface OrderRider {
  id: string;
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface OrderProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  materialType: string;
  dressSize: string;
  weight: string;
  thickness: string;
  quantityInStock: number;
  price: string;
  pricePerYard: string | null;
  discountType: "percent" | "fixed" | null;
  discountValue: string | null;
  discountStart: string | null;
  discountEnd: string | null;
  totalSize: string | null;
  style: string | null;
  patternType: string | null;
  skinToneRecommendation: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: OrderProduct;
  quantity: number;
  size: string;
}

export interface AdminOrder {
  id: string;
  user: OrderUser;
  rider?: OrderRider;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetOrdersParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface AddRiderRequest {
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface UpdateRiderRequest {
  name: string;
  phone: string;
  deliveryDate: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateOrderStatusResponse {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Admin Orders Service Class
class AdminOrdersService {
  /**
   * Get order
   */
  async getOrder(orderId: string | number): Promise<AdminOrder> {
    const response = await apiClient.get<ApiResponse<AdminOrder>>(`orders/admin/` + orderId);

    return response.data.data;
  }

  /**
   * Get orders with optional status filter
   */
  async getOrders(params: GetOrdersParams = {}): Promise<AdminOrder[]> {
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

    const response = await apiClient.get<ApiResponse<AdminOrder[]>>(
      `/orders?${queryParams.toString()}`
    );
    return response.data.data;
  }

  /**
   * Add rider to an order
   */
  async addRider(orderId: string, data: AddRiderRequest): Promise<AdminOrder> {
    const response = await apiClient.post<AdminOrder>(
      `/orders/${orderId}/add-rider`,
      data
    );
    return response.data;
  }

  /**
   * Update rider information for an order
   */
  async updateRider(
    orderId: string,
    data: UpdateRiderRequest
  ): Promise<AdminOrder> {
    const response = await apiClient.patch<AdminOrder>(
      `/orders/${orderId}/update-rider`,
      data
    );
    return response.data;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> {
    const response = await apiClient.patch<UpdateOrderStatusResponse>(
      `/admin/orders/${orderId}/status`,
      data
    );
    return response.data;
  }

  // Approve and and reject orders
  async approveOrder(orderId: string): Promise<AdminOrder> {
    try {
      const response = await apiClient.patch<ApiResponse<AdminOrder>>(
        `/admin/order/${orderId}/approve`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error approving order ${orderId}:`, error);
      throw error;
    }
  }

  async rejectOrder(orderId: string): Promise<AdminOrder> {
    try {
      const response = await apiClient.patch<ApiResponse<AdminOrder>>(
        `/admin/order/${orderId}/reject`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error rejecting order ${orderId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const adminOrdersService = new AdminOrdersService();
export default adminOrdersService;
