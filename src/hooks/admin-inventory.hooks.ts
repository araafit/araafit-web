import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminInventoryService,
  type CreateProductRequest,
  type UpdateProductRequest,
} from "../services/admin-inventory.service";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

/* ---------------------------------------------------------- */

// Query keys for admin inventory
export const adminInventoryKeys = {
  all: ["admin-inventory"] as const,
  metrics: () => [...adminInventoryKeys.all, "metrics"] as const,
  products: () => [...adminInventoryKeys.all, "products"] as const,
  product: (id: string) => [...adminInventoryKeys.all, "product", id] as const,
};

// Get Product Metrics Query
export const useProductMetrics = () => {
  return useQuery({
    queryKey: adminInventoryKeys.metrics(),
    queryFn: () => adminInventoryService.getProductMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
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

// Get Products Query
export const useProducts = () => {
  return useQuery({
    queryFn: () => adminInventoryService.getProducts(),
    queryKey: adminInventoryKeys.products(),
    staleTime: 0,
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

// Get Product by ID Query
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: adminInventoryKeys.product(productId),
    queryFn: () => adminInventoryService.getProduct(productId),
    enabled: !!productId,
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

// Create Product Mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) =>
      adminInventoryService.createProduct(data),
    onSuccess: (response) => {
      // Invalidate and refetch products and metrics
      queryClient.invalidateQueries({
        queryKey: adminInventoryKeys.products(),
      });
      queryClient.invalidateQueries({ queryKey: adminInventoryKeys.metrics() });

      showToast.success(response.message || "Product created successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to create product",
        { icon: null, style: notificationStyles.alertError }
      );
    },
  });
};

// Update Product Mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => adminInventoryService.updateProduct(productId, data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch products and metrics
      queryClient.invalidateQueries({
        queryKey: adminInventoryKeys.products(),
      });
      queryClient.invalidateQueries({ queryKey: adminInventoryKeys.metrics() });
      queryClient.invalidateQueries({
        queryKey: adminInventoryKeys.product(variables.productId),
      });
      showToast.success(response.message || "Product updated successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to update product",
        { icon: null, style: notificationStyles.alertError }
      );
    },
  });
};

// Delete Product Mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      adminInventoryService.deleteProduct(productId),
    onSuccess: (response) => {
      // Invalidate and refetch products and metrics
      queryClient.invalidateQueries({ queryKey: adminInventoryKeys.metrics() });
      queryClient.invalidateQueries({
        queryKey: adminInventoryKeys.products(),
      });

      showToast.success(response.message || "Product deleted successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to delete product",
        { icon: null, style: notificationStyles.alertError }
      );
    },
  });
};
