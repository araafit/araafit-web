import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { adminNotificationService } from "../services/admin-notification.service";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

/* ------------------------------------------------------------------------------------------ */

export const adminNotificationsKeys = {
  all: ["adminNotifications"] as const,
  lists: (params?: Record<string, unknown>) =>
    params
      ? ([...adminNotificationsKeys.all, "list", params] as const)
      : ([...adminNotificationsKeys.all, "list"] as const),
  detail: (id: string) => [...adminNotificationsKeys.all, "detail", id] as const,
  update: (id: string) => [...adminNotificationsKeys.all, "update", id] as const,
  remove: (id?: string) =>
    id
      ? ([...adminNotificationsKeys.all, "remove", id] as const)
      : ([...adminNotificationsKeys.all, "remove"] as const),
};

// Get notifications
export const useAdminNotifications = () => {
  return useQuery({
    queryKey: adminNotificationsKeys.all,
    queryFn: () => adminNotificationService.getAllNotification(),
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

// Update notification (Mark as read)
export const useMarkAdminNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminNotificationService.readNotification(id),
      mutationKey: adminNotificationsKeys.update("update54321"),
    onSuccess: (notificationData) => {
      if (notificationData.isRead) {
        showToast.success(notificationData.message || `Notification marked as read!`, {
          icon: null,
          style: notificationStyles.alertSuccess,
        });
      }
      // Invalidate all user notifications
      queryClient.invalidateQueries({
        queryKey: adminNotificationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: adminNotificationsKeys.all,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.log(axiosError);
    },
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

// Update notification (Mark as read)
export const useAdminDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminNotificationService.deleteNotification(id),
    mutationKey: adminNotificationsKeys.remove("delete54321"),
    onSuccess: (notificationData) => {
      if (notificationData.success) {
        showToast.success(
          notificationData.message || "Notification deleted successfully",
          {
            icon: null,
            style: notificationStyles.alertSuccess,
          }
        );
      }

      // Invalidate all user notifications
      queryClient.invalidateQueries({
        queryKey: adminNotificationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: adminNotificationsKeys.all,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      console.log(axiosError);
    },
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