import apiClient from "../lib/axios";
import { getFirebaseStorage } from "../lib/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import type { ApiResponse } from "./auth.service";

export type Gender = "male" | "female";

export interface Measurements {
  // Shared
  waist?: number;
  height?: number;
  skinTone?: string | null;

  // Female-specific
  bust?: number;
  hips?: number;
  dressSize?: string | null;

  // Male-specific
  chest?: number;
  neck?: number;
  inseam?: number;
  shoulder?: number;
  size?: string | null;
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

// Measurement sets v2
export interface MeasurementSizeAssignment {
  id: string;
  chartId: string;
  chartName: string;
  entryId: string;
  label: string;
}

export interface MeasurementAssignedSize {
  entryId: string;
  label: string;
  chartId: string;
  chartName: string;
}

export interface MeasurementSet {
  id: string;
  name: string;
  gender: string;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  neck: number | null;
  sleeve: number | null;
  inseam: number | null;
  shoulder: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
  assignedSize?: MeasurementAssignedSize | null;
  sizeAssignments: MeasurementSizeAssignment[];
}

export interface CreateMeasurementsRequest {
  gender?: Gender;
  name?: string;
  // Shared
  waist?: number;
  height?: number;
  skinTone?: string;
  // Female
  bust?: number;
  hips?: number;
  dressSize?: string;
  // Male
  chest?: number;
  neck?: number;
  inseam?: number;
  shoulder?: number;
  size?: string;
}

export interface CreateMeasurementsResponse {
  message: string;
  measurements: Measurements;
  lastUpdated: string;
  gender?: Gender;
}

export interface UpdateMeasurementsRequest extends CreateMeasurementsRequest {}

export interface UpdateMeasurementsResponse {
  message: string;
  measurements: Measurements;
  lastUpdated: string;
  gender?: Gender;
}

export interface UploadedImageInfo {
  url: string;
  publicId: string;
}

export interface UploadMeasurementImagesResponse {
  front: UploadedImageInfo;
  side: UploadedImageInfo;
}

// Response for GET /measurements/me
export interface MeasurementMe {
  measurements: Measurements;
  lastUpdated: string;
  gender: string | null;
  measurementSets: MeasurementSet[];
}

export const measurementsService = {
  async getMeasurements(): Promise<MeasurementMe> {
    const response = await apiClient.get<
      ApiResponse<{
        measurements: Measurements;
        lastUpdated: string;
        gender: string | null;
        measurementSets: MeasurementSet[];
      }>
    >("/measurements/me");
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
    // Normalize payload (e.g., coerce numeric dressSize to string)
    const payload: Record<string, unknown> = { ...data };
    if (typeof (payload as any).dressSize === "number") {
      (payload as any).dressSize = String((payload as any).dressSize);
    }
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    const response = await apiClient.patch<
      ApiResponse<{ measurements: Measurements; lastUpdated: string; gender?: Gender }>
    >("/measurements/measurement", payload);

    return {
      message: response.data.message,
      ...response.data.data,
    };
  },

  async updateMeasurements(
    data: UpdateMeasurementsRequest
  ): Promise<UpdateMeasurementsResponse> {
    // Normalize payload (e.g., coerce numeric dressSize to string)
    const payload: Record<string, unknown> = { ...data };
    if (typeof (payload as any).dressSize === "number") {
      (payload as any).dressSize = String((payload as any).dressSize);
    }
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    const response = await apiClient.patch<
      ApiResponse<{ measurements: Measurements; lastUpdated: string; gender?: Gender }>
    >("/measurements/measurement", payload);

    return {
      message: response.data.message,
      ...response.data.data,
    };
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
