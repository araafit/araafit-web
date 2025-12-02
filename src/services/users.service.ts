import apiClient from "../lib/axios";
import type { ApiResponse } from "./auth.service";
import type { User } from "../stores/auth-store";

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  city?: string;
  zipCode?: string;
  bust?: number;
  waist?: number;
  hips?: number;
  height?: number;
  dressSize?: number;
  skinTone?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface DeleteMeResponse {
  message: string;
}

export const usersService = {
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await apiClient.patch<ApiResponse<UpdateProfileResponse>>(
      "/users/profile",
      data
    );
    return response.data.data;
  },

  async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse> {
    const response = await apiClient.patch<UpdatePasswordResponse>(
      "/users/password",
      data
    );
    return response.data;
  },

  async deleteMe(userId): Promise<DeleteMeResponse> {
    const response = await apiClient.delete<DeleteMeResponse>(`/customers/${userId}`);
    return response.data;
  },
};


