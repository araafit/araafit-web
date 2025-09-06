/**
 * Measurement Service Module
 * Main entry point for the measurement extraction service
 */

import { MeasurementService } from "./measurement-service";
import type { MeasurementConfig, MeasurementResult, PhotoInput, ProgressCallback } from "./types";

// Main service class
export { MeasurementService } from "./measurement-service";

// Individual service components
export { PoseDetectorService } from "./pose-detector";
export { BodySegmentationService } from "./body-segmentation";
export { MeasurementCalculatorService } from "./measurement-calculator";
export { DressSizeCalculatorService } from "./dress-size-calculator";

// Skin tone extraction
export { extractSkinToneFromPhoto, rgbToHex, getSkinToneName } from "./skin-tone-extractor";

// Types and interfaces
export type {
  Landmark,
  PhotoInput,
  RawMeasurements,
  MeasurementResult,
  DressSize,
  MeasurementConfig,
  ImagePreprocessingOptions,
  ProgressCallback,
} from "./types";

// Error class
export { MeasurementError } from "./types";

// Configuration and constants
export {
  DEFAULT_MEASUREMENT_CONFIG,
  DEFAULT_IMAGE_PREPROCESSING,
  DRESS_SIZE_CHART,
  MEDIAPIPE_MODELS,
  BODY_PROPORTIONS,
  MEASUREMENT_ERROR_CODES,
  CONFIDENCE_THRESHOLDS,
  CRITICAL_LANDMARKS,
  SMOOTHING_PARAMS,
} from "./config";

// Utility functions
export {
  calculateDistance,
  calculateMidpoint,
  pixelsToCentimeters,
  validateLandmarks,
  smoothMeasurement,
  calculateCircumference,
  preprocessImage,
  calculateAngle,
  validateInput,
  calculateStatistics,
  debounce,
} from "./utils";

/**
 * Create a new measurement service instance with optional configuration
 *
 * @example
 * ```typescript
 * import { createMeasurementService } from './services/measurement';
 *
 * const measurementService = createMeasurementService({
 *   poseDetectionThreshold: 0.7,
 *   segmentationThreshold: 0.8,
 * });
 *
 * await measurementService.initialize((progress, stage) => {
 *   console.log(`${stage}: ${Math.round(progress * 100)}%`);
 * });
 *
 * const result = await measurementService.extractMeasurements({
 *   frontPhoto: frontImageFile,
 *   sidePhoto: sideImageFile,
 *   heightInCm: 170,
 * });
 *
 * console.log('Measurements:', result.measurements);
 * console.log('Dress size:', result.dressSize);
 * ```
 */
export function createMeasurementService(
  config?: Partial<MeasurementConfig>
): MeasurementService {
  return MeasurementService.create(config);
}

/**
 * Quick measurement extraction with default configuration
 * Initializes service, extracts measurements, and cleans up
 *
 * @example
 * ```typescript
 * import { quickMeasurementExtraction } from './services/measurement';
 *
 * const result = await quickMeasurementExtraction({
 *   frontPhoto: frontImageFile,
 *   sidePhoto: sideImageFile,
 *   heightInCm: 170,
 * }, (progress, stage) => {
 *   console.log(`${stage}: ${Math.round(progress * 100)}%`);
 * });
 * ```
 */
export async function quickMeasurementExtraction(
  input: PhotoInput,
  progressCallback?: ProgressCallback,
  config?: Partial<MeasurementConfig>
): Promise<MeasurementResult> {
  const service = createMeasurementService(config);

  try {
    await service.initialize((progress, stage) => {
      progressCallback?.(progress * 0.3, stage);
    });

    const result = await service.extractMeasurements(
      input,
      (progress, stage) => {
        progressCallback?.(0.3 + progress * 0.7, stage);
      }
    );

    return result;
  } finally {
    service.dispose();
  }
}

/**
 * Validate if the required dependencies are available
 */
export function validateDependencies(): {
  isValid: boolean;
  missing: string[];
  warnings: string[];
} {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check for MediaPipe
  try {
    import("@mediapipe/tasks-vision");
  } catch {
    missing.push("@mediapipe/tasks-vision");
  }

  // Check for TensorFlow
  try {
    import("@tensorflow/tfjs");
  } catch {
    missing.push("@tensorflow/tfjs");
  }

  // Check for Body Segmentation
  try {
    import("@tensorflow-models/body-segmentation");
  } catch {
    missing.push("@tensorflow-models/body-segmentation");
  }

  // Check browser capabilities
  if (typeof window !== "undefined") {
    if (!window.HTMLCanvasElement) {
      warnings.push("Canvas API not available");
    }

    if (!window.ImageData) {
      warnings.push("ImageData API not available");
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      warnings.push("Camera access not available");
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

// Version information
export const VERSION = "1.0.0";
export const SUPPORTED_IMAGE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
export const RECOMMENDED_IMAGE_SIZE = { width: 512, height: 512 };
