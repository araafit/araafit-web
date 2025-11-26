import axios from "axios";
import { type ApiResponse } from "./admin-auth.service";
import { type User } from "../stores/auth-store";

/* ---------------------------------------------------------------- */

// Enum for notification types
enum NotificationType {
  PURCHASE = "PURCHASE",
  CART = "CART",
}

// Interface for Purchase notification metadata
export interface PurchaseMetadata {
  orderId: string;
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
export type NotificationResponse = Notification[];

export const adminNotificationService = {
  async getAllNotification(): Promise<NotificationResponse> {
    const response = await axios.get<ApiResponse<NotificationResponse>>(
      "/notification/all"
    );

    return response.data.data;
  },

  async readNotification(id: number): Promise<Omit<Notification, "User">> {
    const response = await axios.post<ApiResponse<Notification>>(
      `/notification/${id}`
    );

    return response.data.data;
  },

  async deleteNotification(id: number): Promise<ApiResponse<null>> {
    const response = await axios.post<ApiResponse<null>>(`/notification/${id}`);

    return response.data;
  },
};
