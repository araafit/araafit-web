import apiClient from "../lib/axios";
import showToast from "../utils/notification";
import { notificationStyles } from "../style/custom";

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface ClaimDiscount {
  name: string;
  type: string;
  value: string | number;
  endDate: string;
}

type DiscountObjType = Record<"discount", ClaimDiscount>;

export const claimDiscount = async () => {
  try {
    const response = await apiClient.post<ApiResponse<DiscountObjType>>(
      "/discount/claim"
    );

    showToast.success("You've claimed your discount!", {
      icon: null,
      style: notificationStyles.alertSuccess,
      position: "top-center",
      duration: 5000
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    showToast.error("Unable claim discount!", {
      icon: null,
      style: notificationStyles.alertError,
      position: "top-center",
      duration: 5000
    });
  }
};
