import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminSettingsService } from "../services/admin-settings.service";
import type {
  UpdateAdminProfileRequest,
  UpdateAdminPasswordRequest,
  CreateSizeChartRequest,
  UpdateSizeChartRequest,
  CreateStyleRequest,
  UpdateStyleRequest,
  StyleCostResponse,
} from "../services/admin-settings.service";
import { toast } from "react-hot-toast";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

/* ------------------------------------------------------------------------- */

// Query keys
export const adminSettingsKeys = {
  all: ["admin-settings"] as const,
  sizeChart: (gender?: string) =>
    [...adminSettingsKeys.all, "size-chart", gender ?? "all"] as const,
  chartsByGender: (gender: "male" | "female") =>
    [...adminSettingsKeys.all, "charts-by-gender", gender] as const,
  chartById: (id: string) =>
    [...adminSettingsKeys.all, "chart-by-id", id] as const,
  skinTones: () => [...adminSettingsKeys.all, "skin-tones"] as const,
  dressStyles: () => [...adminSettingsKeys.all, "dress-styles"] as const,
  dressStyle: (id: string) => [...adminSettingsKeys.dressStyles(), id] as const,
  styleCost: (styleId: string, fabricId: string, measurementSetId?: string) =>
    [...adminSettingsKeys.all, "style-cost", styleId, fabricId, measurementSetId ?? "default"] as const,
};

// Admin Profile Hooks
export const useAdminProfile = () => {
  return useQuery({
    queryKey: [...adminSettingsKeys.all, "profile"],
    queryFn: () => adminSettingsService.getProfile(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
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
      queryClient.invalidateQueries({
        queryKey: [...adminSettingsKeys.all, "profile"],
      });
      showToast.success("Profile updated successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to update profile",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useUpdateAdminPassword = () => {
  return useMutation({
    mutationFn: (request: UpdateAdminPasswordRequest) =>
      adminSettingsService.updatePassword(request),
    onSuccess: () => {
      showToast.success("Password updated successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to update password",
        { icon: null, style: { ...notificationStyles.alertError } }
      );
    },
  });
};

// Size Chart Hooks
export const useSizeChart = (gender?: string) => {
  return useQuery({
    queryKey: adminSettingsKeys.sizeChart(gender),
    queryFn: () => adminSettingsService.getSizeChart(gender),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
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
    onSuccess: (data: { gender: "male" | "female" }) => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.sizeChart(data?.gender),
      });
      toast.success("Size chart item created successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message ||
          "Failed to create size chart item",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useUpdateSizeChart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateSizeChartRequest;
    }) => adminSettingsService.updateSizeChart(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.sizeChart(),
      });
      showToast.success("Size chart item updated successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message ||
          "Failed to update size chart item",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

// Size Chart V2 Hooks
export const useChartsByGender = (gender: "male" | "female") => {
  return useQuery({
    queryKey: adminSettingsKeys.chartsByGender(gender),
    queryFn: () => adminSettingsService.getChartsByGender(gender),
  });
};

export const useChartById = (id: string) => {
  return useQuery({
    queryKey: adminSettingsKeys.chartById(id),
    queryFn: () => adminSettingsService.getChartById(id),
    enabled: !!id,
  });
};

export const useCreateChart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { gender: "male" | "female"; name: string }) =>
      adminSettingsService.createChart(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.chartsByGender(data.gender),
      });
      showToast.success("Size chart created", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to create size chart",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useCreateChartEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      chartId: string;
      payload: {
        label: string;
        chestMin?: number;
        chestMax?: number;
        waistMin?: number;
        waistMax?: number;
        hipsMin?: number;
        hipsMax?: number;
        neckMin?: number;
        neckMax?: number;
        shoulderMin?: number;
        shoulderMax?: number;
        heightMin?: number;
        heightMax?: number;
      };
    }) => adminSettingsService.createChartEntry(params.chartId, params.payload),
    onSuccess: (_d, variables) => {
      // Refresh both lists and detail
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.chartById(variables.chartId),
      });
      showToast.success("Entry added", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to add entry",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useUpdateChartEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      entryId: string;
      chartId: string;
      payload: Partial<{
        label: string;
        chestMin: number;
        chestMax: number;
        waistMin: number;
        waistMax: number;
        hipsMin: number;
        hipsMax: number;
        neckMin: number;
        neckMax: number;
        shoulderMin: number;
        shoulderMax: number;
        heightMin: number;
        heightMax: number;
      }>;
    }) => adminSettingsService.updateChartEntry(params.entryId, params.payload),
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.chartById(variables.chartId),
      });
      showToast.success("Entry updated", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to update entry",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useDeleteChartEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { entryId: string; chartId: string }) =>
      adminSettingsService.deleteChartEntry(params.entryId),
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.chartById(variables.chartId),
      });
      showToast.success("Entry deleted", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to delete entry",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useSkinTonesList = () => {
  return useQuery({
    queryKey: adminSettingsKeys.skinTones(),
    queryFn: () => adminSettingsService.getSkinTones(),
    staleTime: 30 * 60 * 1000,
  });
};
// Dress Styles Hooks
export const useDressStyles = () => {
  return useQuery({
    queryKey: adminSettingsKeys.dressStyles(),
    queryFn: () => adminSettingsService.getDressStyles(),
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
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
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useStyleCost = (
  styleId: number | string | undefined,
  fabricProductId: string | undefined,
  measurementSetId?: string | undefined
) => {
  return useQuery<StyleCostResponse>({
    queryKey: adminSettingsKeys.styleCost(
      String(styleId ?? ""),
      fabricProductId ?? "",
      measurementSetId
    ),
    queryFn: () =>
      adminSettingsService.getStyleCost(
        styleId!,
        fabricProductId!,
        measurementSetId
      ),
    enabled: !!styleId && !!fabricProductId,
    retry: (failureCount, error) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403 ||
        axiosError.response?.status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateStyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateStyleRequest) =>
      adminSettingsService.createStyle(request),
    onSuccess: () => {
      // Refresh styles list so new style appears
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.dressStyles(),
      });
      showToast.success("Style created successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to create style",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useDeleteDressStyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSettingsService.deleteDressStyle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.dressStyles(),
      });
      showToast.success("Dress style deleted successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to delete dress style",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};

export const useUpdateStyle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number | string; data: UpdateStyleRequest }) =>
      adminSettingsService.updateStyle(params.id, params.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.dressStyles(),
      });
      queryClient.invalidateQueries({
        queryKey: adminSettingsKeys.dressStyle(String(variables.id)),
      });
      showToast.success("Style updated successfully", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Failed to update style",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
        }
      );
    },
  });
};
