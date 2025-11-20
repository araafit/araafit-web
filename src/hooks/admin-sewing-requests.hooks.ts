/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  adminSewingRequestsService,
  type GetSewingRequestsParams,
  type AddRequestRiderRequest,
  type UpdateRequestRiderRequest,
  type UpdateSewingRequestRequest,
  type UpdateRequestStatusRequest,
} from "../services/admin-sewing-requests.service";
import { useState } from "react";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

/* -------------------------------------------------------------------------------------------------- */

interface BulkUpdateResult {
  successful: number;
  failed: number;
  errors: Array<{ orderId: string; error: string }>;
}

// Query keys for admin sewing requests
export const adminSewingRequestsKeys = {
  all: ['admin-sewing-requests'] as const,
  lists: () => [...adminSewingRequestsKeys.all, 'list'] as const,
  list: (params: GetSewingRequestsParams) => [...adminSewingRequestsKeys.lists(), params] as const,
  details: () => [...adminSewingRequestsKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminSewingRequestsKeys.details(), id] as const,
};

// Get Sewing Requests Query
export const useAdminSewingRequests = (params: GetSewingRequestsParams = {}) => {
  return useQuery({
    queryKey: adminSewingRequestsKeys.list(params),
    queryFn: () => adminSewingRequestsService.getSewingRequests(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401/403 errors
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) {
        return false;
      }
      // Retry once for other errors
      return failureCount < 1;
    },
  });
};

// Add Request Rider Mutation
export const useAddRequestRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: AddRequestRiderRequest }) =>
      adminSewingRequestsService.addRequestRider(requestId, data),
    onSuccess: (/*data, variables*/) => {
      // Invalidate and refetch sewing requests
      queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() });
      toast.success("Rider added successfully");
    },
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add rider");
    },
  });
};

// Update Request Rider Mutation
export const useUpdateRequestRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: UpdateRequestRiderRequest }) =>
      adminSewingRequestsService.updateRequestRider(requestId, data),
    onSuccess: (/*data, variables*/) => {
      // Invalidate and refetch sewing requests
      queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() });
      toast.success("Rider information updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update rider information");
    },
  });
};

export const useUpdateBulkRequestStatus = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const bulkUpdate = async (
    orders: Array<{ id: string; status: string }>
  ): Promise<BulkUpdateResult> => {
    setIsUpdating(true);

    try {
      const results = await Promise.allSettled(
        orders.map((order) =>
          adminSewingRequestsService.updateRequestStatus(order.id, {
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
          queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.all }),
          queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() }),
          queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] }),

          // Invalidate specific orders that succeeded
          ...orders.slice(0, successful).map((order) =>
            queryClient.invalidateQueries({
              queryKey: adminSewingRequestsKeys.detail(order.id),
            })
          ),
        ]);
      }

      if (failed === 0) {
        showToast.success(`All ${successful} orders updated successfully`, {
          style: notificationStyles.alertSuccess,
        });
      } else if (successful === 0) {
        showToast.error(`All ${failed} orders failed to update`, {
          style: notificationStyles.alertError,
        });
      } else {
        showToast.warning(`${successful} status updated, ${failed} failed`, {
          style: notificationStyles.alertWarning,
          icon: null
        });
        console.log(realErrors);
      }

      return { successful, failed, errors: realErrors };
    } finally {
      setIsUpdating(false);
    }
  };

  return { bulkUpdate, isUpdating };
};

// Update Sewing Request Mutation
export const useUpdateSewingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: UpdateSewingRequestRequest }) =>
      adminSewingRequestsService.updateSewingRequest(requestId, data),
    onSuccess: (/*data, variables*/) => {
      // Invalidate and refetch sewing requests
      queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() });
      // Also invalidate dashboard metrics since request status affects counts
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success("Sewing request updated successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update sewing request");
    },
  });
};

// Delete Sewing Request Mutation
export const useDeleteSewingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      adminSewingRequestsService.deleteSewingRequest(requestId),
    onSuccess: (/*data, variables*/) => {
      // Invalidate and refetch sewing requests
      queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() });
      // Also invalidate dashboard metrics since request deletion affects counts
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success("Sewing request deleted successfully");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete sewing request");
    },
  });
};

// Update Request Status Mutation
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, data }: { requestId: string; data: UpdateRequestStatusRequest }) =>
      adminSewingRequestsService.updateRequestStatus(requestId, data),
    onSuccess: (data, variables) => {
      console.log(data, variables);
      // Invalidate and refetch sewing requests
      queryClient.invalidateQueries({ queryKey: adminSewingRequestsKeys.lists() });
      // Also invalidate dashboard metrics since request status affects counts
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success(`Request status updated to ${variables.data.status}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update request status");
    },
  });
};
