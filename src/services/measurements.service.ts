import apiClient from "../lib/axios";
import type { ApiResponse } from "./auth.service";

export interface Measurements {
  bust: number;
  waist: number;
  hips: number;
  height: number;
  dressSize: number;
  skinTone: string;
}

export interface MeasurementsResponse {
  measurements: Measurements;
  lastUpdated: string;
}

export interface MeasurementsSummaryResponse {
  measurements: Measurements;
  formattedHeight: string;
  hasCompleteMeasurements: boolean;
  lastUpdated: string;
}

export interface CreateMeasurementsRequest {
  bust: number;
  waist: number;
  hips: number;
  height: number;
  dressSize: number;
  skinTone: string;
}

export interface CreateMeasurementsResponse {
  message: string;
  measurements: Measurements;
  lastUpdated: string;
}

export interface UpdateMeasurementsRequest {
  bust?: number;
  waist?: number;
  hips?: number;
  height?: number;
  dressSize?: number;
  skinTone?: string;
}

export interface UpdateMeasurementsResponse {
  message: string;
  measurements: Measurements;
  lastUpdated: string;
}

export const measurementsService = {
  async getMeasurements(): Promise<MeasurementsResponse> {
    const response = await apiClient.get<ApiResponse<MeasurementsResponse>>("/measurements/me");
    return response.data.data;
  },

  async getMeasurementsSummary(): Promise<MeasurementsSummaryResponse> {
    const response = await apiClient.get<ApiResponse<MeasurementsSummaryResponse>>("/measurements/me/summary");
    return response.data.data;
  },

  async createMeasurements(
    data: CreateMeasurementsRequest
  ): Promise<CreateMeasurementsResponse> {
    const response = await apiClient.post<ApiResponse<CreateMeasurementsResponse>>(
      "/measurements",
      data
    );
    return response.data.data;
  },

  async updateMeasurements(
    data: UpdateMeasurementsRequest
  ): Promise<UpdateMeasurementsResponse> {
    const response = await apiClient.patch<ApiResponse<UpdateMeasurementsResponse>>(
      "/measurements",
      data
    );
    return response.data.data;
  },
};
