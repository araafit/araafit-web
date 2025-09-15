import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, type InstantCheckoutRequest, type CheckoutWithCardRequest } from "../services/orders.service";
import toast from "react-hot-toast";

// Query hooks for fetching data
export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () => ordersService.getAllOrders(page, limit),
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useRecentOngoingOrders = () => {
  return useQuery({
    queryKey: ["recentOngoingOrders"],
    queryFn: () => ordersService.getRecentOngoingOrders(),
  });
};

// Mutation hooks for actions
export const useCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => ordersService.checkout(),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
      window.location.href = data.paymentUrl;
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
};

export const useInstantCheckout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: InstantCheckoutRequest) => ordersService.instantCheckout(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
      window.location.href = data.paymentUrl;
      // Invalidate orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reference: string) => ordersService.verifyPayment(reference),
    onSuccess: (data) => {
      toast.success(data.message || "Payment verified successfully!");
      // Invalidate orders to refresh data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["recentOngoingOrders"] });
    },
    onError: (error: any) => {
      toast.error(`Payment verification failed: ${error.message}`);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => ordersService.cancelOrder(orderId),
    onSuccess: (data) => {
      toast.success(data.message || "Order cancelled successfully");
      // Invalidate orders to refresh data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      queryClient.invalidateQueries({ queryKey: ["recentOngoingOrders"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to cancel order: ${error.message}`);
    },
  });
};

export const useCheckoutWithCard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CheckoutWithCardRequest) => ordersService.checkoutWithCard(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
      window.location.href = data.payment.authorizationUrl;
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: any) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });
};
