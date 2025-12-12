/**
 * Measurement Service Types and Interfaces
 * Defines all types used in the measurement extraction service
 */

// Landmark coordinates from MediaPipe
export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

// Photo input for measurement analysis
// Note: Accepts Blob (including File) since browser-image-compression can return either
export interface PhotoInput {
  frontPhoto: File | Blob | HTMLImageElement | HTMLCanvasElement;
  sidePhoto: File | Blob | HTMLImageElement | HTMLCanvasElement;
  heightInCm: number;
}

// Raw measurements extracted from photos
export interface RawMeasurements {
  bust: number;
  waist: number;
  hip: number;
  height: number;
  shoulderWidth: number;
  armLength: number;
  torsoLength: number;
  inseam: number;
  neckCircumference: number;
  bustCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
}

// Dress size based on measurements
export interface DressSize {
  us: string;
  uk: string;
  eu: string;
  measurements: {
    bust: number;
    waist: number;
    hip: number;
  };
}

// Final measurement result
export interface MeasurementResult {
  measurements: RawMeasurements;
  dressSize: DressSize;
  confidence: number;
  metadata: {
    processedAt: Date;
    frontPhotoLandmarks: number;
    sidePhotoLandmarks: number;
    processingTimeMs: number;
    heightInCm: number;
  };
  debug?: {
    frontMask?: ImageData;
    sideMask?: ImageData;
    frontLandmarks?: Landmark[];
    sideLandmarks?: Landmark[];
  };
}

// Configuration for measurement extraction
export interface MeasurementConfig {
  poseDetectionThreshold: number;
  segmentationThreshold: number;
  smoothingFactor: number;
  pixelToCmRatio?: number;
}

// Error types for measurement service
export class MeasurementError extends Error {
  constructor(message: string, public code: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = "MeasurementError";
  }
}

// Pose landmark indices based on MediaPipe BlazePose model
export enum PoseLandmarks {
  NOSE = 0,
  LEFT_EYE_INNER = 1,
  LEFT_EYE = 2,
  LEFT_EYE_OUTER = 3,
  RIGHT_EYE_INNER = 4,
  RIGHT_EYE = 5,
  RIGHT_EYE_OUTER = 6,
  LEFT_EAR = 7,
  RIGHT_EAR = 8,
  MOUTH_LEFT = 9,
  MOUTH_RIGHT = 10,
  LEFT_SHOULDER = 11,
  RIGHT_SHOULDER = 12,
  LEFT_ELBOW = 13,
  RIGHT_ELBOW = 14,
  LEFT_WRIST = 15,
  RIGHT_WRIST = 16,
  LEFT_PINKY = 17,
  RIGHT_PINKY = 18,
  LEFT_INDEX = 19,
  RIGHT_INDEX = 20,
  LEFT_THUMB = 21,
  RIGHT_THUMB = 22,
  LEFT_HIP = 23,
  RIGHT_HIP = 24,
  LEFT_KNEE = 25,
  RIGHT_KNEE = 26,
  LEFT_ANKLE = 27,
  RIGHT_ANKLE = 28,
  LEFT_HEEL = 29,
  RIGHT_HEEL = 30,
  LEFT_FOOT_INDEX = 31,
  RIGHT_FOOT_INDEX = 32,
}

// Image preprocessing options
export interface ImagePreprocessingOptions {
  targetWidth: number;
  targetHeight: number;
  maintainAspectRatio: boolean;
  backgroundColor: string;
}

// Progress callback for long-running operations
export type ProgressCallback = (progress: number, stage: string) => void;
