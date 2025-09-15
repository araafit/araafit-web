import apiClient from "../lib/axios";
import type { ProductImage } from "./products.service";

// Types for Cart
export interface CartProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: ProductImage[];
}

export interface CartItem {
  id: string;
  product: CartProduct;
  quantity: number;
  size: string;
  subtotal?: number;
  tax?: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  size: string;
}

export interface AddToCartResponse {
  id: string;
  items: CartItem[];
  total: number;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface UpdateQuantityResponse {
  message: string;
  item: CartItem;
}

export interface CreateCartItemRequest {
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  size?: string;
}

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

// Cart Service functions
export const cartService = {
  // Add item to cart
  async addToCart(request: AddToCartRequest): Promise<AddToCartResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AddToCartResponse>>(
        "/cart/add",
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  // Get cart
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<ApiResponse<Cart>>("/cart");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // Update item quantity in cart
  async updateQuantity(
    itemId: string,
    request: UpdateQuantityRequest
  ): Promise<UpdateQuantityResponse> {
    try {
      const response = await apiClient.patch<
        ApiResponse<UpdateQuantityResponse>
      >(`/cart/update-quantity/${itemId}`, request);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating quantity for item ${itemId}:`, error);
      throw error;
    }
  },

  // Remove item from cart
  async removeItem(itemId: string): Promise<Cart> {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>(
        `/cart/remove/${itemId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error removing item ${itemId} from cart:`, error);
      throw error;
    }
  },

  // Clear cart
  async clearCart(): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        "/cart/clear"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },

  // Create cart item
  async createCartItem(request: CreateCartItemRequest): Promise<CartItem> {
    try {
      const response = await apiClient.post<ApiResponse<CartItem>>(
        "/cart-items",
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating cart item:", error);
      throw error;
    }
  },

  // Get all cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<CartItem[]>>(
        "/cart-items"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching cart items:", error);
      throw error;
    }
  },

  // Get cart item by ID
  async getCartItem(itemId: string): Promise<CartItem> {
    try {
      const response = await apiClient.get<ApiResponse<CartItem>>(
        `/cart-items/${itemId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching cart item ${itemId}:`, error);
      throw error;
    }
  },

  // Update cart item
  async updateCartItem(
    itemId: string,
    request: UpdateCartItemRequest
  ): Promise<CartItem> {
    try {
      const response = await apiClient.patch<ApiResponse<CartItem>>(
        `/cart-items/${itemId}`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating cart item ${itemId}:`, error);
      throw error;
    }
  },

  // Delete cart item
  async deleteCartItem(itemId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<ApiResponse<{ message: string }>>(
        `/cart-items/${itemId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error deleting cart item ${itemId}:`, error);
      throw error;
    }
  },
};
