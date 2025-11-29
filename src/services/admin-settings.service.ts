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
export type SizeType =
  | "bust"
  | "waist"
  | "hips"
  | "dressSize"
  | "height"
  | "chest"
  | "shoulder"
  | "inseam"
  | "clotheSize";

export interface CreateSizeChartRequest {
  type: SizeType;
  value: number;
  gender: "male" | "female";
  label?: string;
}

export interface SizeChartItem {
  id: string;
  value: number;
  label?: string;
}

// Be flexible to allow gender-specific keys coming from the API
export type SizeChartResponse = Record<string, SizeChartItem[]>;

export interface UpdateSizeChartRequest {
  value: number;
  gender?: "male" | "female";
  type?: SizeType;
  label?: string;
}

export interface SizeChartItemResponse {
  id: string;
  type: SizeType;
  value: number;
}

// Types for new styles endpoint
export interface SizeConfigPayload {
  sizeChartEntryId: string;
  fabricYards: number;
}

export interface CreateStyleRequest {
  name: string;
  sizeConfigs: SizeConfigPayload[];
  files: File[];
}

export interface UpdateStyleRequest {
  name?: string;
  sizeConfigs?: SizeConfigPayload[];
  files?: File[];
}

export interface DressStyleImage {
  id: string;
  url: string;
  publicId: string;
}

export interface DressStyle {
  id: number;
  name: string;
  images: DressStyleImage[];
  createdAt: string;
  sewingPrice?: number | string | null;
  sizeChartEntries?: Array<{
    id: string;
    fabricYards: string;
    sizeChartEntry: {
      id: string;
      label: string;
      chestMin: number | null;
      chestMax: number | null;
      waistMin: number | null;
      waistMax: number | null;
      hipsMin: number | null;
      hipsMax: number | null;
      neckMin: number | null;
      neckMax: number | null;
      shoulderMin: number | null;
      shoulderMax: number | null;
      heightMin: number | null;
      heightMax: number | null;
      chart: {
        id: string;
        name: string;
        gender: "male" | "female";
      };
    };
  }>;
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
    const response = await apiClient.get<ApiResponse<AdminProfile>>(
      "/admin/profile"
    );
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
  ): Promise<{ gender: "male" | "female" }> {
    const response = await apiClient.post<
      ApiResponse<{ gender: "male" | "female" }>
    >(`/size-chart/${request.gender}`, request);
    return response.data.data;
  }

  async getSizeChart(gender?: string): Promise<SizeChartResponse> {
    const response = await apiClient.get<ApiResponse<SizeChartResponse>>(
      `/size-chart/${gender}`
    );
    return response.data.data;
  }

  async getMySizeChart(): Promise<SizeChartResponse> {
    const response = await apiClient.get<ApiResponse<SizeChartResponse>>(
      `/size-chart/me`
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

  /* --------------------------------------------------------------------------------
   * Size Chart V2 (Multiple charts per gender with entries)
   * ------------------------------------------------------------------------------*/
  // V2 Types
  async getSkinTones(): Promise<Array<{ name: string; hex: string }>> {
    const response = await apiClient.get<
      ApiResponse<Array<{ name: string; hex: string }>>
    >("/size-chart/skin-tones");
    return response.data.data;
  }

  async getChartsByGender(
    gender: "male" | "female"
  ): Promise<
    Array<{
      id: string;
      name: string;
      gender: "male" | "female";
      entries: Array<{
        id: string;
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
      }>;
    }>
  > {
    const response = await apiClient.get<
      ApiResponse<
        Array<{
          id: string;
          name: string;
          gender: "male" | "female";
          entries: Array<{
            id: string;
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
          }>;
        }>
      >
    >(`/size-chart/${gender}`);
    return response.data.data;
  }

  async getChartById(
    id: string
  ): Promise<{
    id: string;
    name: string;
    gender: "male" | "female";
    entries: Array<{
      id: string;
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
    }>;
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        id: string;
        name: string;
        gender: "male" | "female";
        entries: Array<{
          id: string;
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
        }>;
      }>
    >(`/size-chart/chart/${id}`);
    return response.data.data;
  }

  async createChart(params: {
    gender: "male" | "female";
    name: string;
  }): Promise<{ id: string; name: string; gender: "male" | "female" }> {
    const response = await apiClient.post<
      ApiResponse<{ id: string; name: string; gender: "male" | "female" }>
    >(`/size-chart/${params.gender}`, { name: params.name });
    return response.data.data;
  }

  async createChartEntry(
    chartId: string,
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
    }
  ): Promise<{
    id: string;
    label: string;
  }> {
    const response = await apiClient.post<ApiResponse<{ id: string; label: string }>>(
      `/size-chart/${chartId}/entries`,
      payload
    );
    return response.data.data;
  }

  async updateChartEntry(
    entryId: string,
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
    }>
  ): Promise<{ id: string }> {
    const response = await apiClient.patch<ApiResponse<{ id: string }>>(
      `/size-chart/entries/${entryId}`,
      payload
    );
    return response.data.data;
  }

  async deleteChartEntry(entryId: string): Promise<{ affected: number }> {
    const response = await apiClient.delete<ApiResponse<{ affected: number }>>(
      `/size-chart/entries/${entryId}`
    );
    return response.data.data;
  }

  // Styles Management

  async createStyle(request: CreateStyleRequest): Promise<void> {
    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("sizeConfigs", JSON.stringify(request.sizeConfigs));

    request.files.forEach((file) => {
      formData.append("files", file);
    });

    await apiClient.post("/styles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 100000,
    });
  }

  async getDressStyles(): Promise<DressStyle[]> {
    const response = await apiClient.get<ApiResponse<DressStyle[]>>("/styles");
    return response.data.data;
  }

  async getDressStyle(id: number | string): Promise<DressStyle> {
    const response = await apiClient.get<ApiResponse<DressStyle>>(
      `/styles/${id}`
    );
    return response.data.data;
  }

  async deleteDressStyle(
    id: number | string
  ): Promise<DeleteDressStyleResponse> {
    const response = await apiClient.delete<
      ApiResponse<DeleteDressStyleResponse>
    >(`/styles/${id}`);
    return response.data.data;
  }

  async updateStyle(
    id: number | string,
    request: UpdateStyleRequest
  ): Promise<DressStyle> {
    const formData = new FormData();

    if (request.name) {
      formData.append("name", request.name);
    }

    if (request.sizeConfigs) {
      formData.append("sizeConfigs", JSON.stringify(request.sizeConfigs));
    }

    if (request.files && request.files.length > 0) {
      request.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await apiClient.put<ApiResponse<DressStyle>>(
      `/styles/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 100000,
      }
    );

    return response.data.data;
  }
}

export const adminSettingsService = new AdminSettingsService();
