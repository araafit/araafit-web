import apiClient from "../lib/axios";
import { type ApiResponse } from "./admin-auth.service";
import { type User } from "../stores/auth-store";

/* ---------------------------------------------------------------- */

// Enum for notification types
enum NotificationType {
  PURCHASE = "PURCHASE",
  CART = "CART",
  DELIVERY = "DELIVERY"
}

// Interface for Purchase notification metadata
export interface PurchaseMetadata {
  orderId: string;
  requestId?: string
  totalAmount: string;
}

// Interface for Cart notification metadata
export interface CartMetadata {
  productId: string;
  quantity: number;
  size: string;
}

// Union type for metadata (can be either Purchase or Cart)
export type NotificationMetadata = PurchaseMetadata | CartMetadata;

// Interface for individual notification item
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata: NotificationMetadata;
  isRead: boolean;
  user: User;
  userId: string;
  createdAt: string;
}

// Interface for the complete API response
export interface NotificationResponse {
  data: Notification[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
};

export const userNotificationService = {
  async getAllNotification(): Promise<NotificationResponse> {
    const response = await apiClient.get<ApiResponse<NotificationResponse>>(
      "/notifications/all"
    );

    return response.data.data;
  },

  async readNotification(id: number): Promise<Omit<Notification, "User">> {
    const response = await apiClient.post<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );

    return response.data.data;
  },

  async deleteNotification(id: number): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/notifications/${id}`);

    return response.data;
  },
};
