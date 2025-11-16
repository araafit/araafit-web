import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fabricRequestService } from "../services/request.service";
import type { SewingRequest } from "../services/request.service";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
import useAuth from "./use-auth";

/* --------------------------------------------------------------------- */

// Query keys
export const requestskeys = {
  all: ["requests"] as const,
  makeRequest: (id: string) => [...requestskeys.all, id],
} as const;

export const useGetSawingRequests = () => {
  return useQuery({
    queryKey: requestskeys.all,
    queryFn: () => fabricRequestService.getSewingRequest(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMakeSewingRequest = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SewingRequest) =>
      fabricRequestService.makeSewingRequest(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: requestskeys.all });

      showToast.success(
        response.message || "Sewing request made successfully!",
        {
          icon: null,
          style: notificationStyles.alertSuccess,
          duration: 7000,
        }
      );

      setTimeout(() => {
        window.location.href = isAuthenticated ? "/dashboard/shop" : "/shop";
      }, 1000);
    },
    onError: (error) => {
      console.log("Failed to make sewing request:", error);
      showToast.error("Failed to make request. Please try again.", {
        icon: null,
        style: notificationStyles.alertError,
        duration: 5000,
      });
    },
  });
};
