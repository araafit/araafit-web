import apiClient from "../lib/axios";
import type { ProductImage } from "./products.service";

// Extended Product interface for orders (can be less detailed than full product)  
export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  images?: ProductImage[];
}

export interface OrderItem {
  id?: string;
  product: OrderProduct;
  quantity: number;
  size: string;
}

export interface Fabric {
  id: string;
  name: string;
  price: number;
}

export interface Rider {
  id: string;
  name: string;
  phone: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  id: string;
  type: "product_order" | "sewing_request";
  user?: User;
  items?: OrderItem[];
  fabric?: Fabric;
  yardEstimate?: number;
  totalAmount: number;
  status: string;
  rider: Rider | null;
  deliveryDate: string;
  paymentReference?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  orders: Order[];
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface CheckoutRequest {
  // Cart checkout - no body needed, uses existing cart
  [key: string]: never;
}

export interface InstantCheckoutRequest {
  productId: string;
  quantity: number;
  size: string;
  callbackUrl?: string;
}

export interface CheckoutResponse {
  message: string;
  paymentUrl: string;
}

export interface PaymentVerificationResponse {
  message: string;
}

export interface CancelOrderResponse {
  id: string;
  status: string;
  message: string;
}

export interface CheckoutWithCardRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  callbackUrl: string;
}

export interface CheckoutWithCardResponse {
  message: string;
  order: {
    id: string;
    totalAmount: number;
    status: string;
    itemCount: number;
  };
  payment: {
    authorizationUrl: string;
    reference: string;
  };
  saveCard: boolean;
}

// Service functions
export const ordersService = {
  // Get recent ongoing orders
  async getRecentOngoingOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get<ApiResponse<Order[]>>("/orders/myorders/ongoing/recent");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recent ongoing orders:", error);
      throw error;
    }
  },

  // Get all user orders with pagination
  async getAllOrders(page: number = 1, limit: number = 10): Promise<OrdersResponse & { pagination: unknown }> {
    try {
      const response = await apiClient.get<ApiResponse<OrdersResponse & { pagination: unknown }>>(
        `/orders/myorders?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },

  // Checkout with existing cart
  async checkout(): Promise<CheckoutResponse> {
    try {
      const response = await apiClient.post<CheckoutResponse>("/orders/checkout");
      return response.data;
    } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
    }
  },

  // Instant checkout for a single product
  async instantCheckout(data: InstantCheckoutRequest): Promise<CheckoutResponse> {
    try {
      const response = await apiClient.post<CheckoutResponse>("/orders/instant-checkout", data);
      return response.data;
    } catch (error) {
      console.error("Error during instant checkout:", error);
      throw error;
    }
  },

  // Verify payment
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await apiClient.get<PaymentVerificationResponse>(`/orders/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error(`Error verifying payment ${reference}:`, error);
      throw error;
    }
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<CancelOrderResponse> {
    try {
      const response = await apiClient.patch<CancelOrderResponse>(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      throw error;
    }
  },

  // Checkout with card (combines cart checkout with new card)
  async checkoutWithCard(data: CheckoutWithCardRequest): Promise<CheckoutWithCardResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CheckoutWithCardResponse>>(
        "/orders/checkout-with-card",
        data,
        { timeout: 120000 } // 2 minutes
      );
      return response.data.data;
    } catch (error) {
      console.error("Error during checkout with card:", error);
      throw error;
    }
  },
};
