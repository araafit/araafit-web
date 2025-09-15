import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import adminDiscountsService, { type CreateDiscountRequest, type UpdateDiscountRequest } from "../services/admin-discounts.service";

export const discountsKeys = {
  all: ['admin-discounts'] as const,
  lists: () => [...discountsKeys.all, 'list'] as const,
  detail: (id: string) => [...discountsKeys.all, 'detail', id] as const,
};

export const useDiscounts = () => {
  return useQuery({
    queryKey: discountsKeys.lists(),
    queryFn: () => adminDiscountsService.getDiscounts(),
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status === 401 || axiosError?.response?.status === 403) return false;
      return failureCount < 1;
    },
  });
};

export const useDiscount = (id: string) => {
  return useQuery({
    queryKey: discountsKeys.detail(id),
    queryFn: () => adminDiscountsService.getDiscount(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDiscountRequest) => adminDiscountsService.createDiscount(payload),
    onSuccess: () => {
      toast.success('Discount created');
      qc.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to create discount');
    },
  });
};

export const useUpdateDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDiscountRequest }) => adminDiscountsService.updateDiscount(id, payload),
    onSuccess: (_data, vars) => {
      toast.success('Discount updated');
      qc.invalidateQueries({ queryKey: discountsKeys.lists() });
      qc.invalidateQueries({ queryKey: discountsKeys.detail(vars.id) });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to update discount');
    },
  });
};

export const useDeleteDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDiscountsService.deleteDiscount(id),
    onSuccess: (res) => {
      toast.success(res.message || 'Discount deleted');
      qc.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to delete discount');
    },
  });
};

export const useToggleDiscount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDiscountsService.toggleDiscount(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: discountsKeys.lists() });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || 'Failed to toggle discount');
    },
  });
};


