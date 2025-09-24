import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ordersService,
  type InstantCheckoutRequest,
  type CheckoutWithCardRequest,
} from "../services/orders.service";
import toast from "react-hot-toast";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
/* --------------------------------------------------------------------- */

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
      showToast.success("Redirecting to payment...", {
        style: notificationStyles.alertSuccess,
      });

      // Redirect to payment URL
      window.location.href = data.paymentUrl;
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      showToast.error(`Checkout failed: ${error.message}`, {
        style: notificationStyles.alertError,
      });
    },
  });
};

export const useInstantCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InstantCheckoutRequest) =>
      ordersService.instantCheckout(data),
    onSuccess: (data) => {
      console.log(data);

      showToast.info("Redirecting to payment", {});

      // Redirect to payment URL
      setTimeout(() => (window.location.href = data.paymentUrl), 2000);

      // Invalidate orders
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      showToast.error(`Checkout failed. Please try again later.`, {
        position: "top-center",
        style: notificationStyles.alertError,
      });
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
    onError: (error) => {
      showToast.error(`Payment verification failed: ${error.message}`, {
        style: notificationStyles.alertError,
      });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersService.cancelOrder(orderId),
    onSuccess: (data) => {
      showToast.success(data.message || "Order cancelled successfully", {
        style: notificationStyles.alertSuccess,
      });
      // Invalidate orders to refresh data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      queryClient.invalidateQueries({ queryKey: ["recentOngoingOrders"] });
    },
    onError: (error) => {
      showToast.error(`Failed to cancel order: ${error.message}`, {
        style: notificationStyles.alertError,
      });
    },
  });
};

export const useCheckoutWithCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckoutWithCardRequest) =>
      ordersService.checkoutWithCard(data),
    onSuccess: (data) => {
      toast.success("Redirecting to payment...");
      // Redirect to payment URL
      window.location.href = data.payment.authorizationUrl;
      // Invalidate cart and orders
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      showToast.error(`Checkout failed: ${error.message}`, {
        style: notificationStyles.alertError,
      });
    },
  });
};
