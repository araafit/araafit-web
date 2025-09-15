import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart.service";
import type {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateQuantityRequest,
  CreateCartItemRequest,
  UpdateCartItemRequest,
} from "../services/cart.service";
import { toast } from "react-hot-toast";

// Hook for fetching cart
export const useCart = () => {
  return useQuery<Cart, Error>({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching cart items
export const useCartItems = () => {
  return useQuery<CartItem[], Error>({
    queryKey: ["cart-items"],
    queryFn: () => cartService.getCartItems(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching single cart item
export const useCartItem = (itemId: string) => {
  return useQuery<CartItem, Error>({
    queryKey: ["cart-items", itemId],
    queryFn: () => cartService.getCartItem(itemId),
    enabled: !!itemId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for adding item to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddToCartRequest) => cartService.addToCart(request),
    onSuccess: (/*data*/) => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Item added to cart successfully!");
    },
    onError: (error: any) => {
      console.error("Error adding to cart:", error);
      toast.error(error?.response?.data?.message || "Failed to add item to cart");
    },
  });
};

// Hook for updating item quantity
export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, request }: { itemId: string; request: UpdateQuantityRequest }) =>
      cartService.updateQuantity(itemId, request),
    onSuccess: (/*data*/) => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Quantity updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating quantity:", error);
      toast.error(error?.response?.data?.message || "Failed to update quantity");
    },
  });
};

// Hook for removing item from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (/*data*/) => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Item removed from cart!");
    },
    onError: (error: any) => {
      console.error("Error removing from cart:", error);
      toast.error(error?.response?.data?.message || "Failed to remove item from cart");
    },
  });
};

// Hook for clearing cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Cart cleared successfully!");
    },
    onError: (error: any) => {
      console.error("Error clearing cart:", error);
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    },
  });
};

// Hook for creating cart item
export const useCreateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCartItemRequest) => cartService.createCartItem(request),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Item added to cart!");
    },
    onError: (error: any) => {
      console.error("Error creating cart item:", error);
      toast.error(error?.response?.data?.message || "Failed to add item to cart");
    },
  });
};

// Hook for updating cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, request }: { itemId: string; request: UpdateCartItemRequest }) =>
      cartService.updateCartItem(itemId, request),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Cart item updated!");
    },
    onError: (error: any) => {
      console.error("Error updating cart item:", error);
      toast.error(error?.response?.data?.message || "Failed to update cart item");
    },
  });
};

// Hook for deleting cart item
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartService.deleteCartItem(itemId),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      
      toast.success("Item removed from cart!");
    },
    onError: (error: any) => {
      console.error("Error deleting cart item:", error);
      toast.error(error?.response?.data?.message || "Failed to remove item from cart");
    },
  });
};
