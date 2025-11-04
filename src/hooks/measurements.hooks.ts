import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  measurementsService,
  type CreateMeasurementsRequest,
  type UpdateMeasurementsRequest,
} from "../services/measurements.service";
import { adminSettingsService } from "../services/admin-settings.service";
// import { useAuthStore } from "../stores/auth-store";

/* ----------------------------------------------------------------------------- */

// Query keys
export const measurementsKeys = {
  all: ["measurements"] as const,
  me: () => [...measurementsKeys.all, "me"] as const,
  summary: () => [...measurementsKeys.all, "summary"] as const,
  sizeChart: () => ["size-chart"] as const,
} as const;

// Get user measurements
export const useMeasurements = () => {
  // const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: measurementsKeys.me(),
    queryFn: () => measurementsService.getMeasurements(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // enabled: isAuthenticated,
  });
};

// Get user measurements summary
export const useMeasurementsSummary = () => {
  return useQuery({
    queryKey: measurementsKeys.summary(),
    queryFn: () => measurementsService.getMeasurementsSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get size chart for available sizes
export const useSizeChart = () => {
  return useQuery({
    queryKey: measurementsKeys.sizeChart(),
    queryFn: () => adminSettingsService.getSizeChart(),
    staleTime: 30 * 60 * 1000, // 30 minutes - size chart changes rarely
  });
};

// Create measurements
export const useCreateMeasurements = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMeasurementsRequest) =>
      measurementsService.createMeasurements(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: measurementsKeys.all });
      toast.success(data.message || "Measurements saved successfully");
    },
    onError: (error) => {
      console.log("Unable to save", error);
      toast.error("Failed to save measurements");
    },
  });
};

// Update measurements
export const useUpdateMeasurements = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeasurementsRequest) =>
      measurementsService.updateMeasurements(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: measurementsKeys.all });
      toast.success(data.message || "Measurements updated successfully");
    },
    onError: (error) => {
      console.log("Failed to update", error);

      toast.error("Failed to update measurements");
    },
  });
};
