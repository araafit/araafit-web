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
import { notificationStyles } from "../style/custom";

/* ------------------------------------------- */

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

      toast.success("Item added to cart successfully!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Unable to add cart:", error);
      toast.error(
        "Failed to add item to cart",
        { icon: null }
      );
    },
  });
};

// Hook for updating item quantity
export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      request,
    }: {
      itemId: string;
      request: UpdateQuantityRequest;
    }) => cartService.updateQuantity(itemId, request),
    onSuccess: (/*data*/) => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });

      toast.success("Quantity updated successfully!");
    },
    onError: (error) => {
      console.error("Unable to update quantity:", error);
      toast.error("Failed to update quantity");
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
    onError: (error) => {
      console.error("Can't remove cart:", error);
      toast.error("Failed to remove item from cart"
      );
    },
  });
};

// Hook for removing many items from cart
export const useRemoveManyFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: string[]) => cartService.removeMany({ itemIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast.success("Selected items removed from cart!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Failed to remove selected items:", error);
      toast.error("Failed to remove selected items", { icon: null });
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

      toast.success("Cart cleared successfully!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    },
  });
};

// Hook for creating cart item
export const useCreateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCartItemRequest) =>
      cartService.createCartItem(request),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });

      toast.success("Item added to cart!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Error creating cart item:", error);
      toast.error("Failed to add item to cart"
      );
    },
  });
};

// Hook for updating cart item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      request,
    }: {
      itemId: string;
      request: UpdateCartItemRequest;
    }) => cartService.updateCartItem(itemId, request),
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });

      toast.success("Cart item updated!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Error updating cart item:", error);
      toast.error("Failed to update cart item"
      );
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

      toast.success("Item removed from cart!", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error) => {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item from cart"
      );
    },
  });
};
