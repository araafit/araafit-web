import apiClient from "../lib/axios";

// Types for admin profile
export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateAdminProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateAdminPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateAdminPasswordResponse {
  message: string;
}

// Types for size chart
export type SizeType = "bust" | "waist" | "hips" | "dressSize";

export interface CreateSizeChartRequest {
  type: SizeType;
  value: number;
}

export interface SizeChartItem {
  id: string;
  value: number;
}

export interface SizeChartResponse {
  bust: SizeChartItem[];
  waist: SizeChartItem[];
  hips: SizeChartItem[];
  dressSize: SizeChartItem[];
}

export interface UpdateSizeChartRequest {
  value: number;
}

export interface SizeChartItemResponse {
  id: string;
  type: SizeType;
  value: number;
}

// Types for dress styles
export interface CreateDressStyleRequest {
  dressStyle: string;
  dressSize: string;
  yardEstimate: number;
  files: File[];
}

export interface DressStyleImage {
  id: string;
  url: string;
  publicId: string;
}

export interface DressStyle {
  id: string;
  dressStyle: string;
  dressSize: string;
  yardEstimate: number;
  images: DressStyleImage[];
}

export interface CreateDressStyleResponse {
  message: string;
  style: DressStyle;
}

export interface DeleteDressStyleResponse {
  affected: number;
}

// Wrapper type for API responses
interface ApiResponse<T> {
  data: T;
}

class AdminSettingsService {
  // Admin Profile Management
  async getProfile(): Promise<AdminProfile> {
    const response = await apiClient.get<ApiResponse<AdminProfile>>("/admin/profile");
    return response.data.data;
  }

  async updateProfile(
    request: UpdateAdminProfileRequest
  ): Promise<UpdateAdminProfileResponse> {
    const response = await apiClient.patch<
      ApiResponse<UpdateAdminProfileResponse>
    >("/admin/update-profile", request);
    return response.data.data;
  }

  async updatePassword(
    request: UpdateAdminPasswordRequest
  ): Promise<UpdateAdminPasswordResponse> {
    const response = await apiClient.patch<
      ApiResponse<UpdateAdminPasswordResponse>
    >("/admin/update-password", request);
    return response.data.data;
  }

  // Size Chart Management
  async createSizeChart(
    request: CreateSizeChartRequest
  ): Promise<SizeChartItemResponse> {
    const response = await apiClient.post<ApiResponse<SizeChartItemResponse>>(
      "/size-chart",
      request
    );
    return response.data.data;
  }

  async getSizeChart(): Promise<SizeChartResponse> {
    const response = await apiClient.get<ApiResponse<SizeChartResponse>>(
      "/size-chart"
    );
    return response.data.data;
  }

  async updateSizeChart(
    id: string,
    request: UpdateSizeChartRequest
  ): Promise<SizeChartItemResponse> {
    const response = await apiClient.patch<ApiResponse<SizeChartItemResponse>>(
      `/size-chart/${id}`,
      request
    );
    return response.data.data;
  }

  // Dress Styles Management
  async createDressStyle(
    request: CreateDressStyleRequest
  ): Promise<CreateDressStyleResponse> {
    const formData = new FormData();
    formData.append("dressStyle", request.dressStyle);
    formData.append("dressSize", request.dressSize);
    formData.append("yardEstimate", request.yardEstimate.toString());

    request.files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post<
      ApiResponse<CreateDressStyleResponse>
    >("/dress-styles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 100000, // 100 seconds for file upload
    });
    return response.data.data;
  }

  async getDressStyles(): Promise<DressStyle[]> {
    const response = await apiClient.get<ApiResponse<DressStyle[]>>(
      "/dress-styles"
    );
    return response.data.data;
  }

  async getDressStyle(id: string): Promise<DressStyle> {
    const response = await apiClient.get<ApiResponse<DressStyle>>(
      `/dress-styles/${id}`
    );
    return response.data.data;
  }

  async deleteDressStyle(id: string): Promise<DeleteDressStyleResponse> {
    const response = await apiClient.delete<
      ApiResponse<DeleteDressStyleResponse>
    >(`/dress-styles/${id}`);
    return response.data.data;
  }
}

export const adminSettingsService = new AdminSettingsService();
