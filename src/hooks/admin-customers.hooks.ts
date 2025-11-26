import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCustomersService } from "../services/admin-customers.service";
import type {
  GetCustomersParams,
  BlockCustomerRequest,
  DeleteCustomerRequest,
} from "../services/admin-customers.service";
import { toast } from "react-hot-toast";

// Query keys
export const adminCustomersKeys = {
  all: ["admin-customers"] as const,
  lists: () => [...adminCustomersKeys.all, "list"] as const,
  list: (params?: GetCustomersParams) => [...adminCustomersKeys.lists(), params] as const,
  details: () => [...adminCustomersKeys.all, "detail"] as const,
  detail: (id: string) => [...adminCustomersKeys.details(), id] as const,
  metrics: () => [...adminCustomersKeys.all, "metrics"] as const,
  detailMetrics: (id: string) => [...adminCustomersKeys.all, "detail-metrics", id] as const,
};

// Hooks
export const useCustomerMetrics = () => {
  return useQuery({
    queryKey: adminCustomersKeys.metrics(),
    queryFn: () => adminCustomersService.getCustomerMetrics(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCustomers = (params?: GetCustomersParams) => {
  return useQuery({
    queryKey: adminCustomersKeys.list(params),
    queryFn: () => adminCustomersService.getCustomers(params),
    enabled: params ? true : false,
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: adminCustomersKeys.detail(id),
    queryFn: () => adminCustomersService.getCustomer(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCustomerDetailMetrics = (id: string) => {
  return useQuery({
    queryKey: adminCustomersKeys.detailMetrics(id),
    queryFn: () => adminCustomersService.getCustomerDetailMetrics(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useBlockCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: BlockCustomerRequest }) =>
      adminCustomersService.blockCustomer(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.details() });
      toast.success("Customer blocked successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to block customer");
    },
  });
};

export const useUnblockCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminCustomersService.unblockCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.details() });
      toast.success("Customer unblocked successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to unblock customer");
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: DeleteCustomerRequest }) =>
      adminCustomersService.deleteCustomer(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.all });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.details() });
      toast.success("Customer deleted successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to delete customer");
    },
  });
};
