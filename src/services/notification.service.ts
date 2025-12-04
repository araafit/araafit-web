import apiClient from "../lib/axios";
import { type ApiResponse } from "./admin-auth.service";

/* ---------------------------------------------------------------- */

// Enum for notification types
export enum NotificationType {
  PURCHASE = "PURCHASE",
  CART = "CART",
  DELIVERY = "DELIVERY",
}

// Interface for Purchase notification metadata
export interface PurchaseMetadata {
  orderId?: string;
  requestId?: string;
  totalAmount: number | string;
  [key: string]: unknown; // Allow additional fields
}

// Interface for Cart notification metadata
export interface CartMetadata {
  productId: string;
  quantity: number;
  size: string;
}

// Union type for metadata (can be either Purchase or Cart)
export type NotificationMetadata = PurchaseMetadata | CartMetadata | Record<string, unknown>;

// Interface for individual notification item
export interface Notification {
  id: string;
  type: string; // API returns string, not enum
  title: string;
  message: string;
  metadata: NotificationMetadata;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

// Interface for the complete API response
export interface NotificationResponse {
  userId: string;
  total: number;
  notifications: Notification[];
}

export interface NotificationPreferences {
  receiveEmailNotifications: boolean;
  receiveInAppNotifications: boolean;
}

export const userNotificationService = {
  async getAllNotification(): Promise<NotificationResponse> {
    const response = await apiClient.get<ApiResponse<NotificationResponse>>(
      "/notifications"
    );

    return response.data.data;
  },

  async readNotification(id: string): Promise<Notification> {
    const response = await apiClient.post<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );

    return response.data.data;
  },

  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/notifications/${id}`
    );

    return response.data;
  },

  async enableEmailNotification(
    enable: boolean
  ): Promise<NotificationPreferences> {
    const response = await apiClient.post<ApiResponse<NotificationPreferences>>(
      "/notifications/preferences",
      {
        receiveEmailNotifications: enable,
        receiveInAppNotifications: false,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update email notification preference");
    }

    return response.data.data;
  },

  async enableInAppNotification(
    enable: boolean
  ): Promise<NotificationPreferences> {
    const response = await apiClient.post<ApiResponse<NotificationPreferences>>(
      "/notifications/preferences",
      {
        receiveEmailNotifications: false,
        receiveInAppNotifications: enable,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update in-app notification preference");
    }

    return response.data.data;
  },
};
