import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  adminOrdersService,
  type GetOrdersParams,
  type AddRiderRequest,
  type UpdateRiderRequest,
  type UpdateOrderStatusRequest,
} from "../services/admin-orders.service";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
import { useState } from "react";

/* --------------------------------------------------------------------------------- */

interface BulkUpdateResult {
  successful: number;
  failed: number;
  errors: Array<{ orderId: string; error: string }>;
}

// Query keys for admin orders
export const adminOrdersKeys = {
  all: ["admin-orders"] as const,
  lists: () => [...adminOrdersKeys.all, "list"] as const,
  list: (params: GetOrdersParams) =>
    [...adminOrdersKeys.lists(), params] as const,
  details: () => [...adminOrdersKeys.all, "detail"] as const,
  detail: (id: string) => [...adminOrdersKeys.details(), id] as const,
};

// Get Order query
export const useAdminOrder = (orderId: string | number) => {
  return useQuery({
    queryKey: adminOrdersKeys.detail(orderId.toString()),
    queryFn: () => adminOrdersService.getOrder(orderId),
    enabled: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401/403 errors
      const axiosError = error as { response?: { status?: number } };

      if (
        axiosError?.response?.status === 401 ||
        axiosError?.response?.status === 403
      ) {
        return false;
      }

      // Retry once for other errors
      return failureCount < 1;
    },
  });
};

// Get Orders Query
export const useAdminOrders = (params: GetOrdersParams = {}) => {
  return useQuery({
    queryKey: adminOrdersKeys.list(params),
    queryFn: () => adminOrdersService.getOrders(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401/403 errors
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError?.response?.status === 401 ||
        axiosError?.response?.status === 403
      ) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
  });
};

// Add Rider Mutation
export const useAddRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: AddRiderRequest;
    }) => adminOrdersService.addRider(orderId, data),
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.lists() });
      toast.success("Rider added successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(axiosError.response?.data?.message || "Failed to add rider");
    },
  });
};

// Update Rider Mutation
export const useUpdateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateRiderRequest;
    }) => adminOrdersService.updateRider(orderId, data),
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.lists() });
      toast.success("Rider information updated successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message ||
          "Failed to update rider information"
      );
    },
  });
};

// Update Order Status Mutation
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrderStatusRequest;
    }) => adminOrdersService.updateOrderStatus(orderId, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.all });
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.lists() });
      // Invalidate specific order detail and any detail lists
      if (variables?.orderId) {
        queryClient.invalidateQueries({
          queryKey: adminOrdersKeys.detail(variables.orderId),
        });
      }
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.details() });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(`Order status updated to ${variables.data.status}`);
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || "Failed to update order status"
      );
    },
  });
};

export const useUpdateBulkOrderStatus = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const bulkUpdate = async (
    orders: Array<{ id: string; status: string }>
  ): Promise<BulkUpdateResult> => {
    setIsUpdating(true);

    try {
      const results = await Promise.allSettled(
        orders.map((order) =>
          adminOrdersService.updateOrderStatus(order.id, {
            status: order.status,
          })
        )
      );

      // Collect errors with context
      const errors = results.map((result, resultIdx) => {
        if (result.status === "rejected") {
          return {
            orderId: orders[resultIdx].id,
            error: result.reason?.response?.data?.message || "Unknown error",
          };
        }
        return null;
      });

      const realErrors = errors.filter(Boolean) as Array<{
        orderId: string;
        error: string;
      }>;

      const successful = results.map(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = realErrors.length;

      // Batch Invalidate only once
      if (successful > 0) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: adminOrdersKeys.all }),
          queryClient.invalidateQueries({ queryKey: adminOrdersKeys.lists() }),
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),

          // Invalidate specific orders that succeeded
          ...orders.slice(0, successful).map((order) =>
            queryClient.invalidateQueries({
              queryKey: adminOrdersKeys.detail(order.id),
            })
          ),
        ]);
      }

      if (failed === 0) {
        showToast.success(`All ${successful} orders updated successfully`, {
          style: notificationStyles.alertSuccess,
        });
      }
      
      if (successful === 0) {
        showToast.error(`All ${failed} orders failed to update`, {
          style: notificationStyles.alertError,
        });
      }

      return { successful, failed, errors: realErrors };
    } finally {
      setIsUpdating(false);
    }
  };

  return { bulkUpdate, isUpdating };
};

export const useApproveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => adminOrdersService.approveOrder(orderId),
    onSuccess: () => {
      showToast.success("Order approved successfully", {
        style: notificationStyles.alertSuccess,
      });
      // Invalidate orders to refresh data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => adminOrdersService.approveOrder(orderId),
    onSuccess: () => {
      showToast.success("Order rejected successfully", {
        style: notificationStyles.alertSuccess,
      });
      // Invalidate orders to refresh data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
