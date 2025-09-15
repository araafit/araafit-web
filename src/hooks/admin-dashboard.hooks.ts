import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../services/admin-dashboard.service";

// Query keys for admin dashboard
export const adminDashboardKeys = {
  all: ['admin-dashboard'] as const,
  metrics: () => [...adminDashboardKeys.all, 'metrics'] as const,
  recentActivities: () => [...adminDashboardKeys.all, 'recent-activities'] as const,
};

// Admin Dashboard Metrics Query
export const useAdminDashboardMetrics = () => {
  return useQuery({
    queryKey: adminDashboardKeys.metrics(),
    queryFn: adminDashboardService.getMetrics,
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

// Recent Activities Query
export const useAdminRecentActivities = () => {
  return useQuery({
    queryKey: adminDashboardKeys.recentActivities(),
    queryFn: adminDashboardService.getRecentActivities,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 1 * 60 * 1000, // Refetch every minute for real-time data
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
