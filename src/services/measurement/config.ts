/**
 * Measurement Service Configuration
 * Contains constants and configuration values for the measurement service
 */

import type { MeasurementConfig, ImagePreprocessingOptions } from "./types";

// Default configuration for measurement extraction
export const DEFAULT_MEASUREMENT_CONFIG: MeasurementConfig = {
  poseDetectionThreshold: 0.5,
  segmentationThreshold: 0.7,
  smoothingFactor: 0.8,
};

// Image preprocessing defaults
export const DEFAULT_IMAGE_PREPROCESSING: ImagePreprocessingOptions = {
  targetWidth: 512,
  targetHeight: 512,
  maintainAspectRatio: true,
  backgroundColor: "#FFFFFF",
};

// Dress size mapping based on measurements (in cm)
export const DRESS_SIZE_CHART = {
  US: {
    "0": { bust: 81, waist: 61, hip: 86 },
    "2": { bust: 84, waist: 64, hip: 89 },
    "4": { bust: 87, waist: 67, hip: 92 },
    "6": { bust: 90, waist: 70, hip: 95 },
    "8": { bust: 93, waist: 73, hip: 98 },
    "10": { bust: 96, waist: 76, hip: 101 },
    "12": { bust: 99, waist: 79, hip: 104 },
    "14": { bust: 102, waist: 82, hip: 107 },
    "16": { bust: 105, waist: 85, hip: 110 },
    "18": { bust: 108, waist: 88, hip: 113 },
    "20": { bust: 111, waist: 91, hip: 116 },
  },
  UK: {
    "4": { bust: 81, waist: 61, hip: 86 },
    "6": { bust: 84, waist: 64, hip: 89 },
    "8": { bust: 87, waist: 67, hip: 92 },
    "10": { bust: 90, waist: 70, hip: 95 },
    "12": { bust: 93, waist: 73, hip: 98 },
    "14": { bust: 96, waist: 76, hip: 101 },
    "16": { bust: 99, waist: 79, hip: 104 },
    "18": { bust: 102, waist: 82, hip: 107 },
    "20": { bust: 105, waist: 85, hip: 110 },
    "22": { bust: 108, waist: 88, hip: 113 },
    "24": { bust: 111, waist: 91, hip: 116 },
  },
  EU: {
    "32": { bust: 81, waist: 61, hip: 86 },
    "34": { bust: 84, waist: 64, hip: 89 },
    "36": { bust: 87, waist: 67, hip: 92 },
    "38": { bust: 90, waist: 70, hip: 95 },
    "40": { bust: 93, waist: 73, hip: 98 },
    "42": { bust: 96, waist: 76, hip: 101 },
    "44": { bust: 99, waist: 79, hip: 104 },
    "46": { bust: 102, waist: 82, hip: 107 },
    "48": { bust: 105, waist: 85, hip: 110 },
    "50": { bust: 108, waist: 88, hip: 113 },
    "52": { bust: 111, waist: 91, hip: 116 },
  },
};

// MediaPipe model paths
export const MEDIAPIPE_MODELS = {
  POSE_LANDMARKER:
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
  POSE_LANDMARKER_HEAVY:
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
  POSE_LANDMARKER_FULL:
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
};

// Body measurement ratios and proportions
export const BODY_PROPORTIONS = {
  // Head to height ratio
  HEAD_TO_HEIGHT: 0.125,

  // Shoulder to height ratio
  SHOULDER_TO_HEIGHT: 0.25,

  // Torso to height ratio (from shoulder to hip)
  TORSO_TO_HEIGHT: 0.42,

  // Hip width to shoulder width ratio (approximate)
  HIP_TO_SHOULDER_RATIO: 0.9,

  // Waist position relative to torso (from shoulders)
  WAIST_POSITION_RATIO: 0.6,

  // Bust position relative to torso (from shoulders)
  BUST_POSITION_RATIO: 0.3,

  // Arm length to height ratio
  ARM_TO_HEIGHT: 0.44,

  // Leg length to height ratio
  LEG_TO_HEIGHT: 0.5,
};

// Error codes for measurement service
export const MEASUREMENT_ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  MODEL_LOAD_FAILED: "MODEL_LOAD_FAILED",
  POSE_DETECTION_FAILED: "POSE_DETECTION_FAILED",
  SEGMENTATION_FAILED: "SEGMENTATION_FAILED",
  INSUFFICIENT_LANDMARKS: "INSUFFICIENT_LANDMARKS",
  CALCULATION_ERROR: "CALCULATION_ERROR",
  INVALID_HEIGHT: "INVALID_HEIGHT",
  IMAGE_PROCESSING_ERROR: "IMAGE_PROCESSING_ERROR",
} as const;

// Minimum confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  POSE_LANDMARK: 0.5,
  SEGMENTATION: 0.3, // Lowered from 0.7 to be more lenient
  OVERALL_MEASUREMENT: 0.4, // Lowered from 0.6
  CRITICAL_LANDMARKS: 0.6, // Lowered from 0.8
};

// Critical landmarks that must be detected for measurements
export const CRITICAL_LANDMARKS = [
  11, // LEFT_SHOULDER
  12, // RIGHT_SHOULDER
  23, // LEFT_HIP
  24, // RIGHT_HIP
  0, // NOSE (for height reference)
];

// Measurement smoothing parameters
export const SMOOTHING_PARAMS = {
  TEMPORAL_WEIGHT: 0.7,
  SPATIAL_WEIGHT: 0.3,
  OUTLIER_THRESHOLD: 2.0, // Standard deviations
};
