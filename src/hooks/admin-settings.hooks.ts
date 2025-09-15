import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSettingsService } from "../services/admin-settings.service";
import type {
  UpdateAdminProfileRequest,
  UpdateAdminPasswordRequest,
  CreateSizeChartRequest,
  UpdateSizeChartRequest,
  CreateDressStyleRequest,
} from "../services/admin-settings.service";
import { toast } from "react-hot-toast";

// Query keys
export const adminSettingsKeys = {
  all: ["admin-settings"] as const,
  sizeChart: () => [...adminSettingsKeys.all, "size-chart"] as const,
  dressStyles: () => [...adminSettingsKeys.all, "dress-styles"] as const,
  dressStyle: (id: string) => [...adminSettingsKeys.dressStyles(), id] as const,
};

// Admin Profile Hooks
export const useAdminProfile = () => {
  return useQuery({
    queryKey: [...adminSettingsKeys.all, "profile"],
    queryFn: () => adminSettingsService.getProfile(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateAdminProfileRequest) =>
      adminSettingsService.updateProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminSettingsKeys.all, "profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to update profile");
    },
  });
};

export const useUpdateAdminPassword = () => {
  return useMutation({
    mutationFn: (request: UpdateAdminPasswordRequest) =>
      adminSettingsService.updatePassword(request),
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to update password");
    },
  });
};

// Size Chart Hooks
export const useSizeChart = () => {
  return useQuery({
    queryKey: adminSettingsKeys.sizeChart(),
    queryFn: () => adminSettingsService.getSizeChart(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useCreateSizeChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSizeChartRequest) =>
      adminSettingsService.createSizeChart(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.sizeChart() });
      toast.success("Size chart item created successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to create size chart item");
    },
  });
};

export const useUpdateSizeChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateSizeChartRequest }) =>
      adminSettingsService.updateSizeChart(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.sizeChart() });
      toast.success("Size chart item updated successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to update size chart item");
    },
  });
};

// Dress Styles Hooks
export const useDressStyles = () => {
  return useQuery({
    queryKey: adminSettingsKeys.dressStyles(),
    queryFn: () => adminSettingsService.getDressStyles(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useDressStyle = (id: string) => {
  return useQuery({
    queryKey: adminSettingsKeys.dressStyle(id),
    queryFn: () => adminSettingsService.getDressStyle(id),
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

export const useCreateDressStyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateDressStyleRequest) =>
      adminSettingsService.createDressStyle(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.dressStyles() });
      toast.success("Dress style created successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to create dress style");
    },
  });
};

export const useDeleteDressStyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSettingsService.deleteDressStyle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.dressStyles() });
      toast.success("Dress style deleted successfully");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to delete dress style");
    },
  });
};
