import { useMutation, useQuery } from "@tanstack/react-query";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";
import { landingPageService } from "../services/landing-page.service";

/* ---------------------------------------------------------------------------------- */

export const useClaimDiscount = () => {
  return useMutation({
    mutationFn: () => landingPageService.claimDiscount(),
    onSuccess: () => {
      showToast.success("You've claimed your discount!", {
        icon: null,
        style: notificationStyles.alertSuccess,
        position: "top-center",
        duration: 5000,
      });
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      showToast.error(
        axiosError.response?.data?.message || "Unable claim discount!",
        {
          icon: null,
          style: notificationStyles.alertError,
          position: "top-center",
          duration: 5000,
        }
      );
    },
  });
};

export const useActiveDiscounts = () => {
  return useQuery({
    queryFn: () => landingPageService.getActiveDiscounts(),
    queryKey: ["activeDiscounts"],
    staleTime: 2 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      const axiosError = error as { response?: { status?: number } };
      if (
        axiosError?.response?.status === 401 ||
        axiosError?.response?.status === 403
      )
        return false;
      return failureCount < 1;
    },
  });
};
