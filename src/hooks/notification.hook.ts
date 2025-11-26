import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { userNotificationService } from "../services/notification.service";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
// import { NotificationResponse } from "../services/notification.service";

/* --------------------------------------------------------------------------------------- */

export const userNotificationsKeys = {
  all: ["userNotifications"] as const,
  lists: (params?: Record<string, unknown>) =>
    params
      ? ([...userNotificationsKeys.all, "list", params] as const)
      : ([...userNotificationsKeys.all, "list"] as const),
  detail: (id: string) => [...userNotificationsKeys.all, "detail", id] as const,
  update: (id: string) => [...userNotificationsKeys.all, "update", id] as const,
  remove: (id?: string) =>
    id
      ? ([...userNotificationsKeys.all, "remove", id] as const)
      : ([...userNotificationsKeys.all, "remove"] as const),
};

// Get notifications
export const useUserNotifications = () => {
  return useQuery({
    queryKey: userNotificationsKeys.all,
    queryFn: () => userNotificationService.getAllNotification(),
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
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userNotificationService.readNotification(id),
      mutationKey: userNotificationsKeys.update("update54321"),
    onSuccess: (notificationData) => {
      if (notificationData.isRead) {
        showToast.success(notificationData.message || `Notification marked as read!`, {
          icon: null,
          style: notificationStyles.alertSuccess,
        });
      }
      // Invalidate all user notifications
      queryClient.invalidateQueries({
        queryKey: userNotificationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: userNotificationsKeys.all,
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
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userNotificationService.deleteNotification(id),
    mutationKey: userNotificationsKeys.remove("delete54321"),
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
        queryKey: userNotificationsKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: userNotificationsKeys.all,
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

/* helpers to invalidate related queries after mutations */

export const invalidateAllUserNotifications = (qc: QueryClient) =>
  qc.invalidateQueries({ queryKey: userNotificationsKeys.all });

export const invalidateNotificationLists = (
  qc: QueryClient,
  params?: Record<string, unknown>
) => qc.invalidateQueries({ queryKey: userNotificationsKeys.lists(params) });

export const invalidateNotificationDetail = (qc: QueryClient, id: string) =>
  qc.invalidateQueries({ queryKey: userNotificationsKeys.detail(id) });
