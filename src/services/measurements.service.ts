import apiClient from "../lib/axios";
import { getFirebaseStorage } from "../lib/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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

export interface UploadedImageInfo {
  url: string;
  publicId: string;
}

export interface UploadMeasurementImagesResponse {
  front: UploadedImageInfo;
  side: UploadedImageInfo;
}

export interface MeasurementMe {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  deliveryAddress: string;
  dateOfBirth: string;
  isVerified: string;
  phoneNumber: string | number;
  city: string;
  zipCode: string | null;
  bust: number | null;
  waist: number | null;
  hips: number | null;
  height: number | null;
  dressSize: number | null;
  chest: string | null;
  skinTone: string | null;
  inseam: string | number | null;
  shoulder: number | null;
  size: string | null;
  gender: string | null;
  isGuest: boolean;
  orderCount: number;
  createdAt: string;
  updateAt: string;
  isActive: boolean;
  blockReason: string | null;
}

export const measurementsService = {
  async getMeasurements(): Promise<MeasurementMe> {
    const response = await apiClient.get<ApiResponse<MeasurementMe>>(
      "/measurements/me"
    );
    return response.data.data;
  },

  async getMeasurementsSummary(): Promise<MeasurementsSummaryResponse> {
    const response = await apiClient.get<
      ApiResponse<MeasurementsSummaryResponse>
    >("/measurements/me/summary");
    return response.data.data;
  },

  async createMeasurements(
    data: CreateMeasurementsRequest
  ): Promise<CreateMeasurementsResponse> {
    const response = await apiClient.patch<
      ApiResponse<CreateMeasurementsResponse>
    >("/measurements/measurement", data);
    return response.data.data;
  },

  async updateMeasurements(
    data: UpdateMeasurementsRequest
  ): Promise<UpdateMeasurementsResponse> {
    const response = await apiClient.patch<
      ApiResponse<UpdateMeasurementsResponse>
    >("/measurements/measurement", data);
    return response.data.data;
  },

  async uploadMeasurementImages(
    front: File,
    side: File
  ): Promise<UploadMeasurementImagesResponse> {
    const storage = getFirebaseStorage();

    const toExt = (mime: string): string => {
      if (mime.includes("jpeg")) return "jpg";
      if (mime.includes("png")) return "png";
      if (mime.includes("webp")) return "webp";
      return "jpg";
    };

    const uid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const makePath = (type: "front" | "side", file: File): string => {
      const ext = toExt(file.type || "image/jpeg");
      return `measurement-images/${uid}-${type}.${ext}`;
    };

    const uploadOne = async (type: "front" | "side", file: File) => {
      console.log("uploading one", type, file);
      const path = makePath(type, file);
      const storageRef = ref(storage, path);
      const uploadTask = await uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });
      const url = await getDownloadURL(uploadTask.ref);
      return { url, publicId: path } as UploadedImageInfo;
    };

    const [frontInfo, sideInfo] = await Promise.all([
      uploadOne("front", front),
      uploadOne("side", side),
    ]);

    return { front: frontInfo, side: sideInfo };
  },
};
